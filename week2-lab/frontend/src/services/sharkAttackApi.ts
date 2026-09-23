import type {
  CountryCasesResult,
  ImportResult,
  SharkAttack,
  SharkAttackEvent,
  SharkAttackFormValues,
} from '../types/sharkAttack';

const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3106';

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    },
  );

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      const body =
        await response.json();

      if (
        body &&
        typeof body.message === 'string'
      ) {
        message = body.message;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  return response.json();
}

type SharkAttacksResponse = {
  count: number;
  data: SharkAttack[];
};

export async function getSharkAttacks():
  Promise<SharkAttack[]> {
  const response =
    await request<SharkAttacksResponse>(
      '/shark-attacks',
    );

  return response.data;
}

export async function getSharkAttackById(
  id: number,
): Promise<SharkAttack> {
  return request<SharkAttack>(
    `/shark-attacks/${id}`,
  );
}

export async function createSharkAttack(
  data: SharkAttackFormValues & {
    id: number;
  },
): Promise<SharkAttack> {
  return request<SharkAttack>(
    '/shark-attacks',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function updateSharkAttack(
  id: number,
  data: SharkAttackFormValues,
): Promise<SharkAttack> {
  return request<SharkAttack>(
    `/shark-attacks/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteSharkAttack(
  id: number,
): Promise<void> {
  await request<unknown>(
    `/shark-attacks/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function importSharkAttacks():
  Promise<ImportResult> {
  return request<ImportResult>(
    '/shark-attacks/import',
    {
      method: 'POST',
    },
  );
}

export async function getSharkAttacksByCountry(
  country: string,
): Promise<CountryCasesResult> {
  return request<CountryCasesResult>(
    `/shark-attacks/country/${encodeURIComponent(country)}`,
  );
}

export async function getEvents():
  Promise<SharkAttackEvent[]> {
  return request<SharkAttackEvent[]>(
    '/events',
  );
}

export async function getEventsByAggregateId(
  aggregateId: number,
): Promise<SharkAttackEvent[]> {
  return request<SharkAttackEvent[]>(
    `/events/${aggregateId}`,
  );
}