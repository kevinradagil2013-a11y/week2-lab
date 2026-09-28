import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import {
  useMemo,
  useState,
} from 'react';

import {
  useSharkAttacks,
} from '../hooks/useSharkAttacks';

import {
  SharkAttackTable,
} from '../components/SharkAttackTable';

import {
  ImportButton,
} from '../components/ImportButton';

import {
  SharkAttackForm,
} from '../components/SharkAttackForm';

import {
  SharkAttackDetail,
} from './SharkAttackDetail';

import {
  createSharkAttack,
  deleteSharkAttack,
  getSharkAttackById,
  updateSharkAttack,
} from '../services/sharkAttackApi';

import type {
  SharkAttack,
  SharkAttackFormValues,
} from '../types/sharkAttack';

export function Week2Dashboard() {
  const {
    sharkAttacks,
    loading,
    error,
    reload,
  } = useSharkAttacks();

  const [showForm, setShowForm] =
    useState(false);

  const [selectedSharkAttack, setSelectedSharkAttack] =
    useState<SharkAttack | null>(null);

  const [showDetail, setShowDetail] =
    useState(false);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailError, setDetailError] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const filteredSharkAttacks = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return sharkAttacks;
    }

    return sharkAttacks.filter(
      (sharkAttack) => {
        const searchableFields = [
          sharkAttack.fecha,
          sharkAttack.país,
          sharkAttack.tipo,
          sharkAttack.especie,
          sharkAttack.ubicación,
        ];

        return searchableFields.some(
          (value) =>
            String(value ?? '')
              .toLocaleLowerCase()
              .includes(normalizedQuery),
        );
      },
    );
  }, [
    sharkAttacks,
    searchQuery,
  ]);

  const handleNew = () => {
    setSelectedSharkAttack(null);
    setDetailError(null);
    setShowDetail(false);
    setShowForm(true);
  };

  const handleSelect = async (
    id: number,
  ) => {
    setDetailLoading(true);
    setDetailError(null);

    try {
      const sharkAttack =
        await getSharkAttackById(id);

      setSelectedSharkAttack(
        sharkAttack,
      );

      setShowForm(false);
      setShowDetail(true);
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar el registro.',
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async (
    data: SharkAttackFormValues & {
      id: number;
    },
  ) => {
    await createSharkAttack(data);
  };

  const handleUpdate = async (
    id: number,
    data: SharkAttackFormValues,
  ) => {
    await updateSharkAttack(
      id,
      data,
    );
  };

  const handleEdit = (
    sharkAttack: SharkAttack,
  ) => {
    setSelectedSharkAttack(
      sharkAttack,
    );
    setDetailError(null);
    setShowDetail(false);
    setShowForm(true);
  };

  const handleEditFromDetail = () => {
    if (!selectedSharkAttack) {
      return;
    }

    setShowDetail(false);
    setShowForm(true);
  };

  const handleDelete = async (
    id: number,
  ) => {
    const confirmed =
      window.confirm(
        `¿Deseas eliminar el registro #${id}? Esta acción no se puede deshacer.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSharkAttack(id);

      setSelectedSharkAttack(null);
      setShowDetail(false);
      setShowForm(false);
      setDetailError(null);

      await reload();
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible eliminar el registro.',
      );
    }
  };

  const handleDeleteFromDetail =
    async () => {
      if (!selectedSharkAttack) {
        return;
      }

      await handleDelete(
        selectedSharkAttack.id,
      );
    };

  const handleSaved = async () => {
    setShowForm(false);
    setShowDetail(false);
    setSelectedSharkAttack(null);
    setDetailError(null);

    await reload();
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowDetail(false);
    setSelectedSharkAttack(null);
    setDetailError(null);
  };

  if (
    showDetail &&
    selectedSharkAttack
  ) {
    return (
      <SharkAttackDetail
        sharkAttack={
          selectedSharkAttack
        }
        onBack={handleCancel}
        onEdit={
          handleEditFromDetail
        }
        onDelete={
          handleDeleteFromDetail
        }
      />
    );
  }

  if (showForm) {
    return (
      <Stack spacing={3}>
        <SharkAttackForm
          sharkAttack={
            selectedSharkAttack
          }
          onSaved={
            handleSaved
          }
          onCancel={
            handleCancel
          }
          onCreate={
            handleCreate
          }
          onUpdate={
            handleUpdate
          }
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>

      <Box>
        <Typography
          sx={{
            mb: 0.8,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.28em',
            color:
              'rgba(117, 231, 238, 0.68)',
            textTransform: 'uppercase',
          }}
        >
          Shark Attack Intelligence
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.045em',
            color:
              'rgba(232, 247, 251, 0.96)',
          }}
        >
          Registro de ataques de tiburones
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 1,
            maxWidth: 820,
            color:
              'rgba(139, 169, 184, 0.82)',
            lineHeight: 1.65,
          }}
        >
          Explora, consulta y administra registros
          históricos de ataques documentados mediante
          una plataforma de inteligencia oceanográfica.
        </Typography>
      </Box>

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
          <InfoCard
            label="Architecture"
            title="DDD"
            description="Entity · Value Object · Aggregate"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <InfoCard
            label="Data layer"
            title="MongoDB"
            description="CRUD · Persistence · Event Store"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <InfoCard
            label="Reactive engine"
            title="RxJS"
            description="Observable · Subscription · Operators"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border:
            '1px solid rgba(117, 231, 238, 0.11)',
          background:
            'linear-gradient(145deg, rgba(3, 24, 37, 0.82), rgba(2, 11, 18, 0.76))',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow:
            '0 22px 65px rgba(0, 0, 0, 0.28)',
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            '&:last-child': {
              pb: {
                xs: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Stack spacing={2.5}>

            <Stack
              direction={{
                xs: 'column',
                md: 'row',
              }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: 'stretch',
                  md: 'center',
                },
                justifyContent:
                  'space-between',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    color:
                      'rgba(117, 231, 238, 0.66)',
                    textTransform: 'uppercase',
                  }}
                >
                  Intelligence registry
                </Typography>

                <Typography
                  sx={{
                    mt: 0.6,
                    fontSize: {
                      xs: 20,
                      md: 24,
                    },
                    fontWeight: 700,
                    letterSpacing: '-0.035em',
                    color:
                      'rgba(232, 247, 251, 0.95)',
                  }}
                >
                  Buscar registros
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 12,
                    color:
                      'rgba(139, 169, 184, 0.72)',
                  }}
                >
                  Busca por paí, especie,
                  ubicación, tipo o fecha.
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                }}
              >
                <Chip
                  label={`${sharkAttacks.length} registros`}
                  sx={{
                    height: 30,
                    borderRadius: 1.5,
                    border:
                      '1px solid rgba(117, 231, 238, 0.12)',
                    background:
                      'rgba(117, 231, 238, 0.045)',
                    color:
                      'rgba(117, 231, 238, 0.76)',
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                />

                {searchQuery && (
                  <Chip
                    label={`${filteredSharkAttacks.length} encontrados`}
                    sx={{
                      height: 30,
                      borderRadius: 1.5,
                      background:
                        'rgba(117, 231, 238, 0.10)',
                      color: '#75e7ee',
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  />
                )}
              </Stack>
            </Stack>

            <Box
              sx={{
                position: 'relative',
              }}
            >
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Buscar por paí, especie, ubicación, tipo o fecha..."
                aria-label="Buscar registros de ataques de tiburones"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            color:
                              'rgba(117, 231, 238, 0.68)',
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchQuery ? (
                        <InputAdornment position="end">
                          <Button
                            onClick={() =>
                              setSearchQuery('')
                            }
                            startIcon={
                              <ClearIcon
                                sx={{
                                  fontSize:
                                    '16px !important',
                                }}
                              />
                            }
                            sx={{
                              minWidth: 0,
                              color:
                                'rgba(139, 169, 184, 0.70)',
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing:
                                '0.08em',
                            }}
                          >
                            Limpiar
                          </Button>
                        </InputAdornment>
                      ) : undefined,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: 58,
                    borderRadius: 2,
                    background:
                      'rgba(1, 10, 17, 0.56)',
                    color:
                      'rgba(232, 247, 251, 0.94)',
                    transition:
                      'all 180ms ease',
                    '& fieldset': {
                      borderColor:
                        'rgba(117, 231, 238, 0.13)',
                    },
                    '&:hover fieldset': {
                      borderColor:
                        'rgba(117, 231, 238, 0.25)',
                    },
                    '&.Mui-focused': {
                      background:
                        'rgba(2, 16, 25, 0.78)',
                      boxShadow:
                        '0 0 0 3px rgba(22, 199, 216, 0.07)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor:
                        'rgba(117, 231, 238, 0.46)',
                    },
                  },
                  '& input::placeholder': {
                    color:
                      'rgba(139, 169, 184, 0.48)',
                    opacity: 1,
                  },
                }}
              />
            </Box>

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1}
              sx={{
                alignItems: {
                  xs: 'stretch',
                  sm: 'center',
                },
                justifyContent:
                  'space-between',
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color:
                    'rgba(139, 169, 184, 0.54)',
                  textTransform: 'uppercase',
                }}
              >
                {searchQuery
                  ? `Mostrando ${filteredSharkAttacks.length} de ${sharkAttacks.length} registros`
                  : 'Escribe para comenzar la búsqueda'}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleNew}
                  sx={{
                    minHeight: 36,
                    borderRadius: 1.5,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  Nuevo registro
                </Button>

                <ImportButton
                  onImported={reload}
                />

                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={reload}
                  disabled={loading}
                  sx={{
                    minHeight: 36,
                    borderRadius: 1.5,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  Actualizar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {detailLoading && (
        <Alert
          severity="info"
          icon={
            <CircularProgress
              size={20}
            />
          }
        >
          Cargando detalle del registro...
        </Alert>
      )}

      {detailError && (
        <Alert severity="error">
          {detailError}
        </Alert>
      )}

      {loading && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            background:
              'rgba(241, 250, 252, 0.92)',
            border:
              '1px solid rgba(117, 231, 238, 0.08)',
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                py: 5,
              }}
            >
              <CircularProgress
                size={28}
              />

              <Typography
                sx={{
                  color:
                    'rgba(139, 169, 184, 0.82)',
                }}
              >
                Cargando ataques registrados...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={reload}
            >
              REINTENTAR
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading &&
        !error &&
        sharkAttacks.length === 0 && (
          <Alert severity="info">
            No hay ataques registrados todavía.
            Utiliza IMPORTAR para cargar los datos.
          </Alert>
        )}

      {!loading &&
        !error &&
        sharkAttacks.length > 0 &&
        filteredSharkAttacks.length === 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                '1px solid rgba(117, 231, 238, 0.09)',
              background:
                'rgba(2, 14, 23, 0.72)',
            }}
          >
            <CardContent>
              <Stack
                spacing={1}
                sx={{
                  alignItems: 'center',
                  py: 6,
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 34,
                    color:
                      'rgba(117, 231, 238, 0.38)',
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    color:
                      'rgba(117, 231, 238, 0.68)',
                    textTransform: 'uppercase',
                  }}
                >
                  Sin coincidencias
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    color:
                      'rgba(139, 169, 184, 0.64)',
                  }}
                >
                  No encontramos registros para
                  "{searchQuery}".
                </Typography>

                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={() =>
                    setSearchQuery('')
                  }
                  sx={{
                    mt: 1,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  Limpiar búsqueda
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

      {!loading &&
        !error &&
        filteredSharkAttacks.length > 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background:
                'transparent',
            }}
          >
            <CardContent
              sx={{
                p: 0,
                '&:last-child': {
                  pb: 0,
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mb: 1.5,
                  px: {
                    xs: 0.5,
                    md: 1,
                  },
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.20em',
                      color:
                        'rgba(117, 231, 238, 0.62)',
                      textTransform:
                        'uppercase',
                    }}
                  >
                    Intelligence records
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color:
                        'rgba(232, 247, 251, 0.92)',
                    }}
                  >
                    Registros
                  </Typography>
                </Box>

                <Chip
                  label={`${filteredSharkAttacks.length} resultados`}
                  size="small"
                  sx={{
                    background:
                      'rgba(117, 231, 238, 0.06)',
                    border:
                      '1px solid rgba(117, 231, 238, 0.10)',
                    color:
                      'rgba(117, 231, 238, 0.72)',
                    fontSize: 9,
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <SharkAttackTable
                sharkAttacks={
                  filteredSharkAttacks
                }
                onSelect={
                  handleSelect
                }
                onEdit={
                  handleEdit
                }
                onDelete={
                  handleDelete
                }
              />
            </CardContent>
          </Card>
        )}
    </Stack>
  );
}

function InfoCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2.5,
        border:
          '1px solid rgba(117, 231, 238, 0.08)',
        background:
          'rgba(241, 250, 252, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': {
            pb: 2.5,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.20em',
            color:
              'rgba(117, 231, 238, 0.58)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.7,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color:
              'rgba(232, 247, 251, 0.92)',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: 11,
            color:
              'rgba(139, 169, 184, 0.66)',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
