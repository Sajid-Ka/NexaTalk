import { Container } from "inversify";
import { loadAuthModule } from "./modules/auth/auth.module";

const container = new Container();

loadAuthModule(container);

export { container };