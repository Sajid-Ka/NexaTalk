import { Router } from "express";
import coreRoutes from "./serverCore.routes";
import memberRoutes from "./serverMember.routes";
import inviteRoutes from "./serverInvite.routes";
import banRoutes from "./serverBan.routes";
import auditLogRoutes from "./serverAuditLog.routes";

const router = Router();

router.use(coreRoutes);
router.use(memberRoutes);
router.use(inviteRoutes);
router.use(banRoutes);
router.use(auditLogRoutes);

export default router;
