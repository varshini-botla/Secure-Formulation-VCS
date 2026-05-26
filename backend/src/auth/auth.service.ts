import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(data: any) {
    const existing = await this.userService.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const { department, ...userData } = data;
    let departmentId: string | null = null;

    if (department) {
      const dep = await this.prisma.department.findUnique({
        where: { name: department === 'Research & Development' ? 'R&D' : department },
      });
      if (dep) {
        departmentId = dep.id;
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
      role: data.role || Role.SCIENTIST,
      departmentId,
    });

    return this.login(user);
  }
}
