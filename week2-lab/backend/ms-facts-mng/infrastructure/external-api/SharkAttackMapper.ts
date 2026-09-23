import type {
  SharkAttackProps,
} from '../../domain/entities/SharkAttack';

import type {
  OpenDataSoftRecord,
} from './OpenDataSoftClient';

function toNumber(
  value: number | string | null | undefined,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function toStringOrNull(
  value: string | number | null | undefined,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return String(value);
}

export function mapSharkAttack(
  record: OpenDataSoftRecord,
): SharkAttackProps {
  const id = toNumber(
    record.original_order,
  );

  if (id === null || id <= 0) {
    throw new Error(
      'OpenDataSoft record has an invalid original_order',
    );
  }

  return {
    id,

    fecha: toStringOrNull(record.date),

    a\u00f1o: toNumber(record.year),

    tipo: toStringOrNull(record.type),

    pa\u00eds: toStringOrNull(record.country),

    \u00e1rea: toStringOrNull(record.area),

    ubicaci\u00f3n: toStringOrNull(
      record.location,
    ),

    actividad: toStringOrNull(
      record.activity,
    ),

    nombre: toStringOrNull(record.name),

    sexo: toStringOrNull(record.sex),

    edad: toNumber(record.age),

    lesi\u00f3n: toStringOrNull(
      record.injury,
    ),

    fatal_s_n: toStringOrNull(
      record.fatal_y_n,
    ),

    hora: toStringOrNull(record.time),

    especie: toStringOrNull(
      record.species,
    ),

    investigador_o_fuente:
      toStringOrNull(
        record.investigator_or_source,
      ),

    pdf: toStringOrNull(record.pdf),

    formula_enlace: toStringOrNull(
      record.href_formula,
    ),

    enlace: toStringOrNull(record.href),

    n\u00famero_de_caso: toStringOrNull(
      record.case_number,
    ),

    n\u00famero_de_caso_0: toStringOrNull(
      record.case_number0,
    ),
  };
}
