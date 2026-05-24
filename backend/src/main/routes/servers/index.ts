import { Router } from "express";

import coreRoutes from "./serverCore.routes";
import memberRoutes from "./serverMember.routes";
import inviteRoutes from "./serverInvite.routes";

const router = Router();

router.use(coreRoutes);
router.use(memberRoutes);
router.use(inviteRoutes);

export default router;
