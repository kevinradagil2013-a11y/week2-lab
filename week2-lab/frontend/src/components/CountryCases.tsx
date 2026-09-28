import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  catchError,
  delay,
  from,
  of,
} from 'rxjs';

import {
  useState,
} from 'react';

import {
  getSharkAttacksByCountry,
} from '../services/sharkAttackApi';

import type {
  SharkAttack,
} from '../types/sharkAttack';

type CountryCasesProps = {
  country: string | null;
};

export function CountryCases({
  country,
}: CountryCasesProps) {
  const [cases, setCases] =
    useState<SharkAttack[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [searched, setSearched] =
    useState(false);

  const handleSearch = () => {
    if (!country?.trim() || loading) {
      return;
    }

    setCases([]);
    setError(null);
    setSearched(false);
    setLoading(true);

    from(
      getSharkAttacksByCountry(country),
    )
      .pipe(
        delay(1000),

        catchError((requestError) => {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No fue posible consultar los casos relacionados.',
          );

          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          setCases(
            result.data.slice(0, 5),
          );
        }

        setSearched(true);
        setLoading(false);
      });
  };

  if (!country?.trim()) {
    return (
      <Alert
        severity="info"
        sx={{
          borderRadius: 2,
          background: 'rgba(3, 24, 37, 0.72)',
          border: '1px solid rgba(117, 231, 238, 0.12)',
          color: 'rgba(232, 247, 251, 0.82)',
        }}
      >
        El registro no tiene un país asociado
        para realizar la consulta relacionada.
      </Alert>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid rgba(117, 231, 238, 0.12)',
        background:
          'linear-gradient(145deg, rgba(3, 24, 37, 0.82), rgba(2, 12, 20, 0.72))',
        backdropFilter: 'blur(18px)',
        boxShadow:
          '0 20px 55px rgba(0, 0, 0, 0.28)',
      }}
    >
      <BoxGlow />

      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          p: { xs: 2.5, md: 3 },
          '&:last-child': {
            pb: { xs: 2.5, md: 3 },
          },
        }}
      >
        <Stack spacing={2.5}>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Stack spacing={0.8}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                }}
              >
                <PublicIcon
                  sx={{
                    fontSize: 17,
                    color: '#75e7ee',
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    color: 'rgba(117, 231, 238, 0.68)',
                    textTransform: 'uppercase',
                  }}
                >
                  Regional intelligence
                </Typography>
              </Stack>

              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: 19, md: 22 },
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'rgba(232, 247, 251, 0.96)',
                }}
              >
                Casos relacionados
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  maxWidth: 560,
                  color: 'rgba(139, 169, 184, 0.86)',
                  lineHeight: 1.6,
                }}
              >
                Explora registros documentados asociados
                al mismo territorio.
              </Typography>
            </Stack>

            <Stack
              spacing={0.4}
              sx={{
                alignItems: 'flex-end',
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: 'rgba(139, 169, 184, 0.55)',
                  textTransform: 'uppercase',
                }}
              >
                Territory
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(232, 247, 251, 0.82)',
                }}
              >
                {country}
              </Typography>
            </Stack>
          </Stack>

          <Divider
            sx={{
              borderColor: 'rgba(117, 231, 238, 0.09)',
            }}
          />

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1.5}
            sx={{
              alignItems: {
                xs: 'stretch',
                sm: 'center',
              },
            }}
          >
            <Button
              variant="contained"
              startIcon={
                loading
                  ? <CircularProgress
                      size={16}
                      sx={{
                        color: 'inherit',
                      }}
                    />
                  : <SearchIcon />
              }
              endIcon={
                !loading && (
                  <ArrowForwardIcon
                    sx={{
                      fontSize: '16px !important',
                    }}
                  />
                )
              }
              onClick={handleSearch}
              disabled={loading}
              sx={{
                minHeight: 42,
                px: 2,
                borderRadius: 1.5,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background:
                  'linear-gradient(135deg, #0b7185, #07516e)',
                boxShadow:
                  '0 8px 24px rgba(0, 95, 125, 0.28)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #0d8197, #08617f)',
                },
              }}
            >
              {loading
                ? 'Consultando...'
                : `Consultar casos en ${country}`}
            </Button>

            {searched && !loading && !error && (
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'rgba(117, 231, 238, 0.62)',
                  textTransform: 'uppercase',
                }}
              >
                Consulta completada
              </Typography>
            )}
          </Stack>

          {loading && (
            <Stack
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: 'rgba(117, 231, 238, 0.68)',
                  textTransform: 'uppercase',
                }}
              >
                Analizando registros
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(139, 169, 184, 0.72)',
                }}
              >
                Consultando casos documentados en {country}
              </Typography>
            </Stack>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                background: 'rgba(80, 20, 20, 0.32)',
                border: '1px solid rgba(255, 100, 100, 0.14)',
              }}
            >
              {error}
            </Alert>
          )}

          {!loading &&
            !error &&
            searched &&
            cases.length === 0 && (
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  background: 'rgba(3, 24, 37, 0.58)',
                  border: '1px solid rgba(117, 231, 238, 0.10)',
                }}
              >
                No se encontraron casos relacionados
                para {country}.
              </Alert>
            )}

          {!loading &&
            !error &&
            cases.length > 0 && (
              <Stack spacing={1.2}>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.18em',
                      color: 'rgba(139, 169, 184, 0.58)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Related records
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#75e7ee',
                    }}
                  >
                    {cases.length.toString().padStart(2, '0')}
                  </Typography>
                </Stack>

                <List
                  disablePadding
                  sx={{
                    display: 'grid',
                    gap: 1,
                  }}
                >
                  {cases.map(
                    (
                      sharkAttack,
                      index,
                    ) => (
                      <ListItem
                        key={sharkAttack.id}
                        sx={{
                          px: 2,
                          py: 1.6,
                          borderRadius: 1.5,
                          border:
                            '1px solid rgba(117, 231, 238, 0.07)',
                          background:
                            'rgba(255, 255, 255, 0.018)',
                          transition:
                            'all 180ms ease',
                          '&:hover': {
                            background:
                              'rgba(117, 231, 238, 0.055)',
                            borderColor:
                              'rgba(117, 231, 238, 0.16)',
                            transform:
                              'translateX(3px)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={1.5}
                              sx={{
                                alignItems: 'center',
                                mb: 0.7,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color:
                                    'rgba(232, 247, 251, 0.92)',
                                }}
                              >
                                {(index + 1)
                                  .toString()
                                  .padStart(2, '0')}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color:
                                    'rgba(232, 247, 251, 0.94)',
                                }}
                              >
                                {sharkAttack.fecha ??
                                  'Fecha no disponible'}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              component="span"
                              sx={{
                                fontSize: 11,
                                lineHeight: 1.7,
                                color:
                                  'rgba(139, 169, 184, 0.82)',
                              }}
                            >
                              <strong
                                style={{
                                  color:
                                    'rgba(117, 231, 238, 0.66)',
                                }}
                              >
                                Tipo
                              </strong>{' '}
                              {sharkAttack.tipo ?? '—'}
                              {'  ·  '}
                              <strong
                                style={{
                                  color:
                                    'rgba(117, 231, 238, 0.66)',
                                }}
                              >
                                Especie
                              </strong>{' '}
                              {sharkAttack.especie ?? '—'}
                              {'  ·  '}
                              <strong
                                style={{
                                  color:
                                    'rgba(117, 231, 238, 0.66)',
                                }}
                              >
                                Lugar
                              </strong>{' '}
                              {sharkAttack.ubicación ?? '—'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ),
                  )}
                </List>
              </Stack>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function BoxGlow() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: -100,
        right: -80,
        width: 260,
        height: 260,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(22, 199, 216, 0.10), transparent 68%)',
        pointerEvents: 'none',
      }}
    />
  );
}