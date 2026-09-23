import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
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
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 800,
          }}
        >
          Laboratorio Técnico · Week 2
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Gestión de reportes de ataques de
          tiburón utilizando DDD, RxJS,
          MongoDB y una arquitectura por capas.
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
          <Card>
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Arquitectura
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                DDD
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Entity · Value Object · Aggregate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Datos
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                MongoDB
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                CRUD · Persistencia · Event Store
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                Programación reactiva
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                RxJS
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Observable · Subscription · Operators
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
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
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Shark Attack Management
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Registros almacenados en
                ms-facts-mng
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={
                <AddIcon />
              }
              onClick={handleNew}
            >
              NUEVO
            </Button>

            <ImportButton
              onImported={reload}
            />

            <Button
              variant="outlined"
              startIcon={
                <RefreshIcon />
              }
              onClick={reload}
              disabled={loading}
            >
              ACTUALIZAR
            </Button>
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
        <Card>
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
              <CircularProgress />

              <Typography>
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
            Utiliza IMPORTAR para cargar los
            datos.
          </Alert>
        )}

      {!loading &&
        !error &&
        sharkAttacks.length > 0 && (
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Registros
                </Typography>

                <Chip
                  label={`${sharkAttacks.length} registros`}
                  size="small"
                />
              </Stack>

              <SharkAttackTable
                sharkAttacks={
                  sharkAttacks
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