import {
    Alert,
    Button,
    CircularProgress,
    Snackbar,
} from '@mui/material';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { useState } from 'react';

import {
    importSharkAttacks,
} from '../services/sharkAttackApi';

type ImportButtonProps = {
  onImported: () => void;
};

export function ImportButton({
  onImported,
}: ImportButtonProps) {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const result =
        await importSharkAttacks();

      setMessage(
        `${result.imported} registros importados y ${result.events} eventos generados. Fuente: ${result.source}.`,
      );

      onImported();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible importar los registros.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : (
            <CloudDownloadIcon />
          )
        }
        onClick={handleImport}
        disabled={loading}
      >
        {loading
          ? 'IMPORTANDO...'
          : 'IMPORTAR'}
      </Button>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={5000}
        onClose={() =>
          setMessage(null)
        }
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setMessage(null)
          }
        >
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={7000}
        onClose={() =>
          setError(null)
        }
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setError(null)
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
