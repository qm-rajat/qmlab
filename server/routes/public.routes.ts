import { Router } from "express";
import {
  isStoreConfigured,
  getSettings,
  getProjects,
  getBlogs,
  getCertificates,
} from "../lib/store.ts";

const router = Router();

router.get("/content", async (req, res) => {
  try {
    const [settings, projects, blogs, certificates] = await Promise.all([
      getSettings(),
      getProjects(),
      getBlogs(),
      getCertificates(),
    ]);
    res.json({ success: true, storeConfigured: isStoreConfigured(), settings, projects, blogs, certificates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load site content." });
  }
});

export default router;
