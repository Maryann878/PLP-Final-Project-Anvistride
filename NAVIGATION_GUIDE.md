# Anvistride - Complete Navigation Guide

## 📍 Route Structure

### Public Routes (No Authentication Required)
- `/` - Landing Page
- `/login` - Login Page
- `/register` - Register Page
- `/forgot-password` - Forgot Password Page
- `/reset-password/:token` - Reset Password Page (with token param)
- `/email-verification` - Email Verification Page
- `/terms-of-service` or `/terms` - Terms of Service Page
- `/privacy-policy` or `/privacy` - Privacy Policy Page

### Protected Routes (Authentication Required)
All app routes are under `/app` with DashboardLayout (Sidebar + BottomBar):

- `/app` - Dashboard (home/overview)
- `/app/vision` - Vision Management Page
- `/app/goals` - Goals Management Page
- `/app/tasks` - Tasks Management Page
- `/app/ideas` - Ideas Capture Page
- `/app/notes` - Notes Documentation Page
- `/app/journal` - Daily Journal Page
- `/app/achievements` - Achievements Portfolio Page
- `/app/analytics` - Analytics & Insights Page
- `/app/profile` - User Profile Page
- `/app/settings` - Settings & Preferences Page
- `/app/help` - Help & Support Page
- `/app/recycle-bin` - Recycle Bin Page
- `/onboarding` - Onboarding Tutorial (standalone, no layout)

### Placeholder Routes (Coming Soon)
- `/demo` - Demo Page
- `/upgrade` - Upgrade/Pricing Page
- `/contact` - Contact Page
- `/social/*` - Social Media Links

## 🧭 Navigation Components

### 1. Sidebar (Desktop - Left Side)
**Location**: `client/src/components/Sidebar.tsx`

**Top Utility Icons**:
- Profile → `/app/profile`
- Settings → `/app/settings`
- Help → `/app/help`
- Recycle Bin → `/app/recycle-bin`

**Core Features Menu**:
1. Dashboard → `/app`
2. Vision → `/app/vision`
3. Goals → `/app/goals`
4. Tasks → `/app/tasks`
5. Ideas → `/app/ideas`
6. Notes → `/app/notes`
7. Journal → `/app/journal`
8. Achievements → `/app/achievements`

**Footer**:
- Log Out Button → Logs out, redirects to `/`

**Active State**: Purple-teal gradient background, white text, right border indicator

### 2. BottomBar (Mobile - Bottom Navigation)
**Location**: `client/src/components/BottomBar.tsx`

**Navigation Items** (Left to Right):
1. Home (Home icon) → `/app` - Purple when active
2. Vision (Eye icon) → `/app/vision` - Purple when active
3. Goals (Target icon) → `/app/goals` - Teal when active
4. Tasks (CheckSquare icon) → `/app/tasks` - Gold when active
5. Quick Add (Plus icon in gradient circle) → Context-aware add action

**Style**: White/90 backdrop-blur, bottom shadow, glassmorphic

### 3. Dashboard Page Links
**Location**: `client/src/pages/DashboardPage.tsx`

**Quick Actions** (via `handleQuickAction(action)`):
- Navigate to: `/app/${action}` where action = "vision", "goals", "tasks", "ideas", "notes", "journal", "achievements"

**Stat Cards** (clickable to navigate):
- Visions → `/app/vision`
- Goals → `/app/goals`
- Tasks → `/app/tasks`
- Ideas → `/app/ideas`
- Notes → `/app/notes`
- Journal → `/app/journal`
- Achievements → `/app/achievements`

**Section CTAs**:
- "Create Vision" → Opens create modal or navigates to `/app/vision`
- "Set Goal" → `/app/goals`
- "Add Task" → `/app/tasks`
- "Start Journaling" → `/app/journal`
- "Add Achievement" → `/app/achievements`

### 4. Profile Page Links
**Location**: `client/src/pages/ProfilePage.tsx`

**Account Management Buttons**:
- Settings → `/app/settings`
- Help & Support → `/app/help`
- Recycle Bin → `/app/recycle-bin`
- Log Out → Logout, redirect to `/`

### 5. Onboarding Page
**Location**: `client/src/pages/OnboardingPage.tsx`

**Navigation Flow**:
- Skip Tour → `/app` (dashboard)
- Complete All Steps → `/app` (dashboard)
- Step 6 "Go to Dashboard" → `/app`

**Created Sample Data Links**:
- After creating sample vision, user can navigate to `/app/vision` to see it
- After creating sample goal (linked to vision), navigate to `/app/goals?visionId=X`
- After creating sample task (linked to goal), navigate to `/app/tasks`

### 6. Settings Page Links
**Location**: `client/src/pages/SettingsPage.tsx`

**Tab Navigation**:
- Data Management Tab → Export/import data
- Account Tab → Log out → Redirect to `/`
- Display Preferences Tab → Theme toggles
- About Tab → App info, features, tech details

### 7. Cross-Page Linking

**Vision → Goals**:
- Vision card "Add Goal" button → `/app/goals?visionId={visionId}`
- GoalsPage modal auto-selects linked vision from URL param

**Goals → Tasks**:
- Goal card "+ Task" button → Opens inline task input, links task to goal
- Alternatively → `/app/tasks` with goal pre-selected

**All Entity Pages → Detail Views** (Future):
- `/app/vision/:id` - Vision detail page (to be created)
- `/app/goal/:id` - Goal detail page (to be created)
- `/app/task/:id` - Task detail page (to be created)
- etc.

## 🔗 Footer Links (LandingPage)

**Location**: `client/src/components/Footer.tsx` (if exists) or inline in LandingPage

**Legal Links**:
- Terms of Service → `/terms-of-service` or `/terms`
- Privacy Policy → `/privacy-policy` or `/privacy`

**Social Links**:
- Twitter → `/social/twitter` (Coming Soon)
- LinkedIn → `/social/linkedin` (Coming Soon)
- Instagram → `/social/instagram` (Coming Soon)
- Facebook → `/social/facebook` (Coming Soon)
- Email → `/social/email` (Coming Soon)

**Action Links**:
- Contact → `/contact` (Coming Soon)
- Demo → `/demo` (Coming Soon)
- Upgrade → `/upgrade` (Coming Soon)

## 🎯 Key Navigation Patterns

### Pattern 1: Hierarchy Navigation (Vision → Goal → Task)
1. User on Vision page → Clicks "Add Goal" on vision card
2. Navigates to `/app/goals?visionId=123`
3. GoalsPage modal opens with vision pre-selected
4. User creates goal → Goal card shows "+ Task" button
5. Clicks "+ Task" → Inline input adds task linked to goal

### Pattern 2: Dashboard Quick Actions
1. User on Dashboard → Sees empty "Focus Tasks" section
2. Clicks "Add Task" CTA button
3. Navigates to `/app/tasks` → TasksPage opens with create modal

### Pattern 3: Mobile FAB (Floating Action Button)
1. User on mobile (<768px) → Sees FAB (purple-teal gradient circle, bottom-right)
2. Clicks FAB → Opens create modal for current page (e.g., on VisionPage → creates vision)

### Pattern 4: Search & Filter (Future)
1. Global search in header → Searches all entities
2. Results → Click result → Navigates to detail view (e.g., `/app/vision/:id`)

## ✅ Verification Checklist

- [x] All 12 core app pages routed correctly (`/app/*`)
- [x] All 3 auth pages routed (`/forgot-password`, `/reset-password/:token`, `/email-verification`)
- [x] Legal pages routed (`/terms-of-service`, `/privacy-policy`)
- [x] Analytics page routed (`/app/analytics`)
- [x] Onboarding routed (`/onboarding`)
- [x] Sidebar links all 8 core features + 4 utility pages
- [x] BottomBar links 5 key pages (Home, Vision, Goals, Tasks, Quick Add)
- [x] Dashboard `handleQuickAction` navigates to all pages
- [x] Profile page links to Settings, Help, Recycle Bin
- [x] Cross-page linking (Vision → Goals with visionId param)
- [x] Mobile FAB on all entity pages
- [x] Log out redirects to `/`
- [x] Onboarding completion redirects to `/app`

## 🚀 Testing Navigation

### Test Flow 1: Full App Navigation
1. Start at `/` (Landing) → Click "Sign In" → `/login`
2. Login → Redirects to `/onboarding` (first-time user) or `/app` (returning)
3. Onboarding → Complete 7 steps → Creates sample data → Redirects to `/app`
4. Dashboard → Click "Visions" stat card → `/app/vision`
5. Vision page → Click "Add Goal" on vision card → `/app/goals?visionId=X`
6. Goals page → Create goal → Click "+ Task" on goal card → Inline task add
7. Goals page → Click "Tasks" in sidebar → `/app/tasks`
8. Tasks page → Create task
9. Sidebar → Click "Ideas" → `/app/ideas`
10. Ideas page → Create idea
11. Sidebar → Click "Notes" → `/app/notes`
12. Notes page → Create note
13. Sidebar → Click "Journal" → `/app/journal`
14. Journal page → Create entry
15. Sidebar → Click "Achievements" → `/app/achievements`
16. Achievements page → Upload achievement
17. Sidebar → Click "Profile" → `/app/profile`
18. Profile → Click "Settings" → `/app/settings`
19. Settings → Click "Help" tab → View FAQ
20. Profile → Click "Log Out" → Redirects to `/`

### Test Flow 2: Mobile Navigation
1. Resize to <768px
2. Bottom nav appears (BottomBar)
3. Click "Home" → `/app` (Dashboard)
4. Click "Vision" → `/app/vision`
5. Vision page → FAB appears (bottom-right)
6. Click FAB → Create vision modal opens
7. Click "Goals" in bottom nav → `/app/goals`
8. Click "Tasks" in bottom nav → `/app/tasks`
9. Click "Quick Add" (Plus icon) → Context-aware add
10. Click "Home" → Back to dashboard

### Test Flow 3: Auth Flow
1. Landing → "Get Started" → `/register`
2. Register → Submit → `/email-verification`
3. Email Verification → Enter code → Success → `/app` (dashboard)
4. Login → "Forgot Password?" → `/forgot-password`
5. Forgot Password → Enter email → Success → Email sent message
6. Click reset link (email) → `/reset-password/abc123`
7. Reset Password → Enter new password → Success → `/login`
8. Login → Dashboard `/app`

## 📝 Notes for Developers

1. **Route Guards**: All `/app/*` routes are protected by `<ProtectedRoute>` - redirects to `/login` if not authenticated
2. **URL Params**: 
   - `/reset-password/:token` - Token from email
   - `/app/goals?visionId=X` - Pre-select vision in goal modal
3. **Aliases**: `/terms` → `/terms-of-service`, `/privacy` → `/privacy-policy` for shorter URLs
4. **Mobile**: BottomBar only shows on `md:hidden` (<768px), Sidebar on `md:block` (>=768px)
5. **Scroll**: Sidebar and main content have independent scroll (overflow-y-auto)
6. **Active States**: 
   - Sidebar: Gradient bg (purple-teal), white text, right border
   - BottomBar: Purple/teal/gold color by page type
7. **FABs**: All entity pages (Vision, Goals, Tasks, Ideas, Notes, Journal, Achievements) have mobile FAB (bottom-right, purple-teal gradient)
8. **Logout**: Available in Sidebar footer, Profile page, and Settings tab
9. **Onboarding**: Standalone route (no DashboardLayout) - full-screen experience

## 🔄 State Management Integration

### AppContext Routes
All pages use `useAppContext()` for data:
- `visions` → VisionPage
- `goals` → GoalsPage
- `tasks` → TasksPage
- `ideas` → IdeasPage
- `notes` → NotesPage
- `journal` → JournalPage
- `achievements` → AchievementsPage

### AuthContext Routes
Auth pages use `useAuth()`:
- `login()` → LoginPage, EmailVerificationPage
- `logout()` → Sidebar, ProfilePage, SettingsPage
- `user` → Dashboard (greeting), Profile (info), Onboarding (name)

## 🎨 Brand-Specific Navigation Styling

### Colors by Page Type
- **Vision**: Purple (Eye icon)
- **Goals**: Teal (Target icon)
- **Tasks**: Gold (CheckSquare icon)
- **Ideas**: Purple (Lightbulb icon)
- **Notes**: Green (StickyNote icon)
- **Journal**: Blue (BookOpen icon)
- **Achievements**: Gold (Trophy icon)
- **Analytics**: Purple (BarChart3 icon)
- **Settings**: Gray (Settings icon)
- **Help**: Purple (HelpCircle icon)
- **Recycle Bin**: Gray (Recycle icon)

### Gradient Usage
- **Primary Gradient**: `from-purple-600 to-teal-500` (buttons, headers, active states)
- **Gold Gradient**: `from-gold-500 to-purple-600` (Achievements page)
- **Success**: Green (completed states)
- **Danger**: Red (delete buttons, logout)

---

**Last Updated**: November 2025  
**App Version**: 1.0.0  
**Status**: Production Ready ✅

