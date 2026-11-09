# AAROGYA DRISHTI — Frontend Component Guide & Catalog
**Document Version:** 1.0.0 (Phase 0 Documentation)  
**System:** AAROGYA DRISHTI Community Healthcare Platform  
**Design Standard:** Nature-Inspired Community Healthcare Theme

---

## 1. Common UI Primitives (`src/components/common/`)

| Component | Props | Purpose |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary' \| 'outline' \| 'danger' \| 'ghost'`, `size: 'sm' \| 'md' \| 'lg'`, `icon?`, `loading?` | High-contrast, touch-friendly (min 48px) interactive actions |
| `Card` | `title?`, `subtitle?`, `variant: 'default' \| 'nature' \| 'accent'`, `padding?` | Rounded-2xl white content containers with soft natural shadows |
| `Badge` | `variant: 'info' \| 'warning' \| 'success' \| 'danger' \| 'neutral'`, `label: string`, `icon?` | Semantic workflow status indicators with visible text and high contrast |
| `StatCard` | `label: string`, `labelTe?: string`, `value: string \| number`, `icon: LucideIcon`, `trend?: string`, `color?: string` | Key numerical metrics with Telugu translations and iconography |
| `Modal` | `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode` | Accessible modal dialog with focus trapping and backdrop blur |
| `Spinner` | `size: 'sm' \| 'md' \| 'lg'`, `color?: string` | Non-blocking loading indicator for asynchronous operations |
| `Alert` | `type: 'info' \| 'warning' \| 'success' \| 'danger'`, `title: string`, `children: ReactNode` | Contextual notices with clear humanized plain-language messages |

---

## 2. Layout & Shell Components (`src/components/layout/`)

| Component | Location | Features |
|---|---|---|
| `PublicHeader` | `src/components/layout/PublicHeader.tsx` | Bilingual logo, navigation links, Language Switcher (EN/TE), Portal Login button |
| `PublicFooter` | `src/components/layout/PublicFooter.tsx` | Community branding, ITDA Paderu acknowledgements, disclaimer, helpline directory |
| `SidebarNavigation` | `src/components/layout/SidebarNavigation.tsx` | Deep forest green navigation, white icons, expand/collapse, active soft-green pill |
| `MobileNavigationDrawer` | `src/components/layout/MobileNavigationDrawer.tsx` | Touch drawer for Android smartphones with 48px touch targets |
| `DashboardHeader` | `src/components/layout/DashboardHeader.tsx` | Role identification badge, user profile, sync indicator pill, language toggle |
| `Breadcrumbs` | `src/components/layout/Breadcrumbs.tsx` | Hierarchical trail indicating user position across portal depth |
| `DemoControlBar` | `src/components/layout/DemoControlBar.tsx` | Evaluator quick persona switcher and simulation toggles |

---

## 3. Specialized Domain Components

| Component | Domain | Description |
|---|---|---|
| `VillageActivityMap` | Health Worker / Admin | Color-coded village status indicators (Green, Amber, Red, Grey) |
| `WeeklyScreeningChart` | Health Worker / Admin | Responsive Recharts bar chart comparing completed vs pending screenings |
| `OralCameraViewfinder` | Camera / Screening | 5-view oral selector, framing guidelines, live video or file fallback |
| `QualityCheckCard` | Quality Control | Breakdown of blur, brightness, glare, and resolution with plain-language advice |
| `AIResearchBanner` | AI Demonstration | Prominent "NOT FOR CLINICAL USE" research banner and model metadata |
| `PhysicalPatientCard` | Patient Access | High-resolution printable front and back view of patient card with non-sensitive QR |
| `CaregiverAccessTable` | Patient / Caregiver | List of authorized family caregivers with permission scope and revoke action |
| `TriageQueueTable` | Doctor Portal | Filterable table of submitted screening cases awaiting clinical review |
