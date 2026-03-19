import { Container } from "inversify";
import { INTERESTS_TYPES } from "./interests.types";

import { InterestRepository } from "../../../../infrastructure/interests/repositories/InterestRepository";
import { UserInterestRepository } from "../../../../infrastructure/interests/repositories/UserInterestRepository";
import { ServerInterestRepository } from "../../../../infrastructure/interests/repositories/ServerInterestRepository";

import { AddUserInterests } from "../../../../application/interests/usecases/AddUserInterests";
import { GetUserInterests } from "../../../../application/interests/usecases/GetUserInterests";
import { RemoveUserInterests } from "../../../../application/interests/usecases/RemoveUserInterests";
import { SearchInterests } from "../../../../application/interests/usecases/SearchInterests";
import { GetPopularInterests } from "../../../../application/interests/usecases/GetPopularInterests";
import { InterestController } from "../../../../presentation/interests/controllers/InterestController";

export function loadInterestsModule(container: Container) {
  // Repositories
  container.bind(INTERESTS_TYPES.InterestRepository).to(InterestRepository).inSingletonScope();
  container
    .bind(INTERESTS_TYPES.UserInterestRepository)
    .to(UserInterestRepository)
    .inSingletonScope();
  container
    .bind(INTERESTS_TYPES.ServerInterestRepository)
    .to(ServerInterestRepository)
    .inSingletonScope();

  // Use Cases
  container.bind(INTERESTS_TYPES.AddUserInterests).to(AddUserInterests);
  container.bind(INTERESTS_TYPES.GetUserInterests).to(GetUserInterests);
  container.bind(INTERESTS_TYPES.RemoveUserInterests).to(RemoveUserInterests);
  container.bind(INTERESTS_TYPES.SearchInterests).to(SearchInterests);
  container.bind(INTERESTS_TYPES.GetPopularInterests).to(GetPopularInterests);

  //controller
  container.bind(INTERESTS_TYPES.InterestController).to(InterestController);
}
