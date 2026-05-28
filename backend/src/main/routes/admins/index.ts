import { Router } from "express";
import userManangementRoutes from "./adminUserManagement.routes";
import serverManagementRoutes from "./adminServerManagement.routes";

const router = Router();

router.use(userManangementRoutes);
router.use(serverManagementRoutes);

export default router;
