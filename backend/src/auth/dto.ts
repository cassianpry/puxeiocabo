import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password (min 8 chars)' })
  password: string;

  @ApiProperty({ example: true, description: 'Consent to privacy policy' })
  consent: boolean;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password' })
  password: string;
}

export class LinkShortIdDto {
  @ApiProperty({ example: '123456789', description: 'SF6 short_id (BigInt as string)' })
  shortId: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPass123', description: 'Current password' })
  currentPassword: string;

  @ApiProperty({ example: 'newPass456', description: 'New password (min 6 chars)' })
  newPassword: string;

  @ApiProperty({ example: 'newPass456', description: 'Confirm new password' })
  confirmNewPassword: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'user' })
  role: string;
}
