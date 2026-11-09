import { describe, it, expect } from 'vitest';
import { DEMO_USERS } from '../demoUsers';
import type { UserRole } from '../../types';

describe('Website Unit Test: Demo Personas & Multi-Tier Role Scoping', () => {
  const roles: UserRole[] = ['health_worker', 'doctor', 'specialist', 'hospital_coordinator', 'admin'];

  it('should define all multi-tier personas for the ASR pilot ecosystem', () => {
    for (const role of roles) {
      expect(DEMO_USERS[role], `Missing demo user for role: ${role}`).toBeDefined();
      expect(DEMO_USERS[role].role).toBe(role);
      expect(DEMO_USERS[role].name).toBeDefined();
      expect(DEMO_USERS[role].nameTe).toBeDefined();
      expect(DEMO_USERS[role].roleTitle).toBeDefined();
      expect(DEMO_USERS[role].roleTitleTe).toBeDefined();
    }
  });

  it('should correctly configure ASHA Worker Lakshmi Devi with assigned tribal villages', () => {
    const asha = DEMO_USERS.health_worker;
    expect(asha.name).toBe('Lakshmi Devi');
    expect(asha.facility).toBe('G. Madugula Sub-Centre');
    expect(asha.district).toBe('Alluri Sitharama Raju');
    expect(asha.assignedVillages).toContain('Kothapalli');
    expect(asha.assignedVillages).toContain('Nurmati');
    expect(asha.assignedVillages).toContain('Solabham');
  });

  it('should correctly configure Medical Officer Dr. Suresh at G. Madugula PHC', () => {
    const doctor = DEMO_USERS.doctor;
    expect(doctor.name).toContain('Dr. K. Suresh');
    expect(doctor.facility).toBe('G. Madugula PHC');
    expect(doctor.roleTitle).toContain('Medical Officer');
  });

  it('should configure District Hospital Paderu referral coordinator Rajesh Varma', () => {
    const coordinator = DEMO_USERS.hospital_coordinator;
    expect(coordinator.name).toBe('Rajesh Varma');
    expect(coordinator.facility).toBe('District Hospital, Paderu');
    expect(coordinator.roleTitle).toContain('Patient Navigator');
  });

  it('should configure Project Officer ITDA Paderu administrative governance', () => {
    const admin = DEMO_USERS.admin;
    expect(admin.name).toBe('Srikanth Rao, IAS');
    expect(admin.roleTitle).toContain('Project Officer, ITDA Paderu');
  });
});
