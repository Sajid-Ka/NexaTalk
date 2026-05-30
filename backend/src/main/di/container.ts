import { Container } from "inversify";
import { loadAuthModule } from "./modules/auth/auth.module";
import { loadCommonModule } from "./modules/common/common.module";
import { loadHealthModule } from "./modules/health/health.module";
import { loadAdminModule } from "./modules/admin/admin.module";
import { loadInterestsModule } from "./modules/interests/interests.module";
import { loadRecommendationsModule } from "./modules/recommendations/recommendations.module";
import { loadOnboardingModule } from "./modules/onboarding/onboarding.module";
import { loadUserModule } from "./modules/user/user.module";
import { loadFriendsModule } from "./modules/friends/friends.module";
import { loadServersModule } from "./modules/servers/servers.module";
import { loadChannelsModule } from "./modules/channels/channels.module";

const container = new Container();

loadCommonModule(container);
loadAuthModule(container);
loadAdminModule(container);
loadHealthModule(container);
loadInterestsModule(container);
loadRecommendationsModule(container);
loadOnboardingModule(container);
loadUserModule(container);
loadFriendsModule(container);
loadServersModule(container);
loadChannelsModule(container);

export { container };
