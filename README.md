# Resume Builder

A bilingual (Thai/English) resume builder with live preview, design customization, and PDF export.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB
- **Authentication:** NextAuth v5 (Credentials + Google OAuth)
- **PDF Generation:** Puppeteer-core
- **Language:** TypeScript

## Features

- ✏️ **Inline title editing** — rename resumes from the editor
- 🌐 **Bilingual content** — switch between Thai (TH) and English (EN) per section
- 🎨 **Design customization** — templates, color themes, font pairings, spacing
- 👁️ **Live preview** — see changes in real time with A4 page margins
- 📄 **PDF export** — server-side PDF generation matching the preview exactly
- 🔐 **Authentication** — login via credentials or Google OAuth
- 🌙 **Dark mode** — automatic or manual toggle

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- pnpm (recommended) or npm

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/resume-builder
MONGODB_DB=resume
AUTH_SECRET=your-generated-secret
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

#### Google OAuth (optional)

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

> **Deploy on Vercel:** Add all environment variables above in Vercel Dashboard → Project Settings → Environment Variables, then redeploy.

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `pnpm dev`    | Start development server  |
| `pnpm build`  | Production build          |
| `pnpm start`  | Start production server   |
| `pnpm lint`   | Run Next.js lint          |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (resumes CRUD, auth, admin, PDF generation)
│   ├── resumes/       # Resume list and editor pages
│   ├── login/         # Login page
│   └── admin/         # Admin user management
├── components/        # React components
│   ├── ResumeBuilder.tsx      # Main editor orchestrator
│   ├── ResumeEditor.tsx       # Content editor (7-section tabs)
│   ├── ResumePreview.tsx      # Live preview / PDF rendering
│   ├── DesignConfigurator.tsx # Template & design settings
│   └── GuidePanel.tsx         # Job-specific writing guide
├── types/             # TypeScript interfaces
├── data/              # Mock data, themes, and templates
├── lib/               # Database connection, auth config
└── utils/             # PDF generation utilities
```
