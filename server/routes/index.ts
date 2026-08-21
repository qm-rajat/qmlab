import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import publicRoutes from "./public.routes.js";
import seoRoutes from "./seo.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/seo", seoRoutes);
router.use("/", contactRoutes); // This will map /api/smtp-status, /api/test-smtp, and /api/contact
router.use("/", publicRoutes);  // This will map /api/content

export default router;
