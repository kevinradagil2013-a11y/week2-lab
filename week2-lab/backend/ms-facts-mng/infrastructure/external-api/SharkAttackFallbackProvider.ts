import type {
    OpenDataSoftRecord,
} from './OpenDataSoftClient';

const FALLBACK_URL =
  'https://gist.githubusercontent.com/javierIA/f404c5b368e878da515028074882998d/raw/attacks.csv';

function parseCsvLine(
  line: string,
): string[] {
  const values: string[] = [];

  let current = '';
  let insideQuotes = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character = line[index];

    if (character === '"') {
      if (
        insideQuotes &&
        line[index + 1] === '"'
      ) {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (
      character === ',' &&
      !insideQuotes
    ) {
      values.push(current);
      current = '';

      continue;
    }

    current += character;
  }

  values.push(current);

  return values;
}

function normalize(
  value: string | undefined,
): string | null {
  const normalized =
    value?.trim() ?? '';

  return normalized.length > 0
    ? normalized
    : null;
}

function toNumber(
  value: string | undefined,
): number | null {
  const normalized = normalize(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

export class SharkAttackFallbackProvider {
  private async loadRecords(): Promise<
    OpenDataSoftRecord[]
  > {
    const response =
      await fetch(FALLBACK_URL);

    if (!response.ok) {
      throw new Error(
        `Fallback dataset failed: ${response.status} ${response.statusText}`,
      );
    }

    const csv =
      await response.text();

    const lines =
      csv.split(/\r?\n/);

    if (lines.length < 2) {
      throw new Error(
        'Fallback dataset is empty.',
      );
    }

    const records: OpenDataSoftRecord[] = [];

    for (
      const line of lines.slice(1)
    ) {
      if (!line.trim()) {
        continue;
      }

      const row =
        parseCsvLine(line);

      const originalOrder =
        toNumber(row[21]);

      if (
        originalOrder === null ||
        originalOrder <= 0
      ) {
        continue;
      }

      records.push({
        original_order:
          originalOrder,

        date:
          normalize(row[1]),

        year:
          toNumber(row[2]),

        type:
          normalize(row[3]),

        country:
          normalize(row[4]),

        area:
          normalize(row[5]),

        location:
          normalize(row[6]),

        activity:
          normalize(row[7]),

        name:
          normalize(row[8]),

        sex:
          normalize(row[9]),

        age:
          toNumber(row[10]),

        injury:
          normalize(row[11]),

        fatal_y_n:
          normalize(row[12]),

        time:
          normalize(row[13]),

        species:
          normalize(row[14]),

        investigator_or_source:
          normalize(row[15]),

        pdf:
          normalize(row[16]),

        href_formula:
          normalize(row[17]),

        href:
          normalize(row[18]),

        case_number:
          normalize(row[19]),

        case_number0:
          normalize(row[20]),
      });
    }

    return records;
  }

  async getSharkAttacks(
    limit = 100,
  ): Promise<OpenDataSoftRecord[]> {
    const records =
      await this.loadRecords();

    const limitedRecords =
      records.slice(0, limit);

    if (
      limitedRecords.length < limit
    ) {
      throw new Error(
        `Fallback dataset returned ${limitedRecords.length} valid records; expected ${limit}.`,
      );
    }

    return limitedRecords;
  }

  async getSharkAttacksByCountry(
    country: string,
    limit = 5,
  ): Promise<OpenDataSoftRecord[]> {
    const normalizedCountry =
      country.trim().toUpperCase();

    if (!normalizedCountry) {
      throw new Error(
        'Country cannot be empty.',
      );
    }

    const records =
      await this.loadRecords();

    return records
      .filter(
        (record) =>
          record.country
            ?.trim()
            .toUpperCase() ===
          normalizedCountry,
      )
      .slice(0, limit);
  }
}