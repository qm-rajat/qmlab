import { Router } from "express";
import adminRoutes from "./admin.routes";
import publicRoutes from "./public.routes";
import seoRoutes from "./seo.routes";
import contactRoutes from "./contact.routes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/seo", seoRoutes);
router.use("/", contactRoutes); // This will map /api/smtp-status, /api/test-smtp, and /api/contact
router.use("/", publicRoutes);  // This will map /api/content

export default router;
