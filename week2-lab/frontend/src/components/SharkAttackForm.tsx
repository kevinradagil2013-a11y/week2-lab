import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import {
    Field,
    Form,
    Formik,
} from 'formik';

import * as Yup from 'yup';

import type {
    SharkAttack,
    SharkAttackFormValues,
} from '../types/sharkAttack';

type SharkAttackFormProps = {
  sharkAttack?: SharkAttack | null;
  onSaved: () => void;
  onCancel: () => void;
  onCreate: (
    data: SharkAttackFormValues & {
      id: number;
    },
  ) => Promise<void>;
  onUpdate: (
    id: number,
    data: SharkAttackFormValues,
  ) => Promise<void>;
};

const validationSchema = Yup.object({
  id: Yup.number()
    .integer('Debe ser un número entero')
    .positive('Debe ser mayor que cero')
    .required('El ID es obligatorio'),

  fecha: Yup.string().nullable(),

  año: Yup.number()
    .nullable()
    .typeError('Debe ser un número'),

  tipo: Yup.string().nullable(),

  país: Yup.string().nullable(),

  área: Yup.string().nullable(),

  ubicación: Yup.string().nullable(),

  actividad: Yup.string().nullable(),

  nombre: Yup.string().nullable(),

  sexo: Yup.string().nullable(),

  edad: Yup.number()
    .nullable()
    .typeError('Debe ser un número')
    .min(0, 'La edad no puede ser negativa'),

  lesión: Yup.string().nullable(),

  fatal_s_n: Yup.string().nullable(),

  hora: Yup.string().nullable(),

  especie: Yup.string().nullable(),

  investigador_o_fuente:
    Yup.string().nullable(),

  pdf: Yup.string().nullable(),

  formula_enlace:
    Yup.string().nullable(),

  enlace: Yup.string().nullable(),

  número_de_caso:
    Yup.string().nullable(),

  número_de_caso_0:
    Yup.string().nullable(),
});

function createInitialValues(
  sharkAttack?: SharkAttack | null,
): SharkAttackFormValues & {
  id: number;
} {
  return {
    id: sharkAttack?.id ?? 1,
    fecha: sharkAttack?.fecha ?? '',
    año: sharkAttack?.año ?? null,
    tipo: sharkAttack?.tipo ?? '',
    país: sharkAttack?.país ?? '',
    área: sharkAttack?.área ?? '',
    ubicación: sharkAttack?.ubicación ?? '',
    actividad: sharkAttack?.actividad ?? '',
    nombre: sharkAttack?.nombre ?? '',
    sexo: sharkAttack?.sexo ?? '',
    edad: sharkAttack?.edad ?? null,
    lesión: sharkAttack?.lesión ?? '',
    fatal_s_n: sharkAttack?.fatal_s_n ?? '',
    hora: sharkAttack?.hora ?? '',
    especie: sharkAttack?.especie ?? '',
    investigador_o_fuente:
      sharkAttack?.investigador_o_fuente ?? '',
    pdf: sharkAttack?.pdf ?? '',
    formula_enlace:
      sharkAttack?.formula_enlace ?? '',
    enlace: sharkAttack?.enlace ?? '',
    número_de_caso:
      sharkAttack?.número_de_caso ?? '',
    número_de_caso_0:
      sharkAttack?.número_de_caso_0 ?? '',
  };
}

type TextFieldName =
  | 'fecha'
  | 'tipo'
  | 'país'
  | 'área'
  | 'ubicación'
  | 'actividad'
  | 'nombre'
  | 'sexo'
  | 'lesión'
  | 'fatal_s_n'
  | 'hora'
  | 'especie'
  | 'investigador_o_fuente'
  | 'pdf'
  | 'formula_enlace'
  | 'enlace'
  | 'número_de_caso'
  | 'número_de_caso_0';

type NumberFieldName =
  | 'id'
  | 'año'
  | 'edad';

function TextFormField({
  name,
  label,
}: {
  name: TextFieldName;
  label: string;
}) {
  return (
    <Field name={name}>
      {({
        field,
        meta,
      }: {
        field: {
          name: string;
          value: string | null;
          onChange: (
            event: React.ChangeEvent<HTMLInputElement>,
          ) => void;
          onBlur: () => void;
        };
        meta: {
          touched: boolean;
          error?: string;
        };
      }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          value={field.value ?? ''}
          error={
            meta.touched &&
            Boolean(meta.error)
          }
          helperText={
            meta.touched
              ? meta.error
              : undefined
          }
        />
      )}
    </Field>
  );
}

function NumberFormField({
  name,
  label,
  disabled = false,
}: {
  name: NumberFieldName;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Field name={name}>
      {({
        field,
        form,
        meta,
      }: {
        field: {
          name: string;
          value: number | null;
          onBlur: () => void;
        };
        form: {
          setFieldValue: (
            field: string,
            value: number | null,
            shouldValidate?: boolean,
          ) => void;
        };
        meta: {
          touched: boolean;
          error?: string;
        };
      }) => (
        <TextField
          fullWidth
          type="text"
          inputMode="numeric"
          label={label}
          disabled={disabled}
          name={field.name}
          value={field.value ?? ''}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement>,
          ) => {
            const rawValue =
              event.target.value;

            if (rawValue === '') {
              form.setFieldValue(
                name,
                null,
                false,
              );
              return;
            }

            if (!/^\d+$/.test(rawValue)) {
              return;
            }

            form.setFieldValue(
              name,
              Number(rawValue),
              false,
            );
          }}
          onBlur={field.onBlur}
          error={
            meta.touched &&
            Boolean(meta.error)
          }
          helperText={
            meta.touched
              ? meta.error
              : undefined
          }
        />
      )}
    </Field>
  );
}

export function SharkAttackForm({
  sharkAttack,
  onSaved,
  onCancel,
  onCreate,
  onUpdate,
}: SharkAttackFormProps) {
  const isEditing =
    Boolean(sharkAttack);

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
            }}
          >
            {isEditing
              ? 'Editar Shark Attack'
              : 'Nuevo Shark Attack'}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {isEditing
              ? 'Actualiza la información del registro.'
              : 'Registra un nuevo caso de ataque de tiburón.'}
          </Typography>
        </Box>

        <Formik
          initialValues={createInitialValues(
            sharkAttack,
          )}
          validationSchema={
            validationSchema
          }
          enableReinitialize
          onSubmit={async (
            values,
            {
              setSubmitting,
              setStatus,
            },
          ) => {
            try {
              const normalizedValues = {
                ...values,
                id: Number(values.id),
                año:
                  values.año === null ||
                  values.año === undefined
                    ? null
                    : Number(values.año),
                edad:
                  values.edad === null ||
                  values.edad === undefined
                    ? null
                    : Number(values.edad),
              };

              if (isEditing) {
                await onUpdate(
                  sharkAttack!.id,
                  normalizedValues,
                );
              } else {
                await onCreate(
                  normalizedValues,
                );
              }

              onSaved();
            } catch (error) {
              setStatus(
                error instanceof Error
                  ? error.message
                  : 'No fue posible guardar el registro.',
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            isSubmitting,
            status,
          }) => (
            <Form>
              <Stack spacing={3}>
                {status && (
                  <Alert severity="error">
                    {status}
                  </Alert>
                )}

                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <NumberFormField
                      name="id"
                      label="ID / Orden original"
                      disabled={isEditing}
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="fecha"
                      label="Fecha"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <NumberFormField
                      name="año"
                      label="Año"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="tipo"
                      label="Tipo"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="país"
                      label="País"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="área"
                      label="Área"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="ubicación"
                      label="Ubicación"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="actividad"
                      label="Actividad"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="nombre"
                      label="Nombre"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextFormField
                      name="sexo"
                      label="Sexo"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <NumberFormField
                      name="edad"
                      label="Edad"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="lesión"
                      label="Lesión"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextFormField
                      name="fatal_s_n"
                      label="Fatal (S/N)"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 3,
                    }}
                  >
                    <TextFormField
                      name="hora"
                      label="Hora"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="especie"
                      label="Especie"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                    }}
                  >
                    <TextFormField
                      name="investigador_o_fuente"
                      label="Investigador o fuente"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="pdf"
                      label="PDF"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="formula_enlace"
                      label="Fórmula enlace"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 4,
                    }}
                  >
                    <TextFormField
                      name="enlace"
                      label="Enlace"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="número_de_caso"
                      label="Número de caso"
                    />
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextFormField
                      name="número_de_caso_0"
                      label="Número de caso 0"
                    />
                  </Grid>
                </Grid>

                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  spacing={2}
                  sx={{
                    justifyContent:
                      'flex-end',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    CANCELAR
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'GUARDANDO...'
                      : isEditing
                        ? 'GUARDAR CAMBIOS'
                        : 'CREAR REGISTRO'}
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Paper>
  );
}