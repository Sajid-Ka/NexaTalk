import { BadRequestError } from "../../errors/BadRequestError";
import { InterestCategory } from "../../../shared/constants/interests.const";

export interface InterestProps {
  id?: string;
  name: string;
  category?: InterestCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Interest {
  public readonly id: string;
  public readonly name: string;
  public readonly category: InterestCategory;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: InterestProps) {
    if (!props.name || props.name.trim().length < 2) {
      throw new BadRequestError("Interest name must be at least 2 characters");
    }
    if (props.name.trim().length > 50) {
      throw new BadRequestError("Interest name must be at most 50 characters");
    }

    this.id = props.id!;
    this.name = props.name.trim().toLowerCase();
    this.category = props.category || "other";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isSameAs(other: Interest): boolean {
    return this.name === other.name;
  }
}
