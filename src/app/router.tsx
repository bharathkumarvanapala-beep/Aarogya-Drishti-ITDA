import { MedGemmaPage } from '../features/health-worker/MedGemmaPage';
import { ConnectedAdminPage } from '../features/admin/ConnectedAdminPage';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../features/public/HomePage';
import { AboutPage } from '../features/public/AboutPage';
import { OralHealthEducationPage } from '../features/public/OralHealthEducationPage';
import { CancerAwarenessPage } from '../features/public/CancerAwarenessPage';
import { HealthyHabitsPage } from '../features/public/HealthyHabitsPage';
import { HowItWorksPage } from '../features/public/HowItWorksPage';
import { FacilitiesDirectoryPage } from '../features/public/FacilitiesDirectoryPage';
import { FaqPage } from '../features/public/FaqPage';
import { ContactPage } from '../features/public/ContactPage';
import { DesignSystemPage } from '../features/design-system/DesignSystemPage';
import { UnitTestsPage } from '../features/testing/UnitTestsPage';

import { PortalLoginPage } from '../features/auth/PortalLoginPage';
import { PortalLayout } from '../layouts/PortalLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AssistedCareGuidePage } from '../features/patient/AssistedCareGuidePage';
import { CareWorkflowPage } from '../features/care/CareWorkflowPage';
import { DoctorTelemedicinePage } from '../features/doctor/DoctorTelemedicinePage';
import { CareVideo } from '../features/doctor/CareVideo';
import { PatientDashboard } from '../features/patient/PatientDashboard';
import { HealthCardPreviewPage } from '../features/patient/HealthCardPreviewPage';
import { CareJourneyTimelinePage } from '../features/patient/CareJourneyTimelinePage';
import { CaregiverAccessPage } from '../features/patient/CaregiverAccessPage';
import { HealthWorkerDashboard } from '../features/health-worker/HealthWorkerDashboard';
import { PatientDirectoryPage } from '../features/health-worker/PatientDirectoryPage';
import { PatientRegistrationPage } from '../features/health-worker/PatientRegistrationPage';
import { ScreeningIntakePage } from '../features/health-worker/ScreeningIntakePage';
import { GuidedOralCameraPage } from '../features/health-worker/GuidedOralCameraPage';
import { ReferralTrackingPage } from '../features/health-worker/ReferralTrackingPage';
import { FollowUpQueuePage } from '../features/health-worker/FollowUpQueuePage';
import { OfflineSyncHubPage } from '../features/health-worker/OfflineSyncHubPage';
import { AiResearchDemoPage } from '../features/screening/AiResearchDemoPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/oral-health" element={<OralHealthEducationPage />} />
          <Route path="/cancer-awareness" element={<CancerAwarenessPage />} />
          <Route path="/healthy-habits" element={<HealthyHabitsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/facilities" element={<FacilitiesDirectoryPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Portal Gateway / Login */}
        <Route path="/login" element={<PortalLoginPage />} />

        {/* Role-Based Healthcare Portals with Layout */}
        <Route element={<PortalLayout />}>
          <Route path="/specialist/*" element={<ProtectedRoute allowedRoles={['specialist']}><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/navigator/*" element={<ProtectedRoute allowedRoles={['hospital_coordinator']}><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/care" element={<ProtectedRoute allowedRoles={['health_worker','asha','anm','doctor','specialist','hospital_coordinator','admin','patient']}><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/health-worker/medgemma" element={<ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']}><MedGemmaPage /></ProtectedRoute>} />
          {/* Frontline Health Worker (ASHA & ANM) Protected Portal Routes */}
          <Route
            path="/health-worker"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <HealthWorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/patients"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <PatientDirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/register"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <PatientRegistrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/new"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <ScreeningIntakePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/camera"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <GuidedOralCameraPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/:id/camera"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <GuidedOralCameraPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/screening/demo/ai-demo"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm', 'doctor', 'specialist']} portalName="AI Research Gateway">
                <AiResearchDemoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/screening/:id/ai-demo"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm', 'doctor', 'specialist']} portalName="AI Research Gateway">
                <AiResearchDemoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/referrals"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <ReferralTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/follow-ups"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <FollowUpQueuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/sync"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <OfflineSyncHubPage />
              </ProtectedRoute>
            }
          />

          {/* Doctor & Specialist Medical Officer Protected Portal Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'specialist']} portalName="Doctor Clinical Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/cases"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'specialist']} portalName="Doctor Clinical Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/cases/:id"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'specialist']} portalName="Doctor Clinical Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/referrals"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'specialist']} portalName="Doctor Clinical Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/telemedicine"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'specialist']} portalName="Doctor Clinical Portal">
                <DoctorTelemedicinePage />
              </ProtectedRoute>
            }
          />

          {/* Hospital Referral Coordinator Protected Portal Routes */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={['hospital_coordinator']} portalName="Hospital Referral Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/referrals"
            element={
              <ProtectedRoute allowedRoles={['hospital_coordinator']} portalName="Hospital Referral Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/appointments"
            element={
              <ProtectedRoute allowedRoles={['hospital_coordinator']} portalName="Hospital Referral Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/investigations"
            element={
              <ProtectedRoute allowedRoles={['hospital_coordinator']} portalName="Hospital Referral Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/navigation"
            element={
              <ProtectedRoute allowedRoles={['hospital_coordinator']} portalName="Hospital Referral Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />

          {/* District Administrator Protected Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']} portalName="District Administration Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/map"
            element={
              <ProtectedRoute allowedRoles={['admin']} portalName="District Administration Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']} portalName="District Administration Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/system"
            element={
              <ProtectedRoute allowedRoles={['admin']} portalName="District Administration Portal">
                <ConnectedAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']} portalName="District Administration Portal">
                <ConnectedAdminPage />
              </ProtectedRoute>
            }
          />

          {/* CONNECTED PATIENT & FAMILY PORTAL ROUTES */}
          <Route path="/patient" element={<Navigate to="/patient/portal" replace />} />
          <Route path="/patient/portal" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/card-preview" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><HealthCardPreviewPage /></ProtectedRoute>} />
          <Route path="/patient/assisted-guide" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><AssistedCareGuidePage /></ProtectedRoute>} />
          <Route path="/patient/screenings" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/patient/journey" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareJourneyTimelinePage /></ProtectedRoute>} />
          <Route path="/patient/consultation" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><div className="max-w-4xl mx-auto p-4 space-y-4"><CareVideo caseId="case-asr-2026-0042" /></div></ProtectedRoute>} />
          <Route path="/patient/caregiver" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CaregiverAccessPage /></ProtectedRoute>} />
        </Route>

        {/* Living Design System Showcase */}
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* In-Website Unit Test Runner & Verification Suite */}
        {import.meta.env.DEV && <Route path="/unit-tests" element={<UnitTestsPage />} />}
        {import.meta.env.DEV && <Route path="/system-tests" element={<UnitTestsPage />} />}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
