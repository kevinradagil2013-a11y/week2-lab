import type { ReactNode } from 'react';

import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({
  children,
}: LayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Portal Conductor
            </Typography>

            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
              }}
            >
              Nebulae · Laboratorio Técnico
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
          >
            WEEK 2
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}