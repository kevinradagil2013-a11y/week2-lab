export type OpenDataSoftRecord = {
  original_order?: number | string;

  date?: string | null;
  year?: number | string | null;
  type?: string | null;
  country?: string | null;
  area?: string | null;
  location?: string | null;
  activity?: string | null;
  name?: string | null;
  sex?: string | null;
  age?: number | string | null;
  injury?: string | null;
  fatal_y_n?: string | null;
  time?: string | null;
  species?: string | null;
  investigator_or_source?: string | null;
  pdf?: string | null;
  href_formula?: string | null;
  href?: string | null;
  case_number?: string | null;
  case_number0?: string | null;
};

type OpenDataSoftResponse = {
  results: OpenDataSoftRecord[];
};

export class OpenDataSoftClient {
  private readonly baseUrl =
    'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets';

  private readonly dataset =
    'global-shark-attack';

  private buildUrl(
    params: string,
  ): string {
    return `${this.baseUrl}/${this.dataset}/records?${params}`;
  }

  async getSharkAttacks(): Promise<
    OpenDataSoftRecord[]
  > {
    const url = this.buildUrl(
      'limit=100',
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        [
          'OpenDataSoft dataset unavailable.',
          `HTTP ${response.status} ${response.statusText}.`,
          `Dataset: ${this.dataset}.`,
          `URL: ${url}.`,
          'The external dataset may have been removed or renamed.',
        ].join(' '),
      );
    }

    const data =
      (await response.json()) as OpenDataSoftResponse;

    if (!Array.isArray(data.results)) {
      throw new Error(
        'OpenDataSoft response does not contain a results array.',
      );
    }

    return data.results;
  }

  async getSharkAttacksByCountry(
    country: string,
  ): Promise<OpenDataSoftRecord[]> {
    const encodedCountry =
      encodeURIComponent(
        country.toUpperCase(),
      );

    const where =
      `country='${encodedCountry}'`;

    const url =
      `${this.baseUrl}/${this.dataset}/records` +
      `?where=${encodeURIComponent(
        where,
      )}&limit=5`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        [
          'OpenDataSoft country query failed.',
          `HTTP ${response.status} ${response.statusText}.`,
          `Country: ${country}.`,
          `Dataset: ${this.dataset}.`,
        ].join(' '),
      );
    }

    const data =
      (await response.json()) as OpenDataSoftResponse;

    if (!Array.isArray(data.results)) {
      throw new Error(
        'OpenDataSoft country response does not contain a results array.',
      );
    }

    return data.results;
  }
}