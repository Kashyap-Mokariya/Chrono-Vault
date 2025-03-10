# Chrono Vault

Chrono Vault is a secure and efficient file storage and management application built with **Next.js**, **TypeScript**, and **Supabase**. It allows users to upload, manage, and organize files with a sleek and modern UI. Additionally, Chrono Vault will feature **AI-powered transcription and summarization** of **audio and video files**, utilizing **Assembly AI**.

## ✨ Features  

- 📁 **File Management** – Upload, rename, delete, and organize files seamlessly.  
- 🔍 **Search & Filtering** – Quickly find files using the built-in search and sorting options.  
- 🛡 **Secure Authentication** – User authentication powered by **Supabase Auth**.  
- ☁️ **Cloud Storage** – Files are stored securely using **Supabase Storage**.  
- 📂 **Folder Structure** – Organize files into folders for better accessibility.  
- 🎨 **Modern UI** – Built with **TailwindCSS** and **Radix UI** for a sleek design.  
- 🎙 **AI Transcription & Summarization** – Convert **audio and video files** into text and concise summaries using **Assembly AI**.  

## 🌐 Live Demo  

🔗 **Deployed Project:** [Chrono Vault](https://chrono-vault-nu.vercel.app/)  

## 🏗 Tech Stack  

| Frontend | Backend | Database | Dev Tools | AI Features |
| -------- | ------- | -------- | --------- | ----------- |
| Next.js 15 | Supabase Functions | PostgreSQL | TypeScript | Assembly AI |
| React 18 | Supabase Auth | Prisma ORM | TailwindCSS | Speech-to-Text |
| Radix UI | tRPC | Zod | ESLint & Prettier | Summarization API |

## 🚀 Installation & Setup  

### Prerequisites  

Ensure you have the following installed:  
- **Node.js** (v18 or later)  
- **pnpm** (Package Manager) 
- **Supabase Account** – Sign up at [Supabase](https://supabase.com/) and create a new project.  

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/your-username/chrono-vault.git
cd chrono-vault
```

### 2️⃣ Install Dependencies  

```sh
pnpm install
```

### 3️⃣ Set Up Supabase  

- **Create a Supabase Project**: Go to [Supabase Dashboard](https://app.supabase.com/) and create a new project.  
- **Enable Authentication**: Configure authentication providers in the **Supabase Auth** section.  
- **Set Up Storage**: Create a **Storage Bucket** for file uploads.  
- **Create Database Tables**: Use the SQL Editor in Supabase to create tables for storing file metadata. Example:

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    file_name TEXT NOT NULL,
    url TEXT NOT NULL,
    size INT8 NOT NULL,
    type TEXT NOT NULL,
    extension TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    uploaded_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    shared_with TEXT[],
    transcription TEXT,
    summary TEXT
);
```

- **Get Supabase Keys**: Copy the **Project URL** and **Anon/Public Key** from the API settings and update your `.env` file.

### 4️⃣ Set Up Environment Variables  

Copy `.env.example` and rename it to `.env`. Update it with your Supabase credentials.

### 5️⃣ Start the Development Server  

```sh
pnpm run dev
```

## 🧑‍💻 Project Structure  

```
chrono-vault/
├── public/       # Static assets
├── src/
│   ├── app/      # Main application pages
│   ├── components/ # Reusable UI components
│   ├── lib/      # Utility functions & API calls
│   ├── hooks/    # Custom React hooks
│   ├── constants/ # App-wide constants
│   ├── types/    # TypeScript type definitions
│   ├── styles/   # Global styles
│   ├── supabase/ # Supabase client & authentication setup
│   ├── ai/       # Assembly AI integration for transcription & summarization
│   ├── middleware.ts # Middleware configurations
├── .env.example  # Environment variables template
├── README.md     # Project documentation
├── package.json  # Project dependencies
├── tailwind.config.ts  # TailwindCSS configuration
├── next.config.ts # Next.js configuration
└── tsconfig.json  # TypeScript configuration
```

## 📌 API Routes  

| Route | Method | Description |
|-------|--------|------------|
| `/api/files` | `GET` | Get all files |
| `/api/files/upload` | `POST` | Upload a new file |
| `/api/files/:id` | `DELETE` | Delete a file |
| `/api/files/:id` | `PATCH` | Rename a file |
| `/api/transcribe` | `POST` | Transcribe an audio/video file |
| `/api/summarize` | `POST` | Generate a summary from a transcription |
