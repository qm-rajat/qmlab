import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import publicRoutes from "./public.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/", contactRoutes); // This will map /api/smtp-status, /api/test-smtp, /api/contact, and /api/unsubscribe
router.use("/", publicRoutes);  // This will map /api/content

export default router;
