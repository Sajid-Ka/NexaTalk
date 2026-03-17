import { Container } from "inversify";
import { loadAuthModule } from "./modules/auth/auth.module";
import { loadCommonModule } from "./modules/common/common.module";
import { loadHealthModule } from "./modules/health/health.module";
import { loadAdminModule } from "./modules/admin/admin.module";

const container = new Container();

loadCommonModule(container);
loadAuthModule(container);
loadAdminModule(container);
loadHealthModule(container);

export { container };
