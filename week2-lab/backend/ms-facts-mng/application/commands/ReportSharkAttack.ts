export type ReportSharkAttackInput = {
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

export type ReportSharkAttackCommand = {
  type: 'ReportSharkAttack';
  input: ReportSharkAttackInput;
};