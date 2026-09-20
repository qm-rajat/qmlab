import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  saveContacts,
  saveServices,
  saveCustomPassword,
  saveStoredAiApiKey
} from "../server/lib/store";

const BACKUP_DIR = path.join(process.cwd(), ".data", "backups");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runRestore() {
  let args = process.argv.slice(2);
  let force = false;
  if (args.includes("--force")) {
    force = true;
    args = args.filter(a => a !== "--force");
  }
  let backupFilename = "latest.json";
  
  if (args.length > 0) {
    backupFilename = args[0];
  }

  const backupPath = path.join(BACKUP_DIR, backupFilename);

  console.log(`Starting restore process from: ${backupPath}`);

  try {
    // 1. Read and validate the backup JSON
    const dataStr = await fs.readFile(backupPath, "utf-8");
    const backup = JSON.parse(dataStr);

    if (!backup.data || !backup.timestamp) {
      throw new Error("Invalid backup file format. Missing 'data' or 'timestamp'.");
    }

    const payload = backup.data ? backup.data : backup;
    const { settings, projects, blogs, certificates, contacts, services, customPassword, aiApiKey } = payload;

    if (!settings || typeof settings !== "object") throw new Error("Invalid settings in backup.");
    if (projects && !Array.isArray(projects)) throw new Error("Invalid projects array in backup.");
    if (blogs && !Array.isArray(blogs)) throw new Error("Invalid blogs array in backup.");
    if (certificates && !Array.isArray(certificates)) throw new Error("Invalid certificates array in backup.");
    if (contacts && !Array.isArray(contacts)) throw new Error("Invalid contacts array in backup.");

    // 2. Display restore summary
    console.log(`\nBackup timestamp: ${backup.timestamp || 'N/A'}`);
    console.log("Data to restore:");
    console.log(`- Settings: Present (with dynamic SEO & metadata)`);
    console.log(`- Projects: ${projects?.length || 0}`);
    console.log(`- Blogs: ${blogs?.length || 0}`);
    console.log(`- Certificates: ${certificates?.length || 0}`);
    console.log(`- Contacts: ${contacts?.length || 0}`);
    console.log(`- Services: ${services?.length || 0}`);

    // 3. Require explicit confirmation
    console.log("\n⚠️  WARNING: This will OVERWRITE current data in Redis.");
    let answer = force ? "yes" : await askQuestion("Are you sure you want to proceed? (yes/no): ");
    
    if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
      console.log("Restore cancelled.");
      process.exit(0);
    }

    console.log("Restoring data to Redis...");

    // 4. Restore data
    await saveSettings(settings);
    console.log("✅ Restored Settings");

    if (projects && Array.isArray(projects)) {
      await saveProjects(projects);
      console.log("✅ Restored Projects");
    }

    if (blogs && Array.isArray(blogs)) {
      await saveBlogs(blogs);
      console.log("✅ Restored Blogs");
    }

    if (certificates && Array.isArray(certificates)) {
      await saveCertificates(certificates);
      console.log("✅ Restored Certificates");
    }

    if (contacts && Array.isArray(contacts)) {
      await saveContacts(contacts);
      console.log("✅ Restored Contacts");
    }

    if (services && Array.isArray(services)) {
      await saveServices(services);
      console.log("✅ Restored Services");
    }

    if (customPassword) {
      await saveCustomPassword(customPassword);
      console.log("✅ Restored Admin Password");
    }

    if (aiApiKey) {
      await saveStoredAiApiKey(aiApiKey);
      console.log("✅ Restored AI API Key");
    }

    console.log("\n🎉 Restore completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Restore failed:");
    console.error(error);
    process.exit(1);
  }
}

runRestore();
