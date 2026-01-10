# 🧼 Swachhsathi – Smart Garbage Reporting App  
A modern civic-tech mobile application that empowers citizens to report garbage issues in their city.  
Municipal admins and workers can track, assign, and resolve reports in real-time.

Built using **React Native (Expo)** with **Firebase**, **MobX** for global state management, and **TanStack React Query** for caching, offline support, and background sync.

---

## 🚀 Features

### 🧑‍🤝‍🧑 User App
- Upload garbage photos  
- Auto-detected GPS location  
- Submit reports to municipality  
- Track report status (timeline view)  
- Get notifications when report is assigned or completed  
- View nearby reports and hotspots  
- Multi-language support (optional)

### 🛠 Worker App
- Receive assigned tasks  
- View report details with location  
- Update progress  
- Upload after-clean photos  
- Mark tasks as completed

### 🏛 Admin App (Mobile)
- View all complaints  
- Filter by: Pending / Assigned / Completed / Urgent  
- Assign reports to available workers  
- Monitor worker performance  
- Analytics: category, zones, hotspots, daily trends  

---

## 🧱 Tech Stack

### **Frontend**
- **React Native (Expo)**
- **MobX** → global, observable app state
- **React Query (TanStack Query)** → remote data caching + background sync
- **Expo Router** or React Navigation
- **TypeScript** (recommended)

### **Backend**
- **Firebase Authentication** (Phone auth)
- **Firestore Database**
- **Storage** (Before/after images)
- **Cloud Functions** (Analytics, notifications)
- **FCM** push notifications

---

## 📦 React Query Usage  
React Query is used for:

- Caching all Firestore reads  
- Auto-refetching fresh data in background  
- Offline support  
- Pagination for reports list  
- Avoiding duplicate fetch operations  
- Real-time UI updates  

