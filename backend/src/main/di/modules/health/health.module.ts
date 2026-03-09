import { Container } from "inversify";
import { HEALTH_TYPES } from "./health.types";
import { HealthController } from "../../../../presentation/health/controllers/HealthController";

export function loadHealthModule(container : Container) {
    container.bind<HealthController>(HEALTH_TYPES.HealthController).to(HealthController).inSingletonScope()
}