# 🏬 Store Explorer App

A simple React-based UI that lets users explore a list of stores, filter them by category, status, and custom filters, and mark their favorites. Categories and stores are dynamically fetched from a backend API. It also supports infinite scrolling, real-time filtering via URL parameters, and stores user preferences in localStorage.

---

## ✨ Features

- 🔍 **Search and Filter**:  
  Users can filter stores by:
  - Name
  - Status (publish, draft, trash)
  - Cashback availability
  - Promotion status
  - Sharability
  - First letter (A–Z)

- 🧭 **Categories with URL Sync**:  
  Categories are clickable and update the URL so users can share filtered views easily.

- 🔁 **Infinite Scroll**:  
  Stores are fetched in chunks as users scroll down.

- 💖 **Favorites with localStorage**:  
  Users can mark stores as favorites which persist across page reloads.

- ⚡ **Real-Time URL Sync**:  
  All filters and category selections sync with the URL and update the view without full page reloads.

---

## 📁 Components

### `Categories.jsx`
- Fetches a list of categories from the backend.
- Allows toggling categories on/off.
- Updates URL query parameters (`cats=categoryId`) for filtering.
- Reacts to `popstate` and custom `urlUpdate` events to stay in sync with navigation.

### `AllStores.jsx`
- Fetches a paginated list of stores with filters applied from the URL.
- Filters include:
  - Name search (`name_like`)
  - Status (`status`)
  - Boolean filters (`cashback_enabled`, `is_promoted`, `is_sharable`)
  - Alphabetical filter (via regex-style search)
- Implements infinite scrolling.
- Stores "favorites" locally using `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Backend (assumed)**: JSON Server or custom Express API
- **State**: React state and URL query parameters
- **Persistence**: localStorage (for favorites)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/store-explorer.git
cd store-explorer

### 2. Install dependencies

- npm install

### 3. Start your backend

- npm run start