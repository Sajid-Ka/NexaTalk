import { Router } from "express";
import { container } from "../di/container";
import { USER_TYPES } from "../di/modules/user/user.types";
import { ProfileController } from "../../presentation/user/controllers/ProfileController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { updateProfileSchema } from "../../presentation/user/validators/updateProfileValidator";
import { upload } from "../../infrastructure/core/storage/multer.config";

const router = Router();

const controller = container.get<ProfileController>(USER_TYPES.ProfileController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

//profile routes
router.get("/me", controller.getMyProfile);
router.patch("/me", validate(updateProfileSchema), controller.updateProfile);
router.get("/:userId", controller.getProfileById);

// avatar routes
router.post("/me/avatar", upload.single("avatar"), controller.uploadAvatar);
router.delete("/me/avatar", controller.deleteAvatar);

export default router;
