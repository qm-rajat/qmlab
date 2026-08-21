# QMLabs Portfolio & CRM Console

This project is a full-stack portfolio and CMS application powered by React, Express, and Redis.

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:
- `REDIS_URL` (or `KV_URL` / `REDIS_CONNECTION_STRING`): Connection string for your Redis database.
- `ADMIN_PASSWORD`: A secure password for the admin dashboard.
- `JWT_SECRET`: Secret key for signing admin sessions.
- `GEMINI_API_KEY` (optional): If using AI generation features.

## Workflows

### 1. Local Development Workflow
- Run `npm install` to install dependencies.
- Make sure you have your `.env` configured with `REDIS_URL`.
- Run `npm run dev` to start the local development server on port 3000.
- If your Redis database is empty, run `npm run seed` to populate it with default data.

### 2. GitHub Codespaces Workflow
- If you're running this in GitHub Codespaces, standard local environment rules apply. 
- Ensure that you add `REDIS_URL` to your Codespaces secrets to automatically apply to the environment.
- Note: Do not rely on local `.json` fallback files in production. Use the backup tools below if you need to extract data out of Codespaces.

### 3. Backup Workflow
To protect your production data, you can export all your Redis content to local JSON files:
- Run `npm run backup`
- This will query your Redis database and create an archive file inside `.data/backups/`.
- Backups include a `latest.json` and a timestamped file.
- You can safely commit these backups to a private GitHub repository for safekeeping.

### 4. Disaster Recovery Workflow
If data is corrupted or you need to restore the database from a backup:
- Check the `.data/backups/` directory for your backup files.
- Run `npm run restore` (defaults to restoring `latest.json`).
- Or, run `npm run restore <filename>` to specify a specific archive file.
- **WARNING:** This will completely overwrite the existing data in your configured Redis database.
