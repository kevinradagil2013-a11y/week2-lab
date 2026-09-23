export class Country {
  private readonly value: string;

  constructor(value: string) {
    const normalizedValue = value.trim().toUpperCase();

    if (!normalizedValue) {
      throw new Error('Country cannot be empty');
    }

    this.value = normalizedValue;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Country): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}