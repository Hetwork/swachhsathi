# 🧼 Swachhsathi - Smart Garbage Reporting System

A comprehensive civic-tech mobile application designed to revolutionize urban waste management through citizen participation and real-time tracking. The app connects four key stakeholders - citizens, NGO administrators, field workers, and system - in a seamless ecosystem for efficient garbage reporting and resolution.

Built using **React Native (Expo ~54.0)** with **Firebase**, **TanStack React Query v5** for server state caching, offline support, and background sync, and **NGO-scoped multi-tenancy** for isolated organization management.

---

## 🎯 Problem Statement

Urban areas face challenges in maintaining cleanliness due to:
- Delayed reporting of garbage accumulation
- Lack of real-time tracking and accountability
- Inefficient communication between citizens and municipal authorities
- Poor visibility of cleanup operations
- No centralized system for NGO-managed waste collection
- Difficulty in assigning tasks based on worker expertise and location

Swachhsathi addresses these issues by providing a smart, mobile-first platform with NGO-based multi-tenancy, AI-powered waste verification, category-based task assignment, and comprehensive tracking for instant reporting and resolution of waste management concerns.

---

## 🏗️ Architecture

### **Multi-App System**

The project consists of **three interconnected mobile applications** with **NGO-scoped multi-tenancy**:

1. **👥 Citizen App** - For reporting garbage issues to their local area
2. **🛠️ Worker App** - For NGO field workers to manage assigned tasks
3. **🏛️ Admin/NGO App** - For NGO administrators to oversee operations within their organization

All apps share a common codebase with role-based routing and feature access. Each NGO operates independently with its own workers and reports through **ngoId-based data isolation**.

---

## 🚀 Key Features

### 📱 Citizen App
- **Photo Upload** - Capture and upload garbage images with camera or gallery
- **GPS Auto-Detection** - Automatic location tagging with address resolution
- **AI Waste Classification** - Automatic category detection (if enabled)
- **Report Submission** - Submit detailed complaints with description and severity
- **Status Tracking** - Real-time 4-stage timeline view (Pending → Assigned → In Progress → Resolved)
- **Before/After Comparison** - View worker's cleanup results with before/after photos
- **Location Map View** - See report location on interactive map
- **Report History** - View all submitted reports with filtering
- **Profile Management** - Edit profile, view statistics
- **Multi-Language Support** - Accessibility for diverse users

### 🔧 Worker App
- **Task Dashboard** - View assigned cleanup tasks from NGO
- **Task Details** - Complete information with location, description, and reporter details
- **Status Timeline** - 4-stage progress tracking for assigned tasks
- **Location Map** - View task location on interactive map
- **Progress Updates** - Update task status (Assigned → In Progress → Completed)
- **After-Photo Upload** - Document cleanup work with completion photo
- **AI Verification** - Optional AI validation of before/after comparison
- **Task Statistics** - View personal performance metrics (Active, Completed, Success Rate)
- **NGO Information** - View associated NGO details in profile
- **Work History** - Filter and view completed vs active tasks

### 🎛️ Admin/NGO App
- **NGO Dashboard** - Overview of organization-specific reports and statistics
- **Quick Stats Cards** - Pending, Assigned, In Progress, Resolved counts
- **Report Management** - View all NGO-scoped reports with advanced filtering
  - Filter by status (Pending/Assigned/In Progress/Resolved)
  - Filter by severity (High/Medium/Low)
  - Search and sort capabilities
- **Worker Management** - Manage NGO field team
  - View worker list with active/inactive status
  - Worker statistics (Assigned, Completed, Success Rate)
  - Assign pending reports to workers directly from worker cards
- **Task Assignment Modal** - Select pending reports and assign to workers
- **Report Details** - Comprehensive view with:
  - Location map display
  - Before/after image comparison
  - Status update controls
  - Worker assignment
  - AI verification status
- **Hotspot Map** - Interactive map showing all report locations with colored markers by status
- **NGO Profile** - Organization details in admin and worker profiles
- **Recent Activity** - Quick access to latest reports
- **Quick Actions** - Fast navigation to Assign Reports, Manage Workers, Hotspot Map

---

## 🛠️ Technology Stack

### **Frontend (Mobile)**
- **Framework**: React Native with Expo (~54.0)
- **Language**: TypeScript
- **Navigation**: Expo Router v6 (File-based routing with role-based layouts)
- **State Management**: React Query v5 (Server state only, no global state library)
- **Data Fetching**: TanStack React Query v5
  - Server state caching with automatic invalidation
  - Background sync and refetch
  - Offline support with persistence
  - Optimistic updates for instant UI feedback
  - Smart request deduplication
- **UI Components**: Custom components (AppButton, AppTextInput, Container)
- **Icons**: Ionicons (@expo/vector-icons)
- **Maps**: React Native Maps with Google Maps Provider
- **Camera**: Expo Camera & Image Picker
- **Location**: Expo Location with reverse geocoding
- **Notifications**: Expo Notifications + Firebase Cloud Messaging (FCM)
- **Forms**: React Hook Form (if used) or controlled components

### **Backend**
- **Authentication**: Firebase Authentication (Email/Password)
- **Database**: Cloud Firestore
  - Real-time updates via onSnapshot
  - Offline persistence enabled
  - Security rules with role-based access
  - NGO-scoped queries with compound indexes
- **Storage**: Firebase Storage (Images - before/after photos)
- **Cloud Functions**: Firebase Functions (Node.js)
  - AI waste verification (wasteScannerFunction)
  - Notification triggers
  - Report assignment logic
  - Analytics aggregation
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **AI/ML**: Google Cloud Vision API (for waste classification and verification)

### **DevOps & Tools**
- **Version Control**: Git
- **Package Manager**: npm
- **Build Tool**: Expo EAS Build
- **Code Quality**: ESLint, TypeScript strict mode
- **Android**: NDK 27.1.12297006, compileSdk 36, targetSdk 36, minSdk 24

---

## 📂 Project Structure

```
swachhsathi/
├── app/                          # Main app directory (Expo Router v6)
│   ├── (admin)/                  # NGO Admin role screens
│   │   ├── (tabs)/               # Admin tab navigation
│   │   │   ├── _layout.tsx       # Tab bar with 4 tabs
│   │   │   ├── home.tsx          # Dashboard with stats & quick actions
│   │   │   ├── reports.tsx       # NGO reports list with filters & stats
│   │   │   ├── workers.tsx       # Worker management with assign modal
│   │   │   └── profile.tsx       # Profile with NGO info & stats
│   │   ├── _layout.tsx           # Admin stack layout
│   │   ├── add-worker.tsx        # Add new worker form
│   │   ├── map-view.tsx          # Hotspot map with all reports
│   │   ├── report-details.tsx    # Detailed report view with map & images
│   │   └── worker-profile.tsx    # Worker profile details
│   ├── (auth)/                   # Authentication screens
│   │   ├── (stack)/
│   │   │   ├── intro.tsx         # Intro/Welcome screen
│   │   │   ├── login.tsx         # Login with KeyboardAvoidingView
│   │   │   └── signup.tsx        # Signup screen
│   │   └── _layout.tsx           # Auth stack layout
│   ├── (user)/                   # Citizen user screens
│   │   ├── (tabs)/               # Tab navigation
│   │   │   ├── _layout.tsx       # Tab bar with 3 tabs
│   │   │   ├── home.tsx          # Dashboard with new report button
│   │   │   ├── reports.tsx       # User reports list with filters
│   │   │   └── profile.tsx       # Profile with stats (removed notifications)
│   │   ├── new-report.tsx        # Create new report with camera & map
│   │   ├── report-details.tsx    # Report details with map & status timeline
│   │   └── _layout.tsx           # User stack layout
│   ├── (worker)/                 # Worker role screens
│   │   ├── (tabs)/               # Tab navigation
│   │   │   ├── _layout.tsx       # Tab bar with 3 tabs
│   │   │   ├── home.tsx          # Worker dashboard with active tasks
│   │   │   ├── reports.tsx       # All assigned tasks
│   │   │   └── profile.tsx       # Profile with NGO info & work stats
│   │   ├── task-details.tsx      # Task details with map, status & completion
│   │   └── _layout.tsx           # Worker stack layout
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point with role-based routing
├── assets/                       # Images, fonts, static files
│   ├── images/
│   └── appimages/
├── component/                    # Reusable React components
│   ├── AdminMapView.tsx          # Admin map component with markers
│   ├── LocationMap.tsx           # Simple location display map
│   ├── AppTextInput.tsx          # Input with eye icon toggle
│   ├── AppButton.tsx             # Custom button component
│   ├── Container.tsx             # Screen container with SafeAreaView
│   ├── AssignWorkerModal.tsx     # Modal for assigning workers
│   └── ChangeStatusModal.tsx     # Modal for status updates
├── constants/                    # App constants and theme
│   └── theme.ts                  # Theme colors and styles
├── firebase/                     # Firebase integration
│   ├── services/
│   │   ├── AuthService.ts        # Authentication operations
│   │   ├── UserService.ts        # User CRUD operations
│   │   ├── ReportService.ts      # Report CRUD with status tracking
│   │   ├── WorkerService.ts      # Worker management
│   │   ├── NGOService.ts         # NGO CRUD operations
│   │   ├── NGOReportService.ts   # NGO-scoped report queries
│   │   ├── StorageService.ts     # Image upload/download
│   │   └── AIService.ts          # AI verification integration
│   └── hooks/
│       ├── useAuth.ts            # Auth hooks (login, signup, logout)
│       ├── useUser.ts            # User data hooks
│       ├── useReport.ts          # Report hooks with React Query
│       ├── useNGO.ts             # NGO data hooks
│       └── useNGOReports.ts      # NGO-scoped report hooks (7 hooks)
├── utils/                        # Utility functions
│   ├── colors.ts                 # Color constants
│   └── locationTracker.ts       # Location utilities
├── android/                      # Android native code
│   ├── app/
│   │   ├── build.gradle          # App-level Gradle config
│   │   ├── google-services.json  # Firebase Android config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/              # Android resources
│   ├── build.gradle              # Project-level Gradle
│   ├── gradle.properties         # newArchEnabled=true
│   └── settings.gradle
├── app.json                      # Expo configuration
├── package.json                  # Dependencies (React Query v5, Firebase v23.7.0)
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint rules
├── google-services.json          # Firebase config (root)
└── README.md                     # This file
```

---

## 🔐 User Roles & Permissions

| Role | Access | Key Permissions |
|------|--------|----------------|
| **Citizen** | Public users | Create reports, view own reports, track status with timeline, view before/after photos, edit profile |
| **Worker** | NGO field staff | View NGO-assigned tasks, update status, upload completion photos, view task maps, see NGO details |
| **Admin** | NGO administrators | View NGO-scoped reports, assign tasks to workers, manage workers, view statistics, access hotspot map, see organization details |

**NGO-Scoped Data Isolation**: Each NGO only sees their own reports, workers, and statistics. Reports are tagged with `ngoId` for multi-tenancy.

---

## 🔄 Data Flow

1. **Report Creation**
   - Citizen captures photo → GPS location auto-tagged → Optional AI category detection → Report submitted to Firestore with ngoId
   
2. **Assignment**
   - Admin views NGO-pending reports → Filters by status/severity → Assigns to worker via modal or report details → Worker receives notification → Status updated to "assigned"
   
3. **Task Execution**
   - Worker views task → Updates status to "in-progress" → Navigates to location using map → Completes cleanup
   
4. **Completion**
   - Worker uploads after-photo → Optional AI before/after verification → Status updated to "resolved" → `afterImageUrl` stored in report and reportStatus subcollection → Citizen notified and sees before/after comparison

5. **Tracking**
   - 4-stage status timeline (Pending → Assigned → In Progress → Resolved) visible to all roles
   - Status history stored in reportStatus subcollection with timestamps
   - Real-time updates via React Query cache invalidation

6. **Analytics**
   - Cloud Functions aggregate NGO-scoped data → Generate insights → Display on admin dashboard

---

## 🌐 Firebase Integration

### **Collections Structure**

```
/users/{userId}
  - role: "user" | "worker" | "admin"
  - name: string
  - email: string
  - phone?: string
  - imageUrl?: string
  - ngoId?: string (for workers and admins)
  - isActive?: boolean (for workers)
  - currentLocation?: GeoPoint (for workers)
  - assignedReports?: number (for workers)
  - completedReports?: number (for workers)
  - createdAt: Timestamp
  - updatedAt: Timestamp

/reports/{reportId}
  - userId: string (reporter)
  - userName: string
  - title?: string
  - description: string
  - category: string (e.g., "Plastic Waste", "Organic Waste")
  - severity?: "High" | "Medium" | "Low"
  - location: {
      latitude: number,
      longitude: number,
      address?: string
    }
  - imageUrl: string (before photo)
  - afterImageUrl?: string (after cleanup photo)
  - status: "pending" | "assigned" | "in-progress" | "resolved"
  - ngoId?: string (NGO responsible for this report)
  - assignedTo?: string (worker ID)
  - workerName?: string
  - aiVerified?: boolean
  - aiVerificationNote?: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
  - resolvedAt?: Timestamp
  
  # Subcollection for status tracking
  /reportStatus/{statusId}
    - status: "pending" | "assigned" | "in-progress" | "resolved"
    - timestamp: Timestamp
    - updatedBy?: string
    - afterImageUrl?: string (stored on completion)

/ngos/{ngoId}
  - ngoId: string (same as admin user ID)
  - ngoName: string
  - contactPerson: string
  - email: string
  - phone: string
  - address: string
  - city: string
  - adminId: string
  - registrationNumber: string
  - categories: string[] (waste types handled)
  - status: "pending" | "approved" | "rejected"
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

---

## 📊 Key Metrics & Analytics

- **NGO Dashboard Stats**: Total, Pending, Assigned, In Progress, Resolved reports per NGO
- **Response Time**: Time between report creation and assignment to worker
- **Resolution Time**: Time from assignment to completion (resolved status)
- **Hotspot Detection**: Interactive map with colored markers showing report density by location
- **Worker Performance**: 
  - Active tasks count
  - Completed tasks count
  - Success rate percentage
  - Tasks visible per worker card
- **Status Distribution**: Visual stats cards showing report counts by status
- **Severity Breakdown**: High/Medium/Low priority reports
- **Before/After Verification**: AI-powered comparison of cleanup results
- **Category Tracking**: Most common waste types reported

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js (v18+)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Expo CLI
- Firebase account

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd swachhsathi

# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### **Environment Setup**

1. **Firebase Configuration**
   - Create Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Set up Firestore database
   - Configure Firebase Storage
   - Download `google-services.json` for Android
   - Place in project root and `android/app/` directory

2. **Google Maps API**
   - Enable Google Maps Android API in Google Cloud Console
   - Add API key to `app.json`

3. **Android Setup**
   - Install Android SDK (via Android Studio)
   - Set `ANDROID_HOME` environment variable
   - Accept SDK licenses: `sdkmanager --licenses`
   - Ensure NDK is installed (27.1.12297006)

---

## 📦 React Query Usage

React Query (TanStack Query v5) is the **primary state management solution** for all server data:

- **Caching all Firestore reads** - Reduces unnecessary network calls with automatic cache management
- **Auto-refetching fresh data in background** - Keeps UI up-to-date with configurable stale times
- **Offline support** - Works without internet, syncs when online using persistence
- **Pagination for reports list** - Efficient loading of large datasets (not yet implemented)
- **Avoiding duplicate fetch operations** - Smart request deduplication across components
- **Real-time UI updates** - Automatic cache invalidation and refetch on mutations
- **Optimistic updates** - Instant feedback for mutations before server confirmation
- **Error handling** - Built-in retry logic and error states

### Key Hooks

**Authentication:**
- `useAuthUser()` - Get current authenticated user
- `useSignIn()` - Login mutation
- `useSignUp()` - Signup mutation
- `useSignOut()` - Logout mutation

**User Management:**
- `useUser(userId)` - Fetch user profile data
- `useUpdateUser()` - Mutation for profile updates
- `useWorkersByNGO(ngoId)` - Fetch workers for specific NGO
- `useWorkers()` - Fetch all workers

**Reports (Standard):**
- `useUserReports(userId)` - Fetch user-specific reports
- `useAllReports()` - Fetch all reports (non-scoped)
- `useReport(reportId)` - Fetch single report details
- `useCreateReport()` - Mutation for creating reports
- `useUpdateReportStatus()` - Mutation for status updates
- `useAssignReport()` - Mutation for worker assignment

**NGO-Scoped Reports:**
- `useNGOReports(ngoId)` - Fetch all NGO reports
- `usePendingNGOReports(ngoId)` - Fetch pending reports for NGO
- `usePendingReportsByCategories(ngoId, categories)` - Filter by categories
- `useNGOReportsByStatus(ngoId, status)` - Filter by status
- `useWorkerReportsInNGO(ngoId, workerId)` - Worker's tasks in NGO
- `useNGOReportStats(ngoId)` - Get statistics for NGO dashboard
- `useAssignReportToWorker()` - Mutation for NGO-scoped assignment

**NGO Management:**
- `useNGO(ngoId)` - Fetch NGO details
- `useAllNGOs()` - Fetch all NGOs
- `useNGOsByStatus(status)` - Filter NGOs by approval status

---

## 🎨 Design Principles

- **Mobile-First**: Optimized for smartphones with touch interfaces and responsive layouts
- **Offline-Ready**: Works without internet, syncs when online via React Query persistence
- **User-Friendly**: Simple, intuitive UI for all literacy levels with clear navigation
- **Real-Time**: Instant updates via Firebase onSnapshot and React Query cache invalidation
- **Accessible**: High contrast themes, readable fonts, icon-based navigation
- **Performance**: Optimized images, lazy loading, efficient queries with pagination
- **Consistent**: Reusable components (AppTextInput, AppButton, Container, Modals)
- **Role-Based**: Tailored UIs for each user role (Citizen, Worker, Admin)
- **Multi-Tenant**: NGO-scoped data isolation ensures privacy and organization independence
- **Visual Feedback**: Color-coded status badges, interactive maps, before/after comparisons

---

## 🔮 Future Enhancements

- **AI-Powered Features**:
  - Enhanced waste classification with higher accuracy
  - Automatic severity detection from images
  - Predictive hotspot analysis
- **Worker Features**:
  - Category-based automatic assignment (match worker skills to report types)
  - Route optimization for multiple tasks
  - Real-time location tracking during task execution
- **Gamification**: 
  - Reward points for active citizens
  - Leaderboards for top reporters and cleaners
  - Badges and achievements
- **Community Features**:
  - Public dashboard for transparency
  - Citizen upvoting for urgent issues
  - Community cleanup events
- **Advanced Analytics**:
  - Predictive analytics for waste generation patterns
  - Heatmaps with time-based filtering
  - NGO performance comparison (anonymized)
- **Accessibility**:
  - Voice reports for accessibility
  - Hindi and regional language support
  - Screen reader optimization
- **IoT Integration**: 
  - Smart bin sensors for automated alerts
  - Fill-level monitoring
- **Notifications**:
  - Push notifications for all status updates
  - In-app notification center
  - Email summaries for admins
- **UI Enhancements**:
  - Complete dark mode implementation
  - Theme customization per NGO
  - Advanced filtering with date ranges

---

## 🐛 Known Issues & Solutions

### Android Build
- **NDK Corruption**: Delete `android-sdk/ndk` and let Gradle re-download
- **New Architecture**: Ensure `newArchEnabled=true` in both `gradle.properties` and `app.json`
- **Google Services**: Ensure `google-services.json` is in both root and `android/app/`

### Firebase
- **Firestore Indexes**: Create compound indexes for NGO-scoped queries:
  - `ngoId` + `status` (ascending)
  - `ngoId` + `createdAt` (descending)
  - Collection: `reports`
- **Security Rules**: Implement role-based rules to prevent cross-NGO data access

### UI Components
- **Keyboard Overlap**: Use `KeyboardAvoidingView` with `ScrollView` on auth screens
- **Date Formatting**: Use `formatDate()` helper to handle Firestore Timestamps correctly
- **Map Centering**: Map auto-centers on reports when they load (500ms delay for smooth animation)

### React Query
- **Cache Invalidation**: Ensure proper `queryClient.invalidateQueries()` after mutations
- **Stale Time**: Adjust `staleTime` based on data freshness requirements
- **NGO Scope**: Always pass `ngoId` to hooks to ensure proper data isolation

### Performance
- **Image Upload**: Compress images before upload to reduce storage costs
- **Large Lists**: Implement pagination for reports and workers (currently showing all)
- **Map Performance**: Limit number of markers shown simultaneously on hotspot map

---

## 📄 License

This project was built for a hackathon and is intended for educational and civic purposes.

---

## 👥 Team

Developed during a hackathon to solve urban waste management challenges through technology.

---

## 🤝 Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for a cleaner, smarter city**  

