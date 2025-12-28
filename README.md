# Boris CHENG - Portfolio

A modern, internationalized portfolio website built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🌍 **Internationalization (i18n)** - Full support for English and French
- 🎨 **Modern Design** - Dark theme with red accents
- 📱 **Responsive** - Works on all devices
- 🔐 **Admin CMS** - Built-in content management system
- 📧 **Contact Form** - With email notifications via Resend
- 🗄️ **PostgreSQL** - Database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **i18n**: next-intl
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase, Neon, etc.)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   ├── [locale]/           # Internationalized pages
│   │   ├── about/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                # API routes
│       ├── about/
│       ├── contact/
│       ├── projects/
│       └── skills/
├── components/             # Shared components
├── lib/                    # Utilities
├── messages/               # i18n translations
├── prisma/                 # Database schema & seed
└── i18n.ts                # i18n configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## Admin Access

Access the admin panel at `/admin` (or `/<locale>/admin`).

Default credentials are set in environment variables:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## License

MIT
