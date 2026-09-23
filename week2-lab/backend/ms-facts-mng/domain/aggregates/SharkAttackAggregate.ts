import {
    SharkAttack,
    type SharkAttackProps,
} from '../entities/SharkAttack';

import { Country } from '../value-objects/Country';

export class SharkAttackAggregate {
  private readonly sharkAttack: SharkAttack;
  private country: Country | null;

  constructor(props: SharkAttackProps) {
    this.sharkAttack = new SharkAttack(props);

    this.country = props.país
      ? new Country(props.país)
      : null;
  }

  get id(): number {
    return this.sharkAttack.id;
  }

  get entity(): SharkAttack {
    return this.sharkAttack;
  }

  get countryValue(): string | null {
    return this.country?.getValue() ?? null;
  }

  update(
    data: Partial<Omit<SharkAttackProps, 'id'>>,
  ): void {
    if (data.país !== undefined) {
      this.country = data.país
        ? new Country(data.país)
        : null;
    }

    this.sharkAttack.update(data);
  }

  toPrimitives(): SharkAttackProps {
    return this.sharkAttack.toPrimitives();
  }
}