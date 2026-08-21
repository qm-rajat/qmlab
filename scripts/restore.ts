import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import {
  saveSettings,
  saveProjects,
  saveBlogs,
  saveCertificates,
  saveContacts
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

    const { settings, projects, blogs, certificates, contacts } = backup.data;

    if (!settings || typeof settings !== "object") throw new Error("Invalid settings in backup.");
    if (!Array.isArray(projects)) throw new Error("Invalid projects array in backup.");
    if (!Array.isArray(blogs)) throw new Error("Invalid blogs array in backup.");
    if (!Array.isArray(certificates)) throw new Error("Invalid certificates array in backup.");
    if (!Array.isArray(contacts)) throw new Error("Invalid contacts array in backup.");

    // 2. Display restore summary
    console.log(`\nBackup timestamp: ${backup.timestamp}`);
    console.log("Data to restore:");
    console.log(`- Settings: Present`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Blogs: ${blogs.length}`);
    console.log(`- Certificates: ${certificates.length}`);
    console.log(`- Contacts: ${contacts.length}`);

    // 3. Require explicit confirmation
    console.log("\n⚠️  WARNING: This will OVERWRITE current data in Redis.");
    let answer = force ? "yes" : await askQuestion("Are you sure you want to proceed? (yes/no): ");
    
    if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
      console.log("Restore cancelled.");
      process.exit(0);
    }

    console.log("Restoring data to Redis...");

    // 4. Restore data (using Promise.all for speed, or sequentially for safety)
    // We do it sequentially to ensure order and avoid overwhelming the connection.
    await saveSettings(settings);
    console.log("✅ Restored Settings");

    await saveProjects(projects);
    console.log("✅ Restored Projects");

    await saveBlogs(blogs);
    console.log("✅ Restored Blogs");

    await saveCertificates(certificates);
    console.log("✅ Restored Certificates");

    await saveContacts(contacts);
    console.log("✅ Restored Contacts");

    console.log("\n🎉 Restore completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Restore failed:");
    console.error(error);
    process.exit(1);
  }
}

runRestore();
