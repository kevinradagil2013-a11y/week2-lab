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
      <Alert severity="info">
        El registro no tiene un país asociado
        para realizar la consulta relacionada.
      </Alert>
    );
  }

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
              }}
            >
              Casos relacionados
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Consulta los casos registrados en{' '}
              <strong>{country}</strong>.
            </Typography>
          </Stack>

          <Divider />

          <Button
            variant="contained"
            startIcon={
              <SearchIcon />
            }
            onClick={handleSearch}
            disabled={loading}
            sx={{
              alignSelf: 'flex-start',
              fontWeight: 700,
            }}
          >
            {loading
              ? 'CONSULTANDO...'
              : `CONSULTAR MÁS CASOS EN ${country}`}
          </Button>

          {loading && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={28} />

              <Typography color="text.secondary">
                Consultando casos relacionados
                en {country}...
              </Typography>
            </Stack>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {!loading &&
            !error &&
            searched &&
            cases.length === 0 && (
              <Alert severity="info">
                No se encontraron casos relacionados
                para {country}.
              </Alert>
            )}

          {!loading &&
            !error &&
            cases.length > 0 && (
              <List disablePadding>
                {cases.map(
                  (
                    sharkAttack,
                    index,
                  ) => (
                    <ListItem
                      key={sharkAttack.id}
                      divider={
                        index <
                        cases.length - 1
                      }
                      sx={{
                        px: 0,
                        py: 2,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {sharkAttack.fecha ??
                              'Fecha no disponible'}
                          </Typography>
                        }
                        secondary={
                          <>
                            <strong>
                              Tipo:
                            </strong>{' '}
                            {sharkAttack.tipo ??
                              '—'}
                            {' · '}
                            <strong>
                              Especie:
                            </strong>{' '}
                            {sharkAttack.especie ??
                              '—'}
                            {' · '}
                            <strong>
                              Lugar:
                            </strong>{' '}
                            {sharkAttack.ubicación ??
                              '—'}
                          </>
                        }
                      />
                    </ListItem>
                  ),
                )}
              </List>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
}