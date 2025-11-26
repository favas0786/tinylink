# TinyLink 🔗

A full-stack URL shortener application built with **Next.js 14 (App Router)**, **TypeScript**, and **PostgreSQL**.

This project allows users to shorten long URLs, customize their short codes, track real-time click statistics, and manage links via a clean, responsive dashboard.

## 🚀 Live Demo
**[View Live Application](https://tinylink-git-main-favas0786s-projects.vercel.app/)**


---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Deployment:** Vercel

---

## ✨ Key Features

- **Link Shortening:** Convert long URLs into short, shareable links.
- **Custom Codes:** Users can optionally choose a custom alias (e.g., `/my-portfolio`).
- **Collision Handling:** robust logic to ensure unique codes; random codes are regenerated if a collision occurs.
- **Real-time Analytics:** Track total clicks and "Last Clicked" timestamps.
- **Clean Dashboard:** View, copy, visit, and delete links from a responsive table.
- **Performance:** Database queries are optimized using indexing on the `shortCode` column for fast redirects.
- **Health Check:** Dedicated `/healthz` endpoint for automated uptime monitoring.

---

## ⚙️ Getting Started Locally

Follow these steps to run the project on your local machine.

### 1. Clone the repository
```bash
git clone [https://github.com/favas0786/tinylink.git](https://github.com/favas0786/tinylink.git)
cd tinylink
