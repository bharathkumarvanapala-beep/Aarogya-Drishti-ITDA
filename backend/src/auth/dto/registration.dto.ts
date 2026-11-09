import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Target portal role for registration',
    example: 'doctor',
    enum: ['doctor', 'asha', 'anm', 'hospital_coordinator', 'admin'],
  })
  @IsNotEmpty({ message: 'Portal role is required' })
  @IsString()
  @IsIn(['doctor', 'asha', 'anm', 'hospital_coordinator', 'admin', 'ASHA_WORKER', 'ANM_WORKER', 'MEDICAL_OFFICER', 'DISTRICT_ADMIN', 'HOSPITAL_STAFF'], {
    message: 'Invalid portal role specified',
  })
  portalRole: string;

  @ApiProperty({ description: 'Full legal name of the professional', example: 'Dr. Ramesh Kumar' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(128)
  fullName: string;

  @ApiPropertyOptional({ description: 'Telugu script name', example: 'రమేష్ కుమార్' })
  @IsOptional()
  @IsString()
  nameTe?: string;

  @ApiProperty({ description: 'Registered mobile phone number', example: '9849012345' })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString()
  @MinLength(10, { message: 'Mobile number must be at least 10 digits' })
  @MaxLength(20)
  mobileNumber: string;

  @ApiPropertyOptional({ description: 'Official email address', example: 'ramesh.phc@ap.gov.in' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  email?: string;

  @ApiProperty({ description: 'Account password', example: 'DoctorSecure@2026' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ description: 'Password confirmation', example: 'DoctorSecure@2026' })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @IsString()
  confirmPassword: string;

  // Doctor specific fields
  @ApiPropertyOptional({ description: 'Doctor ID, if already assigned', example: 'DOC-ASR-104' })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Medical qualification', example: 'MBBS, MD (General Medicine)' })
  @IsOptional()
  @IsString()
  medicalQualification?: string;

  @ApiPropertyOptional({ description: 'Specialization', example: 'Oral Oncology' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ description: 'APMC or State Medical Council registration number', example: 'APMC/2019/04812' })
  @IsOptional()
  @IsString()
  apmcRegNumber?: string;

  // ASHA specific fields
  @ApiPropertyOptional({ description: 'Official ASHA ID', example: 'ASHA-GMAD-14' })
  @IsOptional()
  @IsString()
  ashaId?: string;

  @ApiPropertyOptional({ description: 'Assigned village or habitation area', example: 'Kothapalli' })
  @IsOptional()
  @IsString()
  assignedVillage?: string;

  // ANM specific fields
  @ApiPropertyOptional({ description: 'Official ANM ID', example: 'ANM-GMAD-02' })
  @IsOptional()
  @IsString()
  anmId?: string;

  @ApiPropertyOptional({ description: 'Assigned Health Centre / Sub-Centre', example: 'G. Madugula Sub-Centre' })
  @IsOptional()
  @IsString()
  assignedHealthCentre?: string;

  // Common administrative fields
  @ApiPropertyOptional({ description: 'Assigned mandal', example: 'G. Madugula' })
  @IsOptional()
  @IsString()
  mandal?: string;

  @ApiPropertyOptional({ description: 'District', example: 'Alluri Sitharama Raju' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Hospital / Facility name for coordinator role', example: 'District Hospital Paderu' })
  @IsOptional()
  @IsString()
  facilityName?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Registered mobile number, Doctor/ASHA/ANM ID, or email',
    example: '9849012345',
  })
  @IsNotEmpty({ message: 'Registered mobile number or ID is required' })
  @IsString()
  identifier: string;

  @ApiPropertyOptional({
    description: 'Portal role associated with the account',
    example: 'doctor',
    enum: ['doctor', 'asha', 'anm', 'admin', 'hospital_coordinator'],
  })
  @IsOptional()
  @IsString()
  portal?: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token or verified OTP' })
  @IsNotEmpty({ message: 'Reset token is required' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'New secure password' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @ApiProperty({ description: 'Confirm new password' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString()
  confirmPassword: string;
}

export class AdminApprovalDto {
  @ApiProperty({
    description: 'Approval decision action',
    enum: ['APPROVE', 'REJECT', 'SUSPEND'],
    example: 'APPROVE',
  })
  @IsNotEmpty({ message: 'Action is required' })
  @IsIn(['APPROVE', 'REJECT', 'SUSPEND'], { message: 'Action must be APPROVE, REJECT, or SUSPEND' })
  action: 'APPROVE' | 'REJECT' | 'SUSPEND';

  @ApiPropertyOptional({
    description: 'Reason for rejection or suspension',
    example: 'Medical council registration could not be verified on APMC database.',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

