# HomeConnect AI - Premium Real Estate Ecosystem 🏠✨

HomeConnect AI is a sophisticated, full-stack real estate CRM and property search platform designed to bridge the gap between buyers and agents using cutting-edge design and Artificial Intelligence. It features a state-of-the-art **Glassmorphism UI**, real-time performance analytics, and a robust AI-driven matching engine.

---

## 🌟 Project Highlights

### 🎨 Design Philosophy
- **Modern Aesthetics**: Built with a proprietary Glassmorphism system, featuring depth blur, organic gradients, and dynamic shadows.
- **Cinematic Experience**: Immersive property galleries with Ken Burns animations and fluid micro-interactions.
- **Responsive & Premium**: Crafted to feel like a high-end luxury application across all device sizes.

### 🤖 AI-Powered Intelligence
- **Smart Description Generator**: Agents can instantly generate professional property descriptions using context-aware AI.
- **Match Score Engine**: Buyers see a "Suitability %" for every property based on their preferences and lifestyle.
- **AI Analytics**: Real-time insights into listing performance and market trends.

---

## 👥 Role-Based Workflows

### 💼 For Real Estate Agents
- **Performance Command Center**: Track views, leads, and conversion rates with interactive gradient charts.
- **Listing Management**: Professional tools to add, edit, and track property performance.
- **Lead Intelligence**: Manage inquiries and schedule VIP viewings through an integrated appointment system.
- **Floating Action Tools**: Quick-access buttons for adding properties and analyzing data.

### 🏠 For Home Buyers
- **Intelligent Search**: Advanced filtering with AI-powered matching.
- **Interactive Exploration**: Seamless map-based search with real-time property markers.
- **Property Comparison**: Side-by-side comparison of up to 3 properties.
- **Wishlist & History**: Save favorites and track viewed properties with persistent storage.
- **Integrated Messaging**: Connect directly with agents through a built-in real-time chat interface.

---

## 🛠 Technical Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) for high-performance SSR and SEO.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with multi-role (Buyer/Agent/Admin) support.
- **ORM & Database**: [Prisma](https://www.prisma.io/) with SQLite for rapid development (easily portable to PostgreSQL/MySQL).
- **Styling**: Vanilla CSS Utility System for maximum performance and zero-dependency glassmorphism.
- **Icons**: [Lucide React](https://lucide.dev/) for a clean, consistent visual language.
- **UI Components**: Hand-crafted reusable components (StatCards, GlassCards, Skeletons, etc.).

---

## 🚀 Installation & Setup

### 1. Requirements
- Node.js 18+ 
- npm or yarn

### 2. Setup Environment
Rename `.env.example` to `.env` and configure your `NEXTAUTH_SECRET`.

### 3. Database Initialization
```bash
# Install dependencies
npm install

# Push schema and generate Prisma client
npx prisma db push

# Seed the database with premium Indian property data
node prisma/seed-indian-data.js
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📊 Database Schema Overview

The platform uses a highly relational schema including:
- **User**: Managed roles (Buyer, Agent, Admin) and profile data.
- **Property**: Comprehensive data including multi-image JSON arrays and view tracking.
- **Leads & Appointments**: State-managed interaction tracking between buyers and agents.
- **Messages**: Threaded interaction system.
- **Views**: Dedicated per-property view counting for performance analytics.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

### 👨‍💻 Developed by
[Your Name/GitHub Handle]
