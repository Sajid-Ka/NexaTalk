import { Router } from "express";
import channelRoutes from "./Channel.routes";

const router = Router();

router.use(channelRoutes);

export default router;
