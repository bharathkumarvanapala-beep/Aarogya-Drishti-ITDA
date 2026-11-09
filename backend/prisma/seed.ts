import { PrismaClient, RoleCode, FacilityType, HabitationCategory, Gender, CardStatus, CardAction, AuthorizationBasis, ConsentType, ConsentStatus, ScreeningStatus, RiskImpression, OralViewKey, QualityVerdict, TriageCategory, ClinicalAction, ReferralUrgency, ReferralStatus, AppointmentStatus, InvestigationType, BiopsyStage, HistopathVerdict, FollowUpType, FollowUpStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Aarogya Drishti clinical seed pipeline...');

  // 1. Roles
  console.log('... Seeding system roles');
  const roles = [
    { code: RoleCode.SUPER_ADMIN, name: 'Super Administrator', description: 'System-wide governance, security, and administrative oversight' },
    { code: RoleCode.DISTRICT_ADMIN, name: 'District Health Administrator', description: 'ITDA Paderu and DM&HO district oversight and monitoring' },
    { code: RoleCode.MEDICAL_OFFICER, name: 'Medical Officer (PHC/CHC)', description: 'Primary health center physician performing clinical triage and APMC reviews' },
    { code: RoleCode.COMMUNITY_HEALTH_OFFICER, name: 'Community Health Officer', description: 'Health and Wellness Centre (HWC) clinical coordinator' },
    { code: RoleCode.ASHA_WORKER, name: 'Frontline ASHA Worker', description: 'Accredited Social Health Activist conducting doorstep screenings and consent' },
    { code: RoleCode.SPECIALIST_DOCTOR, name: 'Specialist Oncologist', description: 'District Hospital Head & Neck Surgical Oncologist' },
    { code: RoleCode.LAB_TECHNICIAN, name: 'Diagnostic Lab Technician', description: 'Histopathology and biopsy processing laboratory technician' },
    { code: RoleCode.PATIENT, name: 'Patient / Community Member', description: 'Patient or designated family caregiver portal access' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description },
      create: role,
    });
  }

  // 2. Mandals (ITDA Paderu, Alluri Sitharama Raju District)
  console.log('... Seeding ITDA Paderu mandals');
  const mandals = [
    { code: 'PADERU', name: 'Paderu', nameTe: 'పాడేరు', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
    { code: 'ARAKU_VALLEY', name: 'Araku Valley', nameTe: 'అరకు లోయ', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
    { code: 'HUKUMPETA', name: 'Hukumpeta', nameTe: 'హుకుంపేట', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
    { code: 'DUMBRIGUDA', name: 'Dumbriguda', nameTe: 'డుంబ్రిగుడ', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
    { code: 'ANANTHAGIRI', name: 'Ananthagiri', nameTe: 'అనంతగిరి', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
    { code: 'CHINTAPALLI', name: 'Chintapalli', nameTe: 'చింతపల్లి', district: 'Alluri Sitharama Raju', itdaAgency: 'ITDA Paderu' },
  ];

  const createdMandals: Record<string, string> = {};
  for (const m of mandals) {
    const mandalRecord = await prisma.mandal.upsert({
      where: { code: m.code },
      update: { name: m.name, nameTe: m.nameTe },
      create: m,
    });
    createdMandals[m.code] = mandalRecord.id;
  }

  // 3. Healthcare Facilities
  console.log('... Seeding healthcare facilities');
  const facilities = [
    {
      code: 'DH-PADERU',
      name: 'District Hospital Paderu',
      type: FacilityType.DISTRICT_HOSPITAL,
      mandalId: createdMandals['PADERU'],
      contactPhone: '+91-8935-241222',
      contactEmail: 'dh.paderu@asr.ap.gov.in',
      latitude: 18.0833,
      longitude: 82.6667,
    },
    {
      code: 'AH-ARAKU',
      name: 'Area Hospital Araku',
      type: FacilityType.AREA_HOSPITAL,
      mandalId: createdMandals['ARAKU_VALLEY'],
      contactPhone: '+91-8936-249333',
      contactEmail: 'ah.araku@asr.ap.gov.in',
      latitude: 18.3333,
      longitude: 82.8667,
    },
    {
      code: 'CHC-PADERU',
      name: 'Community Health Centre Paderu',
      type: FacilityType.COMMUNITY_HEALTH_CENTRE,
      mandalId: createdMandals['PADERU'],
      contactPhone: '+91-8935-241100',
      contactEmail: 'chc.paderu@asr.ap.gov.in',
      latitude: 18.0750,
      longitude: 82.6580,
    },
    {
      code: 'SC-KOTHAPALLI',
      name: 'Sub Centre Kothapalli',
      type: FacilityType.SUB_CENTRE,
      mandalId: createdMandals['PADERU'],
      contactPhone: '+91-8935-241099',
      contactEmail: 'sc.kothapalli@asr.ap.gov.in',
      latitude: 18.0920,
      longitude: 82.6810,
    },
  ];

  const createdFacilities: Record<string, string> = {};
  for (const f of facilities) {
    const facilityRecord = await prisma.facility.upsert({
      where: { code: f.code },
      update: { name: f.name, contactPhone: f.contactPhone },
      create: f,
    });
    createdFacilities[f.code] = facilityRecord.id;
  }

  // 4. Villages & Tribal Habitations
  console.log('... Seeding villages and habitations');
  const villages = [
    {
      code: 'VIL-KOTHAPALLI',
      name: 'Kothapalli',
      nameTe: 'కొత్తపల్లి',
      mandalId: createdMandals['PADERU'],
      primaryFacilityId: createdFacilities['SC-KOTHAPALLI'],
      habitationCategory: HabitationCategory.PVTG,
      approxPopulation: 680,
      latitude: 18.0945,
      longitude: 82.6840,
    },
    {
      code: 'VIL-NURMATI',
      name: 'Nurmati',
      nameTe: 'నూర్మతి',
      mandalId: createdMandals['PADERU'],
      primaryFacilityId: createdFacilities['SC-KOTHAPALLI'],
      habitationCategory: HabitationCategory.PVTG,
      approxPopulation: 520,
      latitude: 18.1020,
      longitude: 82.6950,
    },
    {
      code: 'VIL-GMADUGULA',
      name: 'G.Madugula',
      nameTe: 'జి.మాడుగుల',
      mandalId: createdMandals['PADERU'],
      primaryFacilityId: createdFacilities['CHC-PADERU'],
      habitationCategory: HabitationCategory.AGENCY_SCHEDULED,
      approxPopulation: 1450,
      latitude: 17.9800,
      longitude: 82.5200,
    },
    {
      code: 'VIL-PEDABAYALU',
      name: 'Pedabayalu',
      nameTe: 'పెదబయలు',
      mandalId: createdMandals['PADERU'],
      primaryFacilityId: createdFacilities['CHC-PADERU'],
      habitationCategory: HabitationCategory.AGENCY_SCHEDULED,
      approxPopulation: 1890,
      latitude: 18.2500,
      longitude: 82.5500,
    },
  ];

  const createdVillages: Record<string, string> = {};
  for (const v of villages) {
    const villageRecord = await prisma.village.upsert({
      where: { code: v.code },
      update: { name: v.name, nameTe: v.nameTe },
      create: v,
    });
    createdVillages[v.code] = villageRecord.id;
  }

  // 5. User Accounts & Role Assignments (Matching Frontend Mock Personas)
  console.log('... Seeding standard test personas');

  // Universal dev password hash for testing ($argon2id$ or test bcrypt equivalent)
  const defaultPasswordHash = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dGVzdF9oYXNoX2Fhcm9neWFfZHJpc2h0aV8yMDI2';

  // Frontline Health Worker: Lakshmi Devi (ASHA)
  const roleAsha = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ASHA_WORKER } });
  const ashaUser = await prisma.userAccount.upsert({
    where: { username: 'asha_lakshmi' },
    update: { fullName: 'Lakshmi Devi', phone: '+91-94401-23456' },
    create: {
      username: 'asha_lakshmi',
      email: 'lakshmi.asha@asr.ap.gov.in',
      fullName: 'Lakshmi Devi',
      passwordHash: defaultPasswordHash,
      phone: '+91-94401-23456',
      isActive: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: ashaUser.id, roleId: roleAsha.id } },
    update: {},
    create: { userId: ashaUser.id, roleId: roleAsha.id },
  });
  await prisma.userFacilityAssignment.upsert({
    where: { userId_facilityId: { userId: ashaUser.id, facilityId: createdFacilities['SC-KOTHAPALLI'] } },
    update: {},
    create: { userId: ashaUser.id, facilityId: createdFacilities['SC-KOTHAPALLI'], isPrimary: true },
  });
  await prisma.userVillageAssignment.upsert({
    where: { userId_villageId: { userId: ashaUser.id, villageId: createdVillages['VIL-KOTHAPALLI'] } },
    update: {},
    create: { userId: ashaUser.id, villageId: createdVillages['VIL-KOTHAPALLI'] },
  });

  // Medical Officer: Dr. Suresh (APMC # 68421)
  const roleMo = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.MEDICAL_OFFICER } });
  const moUser = await prisma.userAccount.upsert({
    where: { username: 'dr_suresh' },
    update: { fullName: 'Dr. K. Suresh Kumar, MBBS', apmcRegNumber: 'APMC/2014/68421' },
    create: {
      username: 'dr_suresh',
      email: 'dr.suresh@asr.ap.gov.in',
      fullName: 'Dr. K. Suresh Kumar, MBBS',
      passwordHash: defaultPasswordHash,
      phone: '+91-98480-12345',
      apmcRegNumber: 'APMC/2014/68421',
      isActive: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: moUser.id, roleId: roleMo.id } },
    update: {},
    create: { userId: moUser.id, roleId: roleMo.id },
  });
  await prisma.userFacilityAssignment.upsert({
    where: { userId_facilityId: { userId: moUser.id, facilityId: createdFacilities['CHC-PADERU'] } },
    update: {},
    create: { userId: moUser.id, facilityId: createdFacilities['CHC-PADERU'], isPrimary: true },
  });

  // Specialist Oncologist: Dr. Ananya (District Hospital Paderu)
  const roleSpecialist = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.SPECIALIST_DOCTOR } });
  const specialistUser = await prisma.userAccount.upsert({
    where: { username: 'dr_ananya' },
    update: { fullName: 'Dr. Ananya Varma, MS (Surg Onco)', apmcRegNumber: 'APMC/2010/54109' },
    create: {
      username: 'dr_ananya',
      email: 'dr.ananya@asr.ap.gov.in',
      fullName: 'Dr. Ananya Varma, MS (Surg Onco)',
      passwordHash: defaultPasswordHash,
      phone: '+91-98491-67890',
      apmcRegNumber: 'APMC/2010/54109',
      isActive: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: specialistUser.id, roleId: roleSpecialist.id } },
    update: {},
    create: { userId: specialistUser.id, roleId: roleSpecialist.id },
  });
  await prisma.userFacilityAssignment.upsert({
    where: { userId_facilityId: { userId: specialistUser.id, facilityId: createdFacilities['DH-PADERU'] } },
    update: {},
    create: { userId: specialistUser.id, facilityId: createdFacilities['DH-PADERU'], isPrimary: true },
  });

  // District Admin: Rajesh Varma (ITDA Paderu)
  const roleAdmin = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.DISTRICT_ADMIN } });
  const adminUser = await prisma.userAccount.upsert({
    where: { username: 'admin_rajesh' },
    update: { fullName: 'Rajesh Varma, IAS (ITDA Project Officer)' },
    create: {
      username: 'admin_rajesh',
      email: 'po.itda.paderu@asr.ap.gov.in',
      fullName: 'Rajesh Varma, IAS (ITDA Project Officer)',
      passwordHash: defaultPasswordHash,
      phone: '+91-8935-241201',
      isActive: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: roleAdmin.id } },
    update: {},
    create: { userId: adminUser.id, roleId: roleAdmin.id },
  });

  // 6. Primary Patient: Kondala Rao (Matching Frontend Mock Data)
  console.log('... Seeding primary synthetic patient Kondala Rao (ASR-PAT-2026-0842)');
  const patient = await prisma.patient.upsert({
    where: { uniquePatientId: 'ASR-PAT-2026-0842' },
    update: { fullName: 'Kondala Rao', age: 46 },
    create: {
      uniquePatientId: 'ASR-PAT-2026-0842',
      fullName: 'Kondala Rao',
      age: 46,
      gender: Gender.MALE,
      phone: '+91-94401-88421',
      primarySpokenLanguage: 'te',
      isTribalMember: true,
      tribeCommunity: 'Konda Dora (PVTG)',
      habitationVillageId: createdVillages['VIL-KOTHAPALLI'],
      aadhaarVaultRef: 'vault:asr:token:9a8f4c2e1b3d5e7f',
      socioEconomicBPL: true,
      aarogyasriNumber: 'ASR-WAC-2026-08421',
      registeredById: ashaUser.id,
    },
  });

  // Physical Health Card
  await prisma.patientCard.upsert({
    where: { cardSerial: 'ASR-CRD-8420-91' },
    update: {},
    create: {
      patientId: patient.id,
      cardSerial: 'ASR-CRD-8420-91',
      qrReferenceToken: 'AAROGYA-DRISHTI://CARD-REF/ASR-PAT-2026-0842/EMERGENCY-VERIFY',
      status: CardStatus.ACTIVE,
      issuedById: ashaUser.id,
    },
  });

  // Caregiver Access (Daughter)
  const existingCaregiver = await prisma.caregiverAccess.findFirst({
    where: { patientId: patient.id, caregiverName: 'Malleswari Rao' },
  });
  if (!existingCaregiver) {
    await prisma.caregiverAccess.create({
      data: {
        patientId: patient.id,
        caregiverName: 'Malleswari Rao',
        relationship: 'DAUGHTER',
        contactPhone: '+91-94401-88422',
        authorizationBasis: AuthorizationBasis.PATIENT_DELEGATED,
        canAccessScreenings: true,
        canCoordinateReferrals: true,
      },
    });
  }

  // Informed Consent
  const consent = await prisma.consent.create({
    data: {
      patientId: patient.id,
      type: ConsentType.VERBAL_RECORDED,
      recordedById: ashaUser.id,
      witnessName: 'Malleswari Rao',
      witnessRelation: 'DAUGHTER',
      witnessPhone: '+91-94401-88422',
      purposeOralExam: true,
      purposePhotography: true,
      purposeNonClinicalDemo: true,
      purposeHospitalReferral: true,
      languageCode: 'te',
      status: ConsentStatus.ACTIVE,
    },
  });

  // Screening Session
  const screening = await prisma.screening.upsert({
    where: { screeningNumber: 'ASR-SCR-2026-0842' },
    update: {},
    create: {
      screeningNumber: 'ASR-SCR-2026-0842',
      patientId: patient.id,
      consentId: consent.id,
      conductedById: ashaUser.id,
      facilityId: createdFacilities['SC-KOTHAPALLI'],
      status: ScreeningStatus.REVIEWED,
      tobaccoChewing: true,
      tobaccoYears: 20,
      gutkhaUse: true,
      reverseSmoking: true,
      alcoholConsumption: false,
      symptomsPain: true,
      symptomsBurning: true,
      symptomsUlcerLongDuration: true,
      symptomsWhiteRedPatch: true,
      trismusMouthOpeningMm: 28.0,
      trismusFingerCount: 2,
      frontlineRiskImpression: RiskImpression.HIGH,
      clinicalNotes: 'Persistent indurated white patch on right buccal mucosa with restricted mouth opening (2 fingers / 28mm). 20-year history of gutkha and reverse chutta smoking.',
      offlineSynced: true,
      offlineDraftId: 'draft-offline-kondala-0842',
    },
  });

  // Standardized Oral View Images
  const oralViews = [
    { viewKey: OralViewKey.RIGHT_CHEEK, filename: 'sample_oral_patch.jpg', size: 184520, sha: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { viewKey: OralViewKey.LEFT_CHEEK, filename: 'sample_oral_left.jpg', size: 162100, sha: 'a3b1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { viewKey: OralViewKey.TONGUE, filename: 'sample_oral_tongue.jpg', size: 195400, sha: 'b3b2c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { viewKey: OralViewKey.PALATE, filename: 'oral_anatomy_guide.jpg', size: 210800, sha: 'c3b3c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { viewKey: OralViewKey.GUMS_FLOOR, filename: 'oral_anatomy_guide.jpg', size: 178900, sha: 'd3b4c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  ];

  for (const v of oralViews) {
    const existingImage = await prisma.screeningImage.findUnique({
      where: { screeningId_viewKey: { screeningId: screening.id, viewKey: v.viewKey } },
    });

    let imageId = existingImage?.id;
    if (!existingImage) {
      const created = await prisma.screeningImage.create({
        data: {
          screeningId: screening.id,
          viewKey: v.viewKey,
          storagePath: `screenings/${screening.id}/${v.viewKey.toLowerCase()}.jpg`,
          originalFilename: v.filename,
          mimeType: 'image/jpeg',
          fileSizeBytes: v.size,
          sha256Checksum: v.sha,
        },
      });
      imageId = created.id;
    }

    // Attach OpenCV Image Quality Result for the primary lesion view
    if (v.viewKey === OralViewKey.RIGHT_CHEEK && imageId) {
      const existingQuality = await prisma.imageQualityResult.findUnique({
        where: { screeningImageId: imageId },
      });
      if (!existingQuality) {
        await prisma.imageQualityResult.create({
          data: {
            screeningImageId: imageId,
            verdict: QualityVerdict.ACCEPTABLE,
            sharpnessScore: 94.2,
            brightnessScore: 88.0,
            glareScore: 12.0,
            resolution: '1920 x 1440',
            automatedFeedbackEn: 'Sharp focus, optimal clinical illumination, zero motion blur. Demarcation of mucosal margins is clearly visible.',
            automatedFeedbackTe: 'స్పష్టమైన ఫోటో, సరైన కాంతి. మచ్చ సరిహద్దులు స్పష్టంగా కనిపిస్తున్నాయి.',
          },
        });
      }

      // Attach Strictly Non-Clinical AI Research Analysis
      const existingAi = await prisma.aIResearchAnalysis.findUnique({
        where: { screeningImageId: imageId },
      });
      if (!existingAi) {
        await prisma.aIResearchAnalysis.create({
          data: {
            screeningImageId: imageId,
            isNonClinicalDemo: true,
            score: null, // Strictly null-enforced per healthcare safety protocol
            modelVersion: 'BioMed-Oral-Demo-v1.4',
            heatmapStoragePath: `screenings/${screening.id}/heatmaps/right_cheek_cam.png`,
            safetyDisclaimer: 'STRICTLY NON-CLINICAL: For academic and research demonstration only. Not for diagnosis or patient treatment decisions.',
          },
        });
      }
    }
  }

  // Clinical Review by Dr. Suresh
  const existingReview = await prisma.clinicalReview.findUnique({
    where: { screeningId: screening.id },
  });
  if (!existingReview) {
    await prisma.clinicalReview.create({
      data: {
        screeningId: screening.id,
        reviewedById: moUser.id,
        apmcRegistrationNumber: 'APMC/2014/68421',
        triageCategory: TriageCategory.OPMD_HIGH_RISK,
        provisionalDiagnosis: 'Homogeneous Leukoplakia with Oral Submucous Fibrosis (OSMF Grade II) - Right Buccal Mucosa',
        clinicalNotes: '46M chronic reverse smoker with 20yr gutkha habit. 3.5cm non-scrapable indurated leukoplakia plaque on right buccal mucosa near retro-molar trigone. Mouth opening limited to 28mm. Immediate specialist oncology evaluation and diagnostic punch biopsy indicated.',
        recommendedAction: ClinicalAction.PHYSICAL_REFERRAL,
      },
    });
  }

  // Urgent Referral to District Hospital Paderu
  const referral = await prisma.referral.upsert({
    where: { referralNumber: 'ASR-REF-2026-0842' },
    update: {},
    create: {
      referralNumber: 'ASR-REF-2026-0842',
      patientId: patient.id,
      screeningId: screening.id,
      sourceFacilityId: createdFacilities['CHC-PADERU'],
      targetFacilityId: createdFacilities['DH-PADERU'],
      urgency: ReferralUrgency.URGENT_72H,
      reason: 'Urgent evaluation of suspected high-risk OPMD / early malignant transformation. Punch biopsy required.',
      status: ReferralStatus.ACCEPTED,
      transportAssistanceRequired: true,
      tribalLiaisonAssigned: 'K. Somalingam (ITDA Tribal Welfare Officer)',
    },
  });

  // Specialist Appointment with Dr. Ananya
  const existingAppt = await prisma.specialistAppointment.findUnique({
    where: { referralId: referral.id },
  });
  if (!existingAppt) {
    await prisma.specialistAppointment.create({
      data: {
        referralId: referral.id,
        specialistId: specialistUser.id,
        scheduledDate: new Date(Date.now() + 48 * 3600 * 1000), // In 48 hours
        timeSlot: '10:30 AM',
        opdDepartment: 'Surgical Oncology / Head & Neck Clinic (OPD-4)',
        status: AppointmentStatus.SCHEDULED,
      },
    });
  }

  // Diagnostic Investigation: Punch Biopsy
  const existingBiopsy = await prisma.diagnosticInvestigation.findFirst({
    where: { referralId: referral.id },
  });
  if (!existingBiopsy) {
    await prisma.diagnosticInvestigation.create({
      data: {
        referralId: referral.id,
        investigationType: InvestigationType.PUNCH_BIOPSY,
        stage: BiopsyStage.SAMPLE_COLLECTED,
        specimenSite: 'Right Buccal Mucosa (anterior border of lesion)',
        clinicalImpression: 'High-grade Dysplasia vs Early Well-Differentiated Squamous Cell Carcinoma',
        collectedAt: new Date(),
      },
    });
  }

  // Community Doorstep Follow-Up Task for Lakshmi Devi
  const existingFollowUp = await prisma.followUp.findFirst({
    where: { patientId: patient.id },
  });
  if (!existingFollowUp) {
    await prisma.followUp.create({
      data: {
        patientId: patient.id,
        screeningId: screening.id,
        assignedToId: ashaUser.id,
        dueDate: new Date(Date.now() + 24 * 3600 * 1000), // In 24 hours
        type: FollowUpType.POST_REFERRAL_ADHERENCE,
        status: FollowUpStatus.PENDING,
        patientContacted: true,
        notes: 'Confirm Kondala Rao and daughter have bus pass / transport voucher for Paderu District Hospital appointment.',
      },
    });
  }

  console.log('✅ Seed pipeline completed successfully!');
  console.log('   - Roles: 8');
  console.log('   - Mandals: 6 (ITDA Paderu Agency)');
  console.log('   - Facilities: 4 (DH, AH, CHC, SC)');
  console.log('   - Villages: 4 (PVTG & Scheduled Agency)');
  console.log('   - Users: 4 (ASHA Lakshmi, Dr. Suresh, Dr. Ananya, Admin Rajesh)');
  console.log('   - Patient: Kondala Rao (ASR-PAT-2026-0842) with full card, consent, screening, 5 views, review, and urgent referral.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
