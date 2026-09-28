import { useState } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material';

import { Layout } from './components/Layout';
import { Week2Dashboard } from './pages/Week2Dashboard';
import { Week3Dashboard } from './pages/Week3Dashboard';

type View = 'week3' | 'week2';

function App() {
  const [view, setView] = useState<View>('week3');

  return (
    <Layout>
      <Stack spacing={3}>
        <Box className="ocean-command-bar">
          <Box className="ocean-command-info">
            <span className="ocean-command-kicker">
              NEBULAE OCEAN INTELLIGENCE
            </span>

            <strong>
              Operational Intelligence Center
            </strong>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <Box className="ocean-navigation">
              <ButtonGroup variant="outlined">
                <Button
                  onClick={() => setView('week3')}
                  variant={
                    view === 'week3'
                      ? 'contained'
                      : 'outlined'
                  }
                >
                  Shark Intelligence
                </Button>

                <Button
                  onClick={() => setView('week2')}
                  variant={
                    view === 'week2'
                      ? 'contained'
                      : 'outlined'
                  }
                >
                  SharkAttacks
                </Button>
              </ButtonGroup>
            </Box>

            <Box className="ocean-live-chip">
              <Typography
                component="span"
                sx={{
                  display: 'block',
                  px: 1.2,
                  py: 0.7,
                  borderRadius: 999,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                â— LIVE
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="ocean-page-transition">
          {view === 'week3' ? (
            <Week3Dashboard />
          ) : (
            <Week2Dashboard />
          )}
        </Box>
      </Stack>
    </Layout>
  );
}

export default App;