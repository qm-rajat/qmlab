import "dotenv/config";
import {
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_BLOGS,
  DEFAULT_CERTIFICATES,
  DEFAULT_CONTACTS
} from "../seed/data";
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  saveContacts,
  getSettings
} from "../server/lib/store";

async function runSeed() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");

  console.log("Checking if Redis already has data...");
  const existingSettings = await getSettings();

  if (existingSettings && existingSettings.hero_name !== "" && !force) {
    console.log("Redis database appears to already be populated.");
    console.log("Aborting seed to prevent overwriting existing data.");
    console.log("If you want to re-seed and overwrite everything, run: npm run seed -- --force");
    process.exit(0);
  }

  if (force) {
    console.log("⚠️ Force flag detected. Overwriting existing database data...");
  }

  console.log("Seeding Redis database with default data...");

  try {
    await saveSettings(DEFAULT_SETTINGS);
    console.log("✅ Seeded Settings");

    await saveProjects(DEFAULT_PROJECTS);
    console.log("✅ Seeded Projects");

    await saveBlogs(DEFAULT_BLOGS);
    console.log("✅ Seeded Blogs");

    await saveCertificates(DEFAULT_CERTIFICATES);
    console.log("✅ Seeded Certificates");

    await saveContacts(DEFAULT_CONTACTS);
    console.log("✅ Seeded Contacts");

    console.log("Database seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
}

runSeed();
