# Vercel Deployment Guide

## ✅ Build Status
The project layout has been fixed to support Vercel deployment. The build errors related to "Missing OpenAI API Key" have been resolved.

## ⚠️ CRITICAL: SQLite Limitation
You are currently using **SQLite** (`dev.db`) as your database.
- **Problem**: Vercel Serverless Functions have an ephemeral (temporary) filesystem. If you deploy this project to Vercel, **your database will reset every time the server restarts or a new function is invoked.** You will lose all user accounts, properties, and leads.
- **Solution**: To run this properly on Vercel, you should switch to a cloud database provider like:
    - **Vercel Postgres**
    - **Neon** (Postgres)
    - **Turso** (SQLite for Edge)

## 🔑 Environment Variables
When deploying to Vercel, make sure to add the following Environment Variables in your Vercel Project Settings:

1. `NEXTAUTH_SECRET`: (Generate a random string)
2. `NEXTAUTH_URL`: `https://your-project-name.vercel.app`
3. `OPENROUTER_API_KEY`: `sk-or-v1-...` (Your Key)
4. `DATABASE_URL`: `postgres://...` (If you switch to a cloud DB)
