export type SharkAttack = {
  id: number;
  fecha: string | null;
  año: number | null;
  tipo: string | null;
  país: string | null;
  área: string | null;
  ubicación: string | null;
  actividad: string | null;
  nombre: string | null;
  sexo: string | null;
  edad: number | null;
  lesión: string | null;
  fatal_s_n: string | null;
  hora: string | null;
  especie: string | null;
  investigador_o_fuente: string | null;
  pdf: string | null;
  formula_enlace: string | null;
  enlace: string | null;
  número_de_caso: string | null;
  número_de_caso_0: string | null;
};

export type SharkAttackFormValues = Omit<
  SharkAttack,
  'id'
>;

export type ImportResult = {
  message: string;
  imported: number;
  events: number;
  source: 'opendatasoft' | 'fallback';
};

export type CountryCasesResult = {
  country: string;
  count: number;
  source: 'opendatasoft' | 'fallback';
  data: SharkAttack[];
};

export type SharkAttackEvent = {
  eventId: string;
  aggregateId: number;
  aggregateType: 'SharkAttack';
  eventType: 'Reported';
  occurredAt: string;
  payload: {
    país: string | null;
    fecha: string | null;
    tipo: string | null;
  };
};