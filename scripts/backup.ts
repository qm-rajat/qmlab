import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import {
  getSettings,
  getProjects,
  getBlogs,
  getCertificates,
  getContacts,
  getServices,
  getFaqs,
  getWorkflowSteps,
  getTrustGuarantees,
  getCustomPassword,
  getStoredAiApiKey
} from "../server/lib/store";

const BACKUP_DIR = path.join(process.cwd(), ".data", "backups");

async function runBackup() {
  console.log("Starting backup process...");

  try {
    // 1. Read all CMS data from Redis
    const settings = await getSettings();
    const projects = await getProjects();
    const blogs = await getBlogs();
    const certificates = await getCertificates();
    const contacts = await getContacts();
    const services = await getServices();
    const faqs = await getFaqs();
    const workflowSteps = await getWorkflowSteps();
    const trustGuarantees = await getTrustGuarantees();
    const customPassword = await getCustomPassword();
    const aiApiKey = await getStoredAiApiKey();

    // 2. Validate exported data
    if (!settings || typeof settings !== "object") {
      throw new Error("Invalid settings data retrieved.");
    }
    if (!Array.isArray(projects)) throw new Error("Invalid projects data retrieved.");
    if (!Array.isArray(blogs)) throw new Error("Invalid blogs data retrieved.");
    if (!Array.isArray(certificates)) throw new Error("Invalid certificates data retrieved.");
    if (!Array.isArray(contacts)) throw new Error("Invalid contacts data retrieved.");
    if (!Array.isArray(services)) throw new Error("Invalid services data retrieved.");

    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        settings,
        projects,
        blogs,
        certificates,
        contacts,
        services,
        faqs,
        workflowSteps,
        trustGuarantees,
        customPassword,
        aiApiKey,
      }
    };

    // 3. Create backup directory if it doesn't exist
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // 4. Create latest.json
    const latestPath = path.join(BACKUP_DIR, "latest.json");
    await fs.writeFile(latestPath, JSON.stringify(backupData, null, 2), "utf-8");
    
    // 5. Create dated archive
    const dateStr = new Date().toISOString().replace(/:/g, "-").split(".")[0];
    const archivePath = path.join(BACKUP_DIR, `backup-${dateStr}.json`);
    await fs.writeFile(archivePath, JSON.stringify(backupData, null, 2), "utf-8");

    // 6. Print backup summary
    console.log("✅ Backup completed successfully!");
    console.log(`- Latest backup saved to: ${latestPath}`);
    console.log(`- Archive backup saved to: ${archivePath}`);
    console.log("Summary of backed up data:");
    console.log(`  - Projects: ${projects.length}`);
    console.log(`  - Blogs: ${blogs.length}`);
    console.log(`  - Certificates: ${certificates.length}`);
    console.log(`  - Contacts: ${contacts.length}`);
    console.log(`  - Services: ${services.length}`);
    console.log(`  - FAQs: ${faqs.length}`);
    console.log(`  - Workflow Steps: ${workflowSteps.length}`);
    console.log(`  - Trust Guarantees: ${trustGuarantees.length}`);
    console.log(`  - Settings: Complete (with dynamic SEO & metadata)`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Backup failed:");
    console.error(error);
    process.exit(1);
  }
}

runBackup();
