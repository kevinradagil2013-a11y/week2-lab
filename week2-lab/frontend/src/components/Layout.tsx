import type { ReactNode } from 'react';

import {
  Box,
  Container,
  Typography,
} from '@mui/material';

import WaterIcon from '@mui/icons-material/Water';
import RadarIcon from '@mui/icons-material/Radar';

import { SharkTestScene } from '../shark/SharkTestScene';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({
  children,
}: LayoutProps) {
  return (
    <Box className="ocean-shell">

      {/* Ocean Live: permanent application background */}
      <div className="ocean-global-layer">
        <SharkTestScene />
      </div>

      <div className="ocean-global-overlay" />

      <header className="ocean-header">
        <div className="ocean-brand">
          <div className="ocean-brand-mark">
            <WaterIcon />
          </div>

          <div>
            <Typography
              component="div"
              className="ocean-brand-name"
            >
              NEBULAE
            </Typography>

            <Typography
              component="div"
              className="ocean-brand-product"
            >
              OCEAN INTELLIGENCE
            </Typography>
          </div>
        </div>

        <div className="ocean-header-status">
          <RadarIcon />

          <span>
            LIVE DATA STREAM
          </span>

          <span className="ocean-status-dot" />
        </div>
      </header>

      <main className="ocean-main">
        <Container
          maxWidth="xl"
          className="ocean-container"
        >
          {children}
        </Container>
      </main>

      <footer className="ocean-footer">
        <span>
          NEBULAE · SHARK INTELLIGENCE PLATFORM
        </span>

        <span>
          DDD · RXJS · GRAPHQL · MONGODB
        </span>
      </footer>
    </Box>
  );
}