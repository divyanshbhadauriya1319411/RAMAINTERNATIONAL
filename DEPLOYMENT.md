# Deployment & Architecture Blueprint - RAMA INTERNATIONAL-INDIA

This document outlines the deployment strategy, environment configuration, database setup, and clean architecture pattern for deploying **RAMA INTERNATIONAL-INDIA** to a production environment.

---

## 1. Architecture Overview

```mermaid
graph TD
    Client[Client Browser / Mobile] -->|HTTPS| Vercel[Vercel Serverless Hosting]
    Vercel -->|Route Handlers| NextJS[Next.js App Engine]
    NextJS -->|ORM| Prisma[Prisma Client]
    Prisma -->|PostgreSQL Protocol| SupabaseDB[(PostgreSQL Database)]
    NextJS -->|API Dispatch| Resend[Resend Email Gateway]
    NextJS -->|Media Stream| Cloudinary[Cloudinary Media Engine]
```

The application uses **Next.js 16** serverless architecture:
- **Frontend / Pages**: Built on React 19, server/client components, fully response-driven with HSL custom colors.
- **Backend / APIs**: REST APIs running in serverless route handlers (`/src/app/api`).
- **Data Access Layer**: Structured via the **Repository Pattern** and **Service Pattern** inside `src/repositories/` and `src/services/` respectively.
- **Validation**: Strict boundary validation via **Zod** schema schemas.

---

## 2. Environment Variables

Create a `.env` file in the root directory based on the `.env.example` template:

| Variable | Description | Example / Fallback |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key used for signing cookies | Any high-entropy random string |
| `NEXT_PUBLIC_APP_URL` | Canonical URL of your app | `https://your-domain.com` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary Cloud Name | `your-cloud-name` (local fallback if empty) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your-api-key` |
| `CLOUDINARY_API_SECRET`| Cloudinary Secret Key | `your-api-secret` |
| `RESEND_API_KEY` | Resend email API token | `re_12345` (logs to console if empty) |

---

## 3. Database setup & Seed

1. **Configure connection**: Ensure `DATABASE_URL` is set to a valid PostgreSQL database (e.g. Neon, Supabase, AWS RDS).
2. **Apply migrations**: Run the migrations to establish the schema:
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Database Seeding**: Run the database seeder to populate core metadata (Countries, Sectors, Testimonials, Jobs, Users):
   ```bash
   npx prisma db seed
   ```

---

## 4. Vercel Deployment Steps

1. **Import Project**: Select the project from your GitHub repository in the Vercel dashboard.
2. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Install Command: `npm install`
3. **Environment Variables**: Add all parameters from the table above in Vercel **Project Settings -> Environment Variables**.
4. **Deploy**: Click **Deploy**. Vercel will automatically build the client bundle and deploy serverless route handlers.
