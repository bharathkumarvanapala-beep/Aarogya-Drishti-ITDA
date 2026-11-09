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
          <Route path="/care" element={<ProtectedRoute allowedRoles={['health_worker','asha','anm','doctor','specialist','hospital_coordinator','admin','patient']}><CareWorkflowPage /></ProtectedRoute>} />
          {/* Frontline Health Worker (ASHA & ANM) Protected Portal Routes */}
          <Route
            path="/health-worker"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/patients"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/register"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/new"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/camera"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/screening/:id/camera"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/screening/demo/ai-demo"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm', 'doctor', 'specialist']} portalName="AI Research Gateway">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/screening/:id/ai-demo"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm', 'doctor', 'specialist']} portalName="AI Research Gateway">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/referrals"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/follow-ups"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-worker/sync"
            element={
              <ProtectedRoute allowedRoles={['health_worker', 'asha', 'anm']} portalName="Frontline Healthcare Portal">
                <CareWorkflowPage />
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
                <CareWorkflowPage />
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

          {/* UNCHANGED PATIENT & FAMILY PORTAL ROUTES (PRESERVED IN FULL) */}
          <Route path="/patient/portal" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/patient/card-preview" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/patient/assisted-guide" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><AssistedCareGuidePage /></ProtectedRoute>} />
          <Route path="/patient/screenings" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/patient/journey" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
          <Route path="/patient/caregiver" element={<ProtectedRoute allowedRoles={['patient']} portalName="Patient Portal"><CareWorkflowPage /></ProtectedRoute>} />
        </Route>

        {/* Living Design System Showcase */}
        <Route path="/design-system" element={<DesignSystemPage />} />

        {/* In-Website Unit Test Runner & Verification Suite */}
        <Route path="/unit-tests" element={<UnitTestsPage />} />
        <Route path="/system-tests" element={<UnitTestsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
