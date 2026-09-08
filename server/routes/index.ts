import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import publicRoutes from "./public.routes.js";
import contactRoutes from "./contact.routes.js";
import aiRoutes, { mcpRouter, generateOpenApiSpec } from "./ai.routes.js";

const router = Router();

// OpenAPI Spec directly accessible at /api/openapi.json
router.get("/openapi.json", (req, res) => {
  res.json(generateOpenApiSpec(req));
});

// Model Context Protocol endpoint directly accessible at /api/mcp and /api/sse
router.use("/mcp", mcpRouter);
router.use("/sse", mcpRouter);

// AI Agent & Custom GPT REST API at /api/ai
router.use("/ai", aiRoutes);

router.use("/admin", adminRoutes);
router.use("/", contactRoutes); // This will map /api/smtp-status, /api/test-smtp, /api/contact, and /api/unsubscribe
router.use("/", publicRoutes);  // This will map /api/content

export default router;
