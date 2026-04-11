import { ServerPrivacy, ServerValidation } from "../../../../shared/constants/server.const";
import { ServerNameTooShortError } from "../errors/ServerNameTooShortError";
import { ServerNameTooLongError } from "../errors/ServerNameTooLongError";
import { ServerDescriptionTooLongError } from "../errors/ServerDescriptionTooLongError";
import { ServerTagsLimitExceededError } from "../errors/ServerTagsLimitExceededError";

export interface ServerProps {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  privacy: ServerPrivacy;
  isDisabled?: boolean;
  memberCount?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Server {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly icon?: string;
  public readonly banner?: string;
  public readonly ownerId: string;
  public readonly privacy: ServerPrivacy;
  public readonly isDisabled: boolean;
  public readonly memberCount: number;
  public readonly tags: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  constructor(props: ServerProps) {
    if (!props.name || props.name.trim().length < ServerValidation.MIN_NAME_LENGTH) {
      throw new ServerNameTooShortError();
    }
    if (props.name.trim().length > ServerValidation.MAX_NAME_LENGTH) {
      throw new ServerNameTooLongError();
    }
    if (props.description && props.description.length > ServerValidation.MAX_DESCRIPTION_LENGTH) {
      throw new ServerDescriptionTooLongError();
    }
    if (props.tags && props.tags.length > ServerValidation.MAX_TAGS) {
      throw new ServerTagsLimitExceededError();
    }
    if (!props.ownerId) {
      throw new Error("Owner ID is required");
    }

    this.id = props.id!;
    this.name = props.name.trim();
    this.description = props.description;
    this.icon = props.icon;
    this.banner = props.banner;
    this.ownerId = props.ownerId;
    this.privacy = props.privacy;
    this.isDisabled = props.isDisabled ?? false;
    this.memberCount = props.memberCount ?? 1;
    this.tags = props.tags ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  public isPublic(): boolean {
    return this.privacy === ServerPrivacy.PUBLIC;
  }

  public isPrivate(): boolean {
    return this.privacy === ServerPrivacy.PRIVATE;
  }

  public isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }
}
