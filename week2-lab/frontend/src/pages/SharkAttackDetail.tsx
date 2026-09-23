import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
    CountryCases,
} from '../components/CountryCases';

import type {
    SharkAttack,
} from '../types/sharkAttack';

type SharkAttackDetailProps = {
  sharkAttack: SharkAttack;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

type DetailFieldProps = {
  label: string;
  value: string | number | null;
};

function DetailField({
  label,
  value,
}: DetailFieldProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          wordBreak: 'break-word',
        }}
      >
        {value === null ||
        value === ''
          ? '—'
          : value}
      </Typography>
    </Box>
  );
}

export function SharkAttackDetail({
  sharkAttack,
  onBack,
  onEdit,
  onDelete,
}: SharkAttackDetailProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Button
          variant="text"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={onBack}
        >
          VOLVER A REGISTROS
        </Button>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: 'stretch',
                  sm: 'center',
                },
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Detalle del Shark Attack
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Registro #{sharkAttack.id}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    <EditIcon />
                  }
                  onClick={onEdit}
                >
                  EDITAR
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={
                    <DeleteOutlineIcon />
                  }
                  onClick={onDelete}
                >
                  ELIMINAR
                </Button>
              </Stack>
            </Stack>

            <Divider />

            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Fecha"
                  value={
                    sharkAttack.fecha
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Año"
                  value={
                    sharkAttack.año
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Tipo"
                  value={
                    sharkAttack.tipo
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="País"
                  value={
                    sharkAttack.país
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Área"
                  value={
                    sharkAttack.área
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Ubicación"
                  value={
                    sharkAttack.ubicación
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <DetailField
                  label="Actividad"
                  value={
                    sharkAttack.actividad
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <DetailField
                  label="Nombre"
                  value={
                    sharkAttack.nombre
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 3,
                }}
              >
                <DetailField
                  label="Sexo"
                  value={
                    sharkAttack.sexo
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 3,
                }}
              >
                <DetailField
                  label="Edad"
                  value={
                    sharkAttack.edad
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <DetailField
                  label="Fatal (S/N)"
                  value={
                    sharkAttack.fatal_s_n
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                }}
              >
                <DetailField
                  label="Lesión"
                  value={
                    sharkAttack.lesión
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Hora"
                  value={
                    sharkAttack.hora
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                <DetailField
                  label="Especie"
                  value={
                    sharkAttack.especie
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                }}
              >
                <DetailField
                  label="Investigador o fuente"
                  value={
                    sharkAttack.investigador_o_fuente
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="PDF"
                  value={
                    sharkAttack.pdf
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Fórmula enlace"
                  value={
                    sharkAttack.formula_enlace
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <DetailField
                  label="Enlace"
                  value={
                    sharkAttack.enlace
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <DetailField
                  label="Número de caso"
                  value={
                    sharkAttack.número_de_caso
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <DetailField
                  label="Número de caso 0"
                  value={
                    sharkAttack.número_de_caso_0
                  }
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <CountryCases
        country={
          sharkAttack.país
        }
      />
    </Stack>
  );
}