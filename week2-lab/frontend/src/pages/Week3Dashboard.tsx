import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client/react';
import type { ReactNode } from 'react';

import { GET_SHARK_ATTACK_STATISTICS } from '../graphql/queries';

type CountryStat = {
  country: string;
  count: number;
};

type YearStat = {
  year: number;
  count: number;
};

type StatisticsData = {
  statistics: {
    total: number;
    byCountry: CountryStat[];
    byYear: YearStat[];
  };
};

function OceanCard({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: object;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid rgba(148, 210, 226, 0.2)',
        background: 'linear-gradient(145deg, #102b42 0%, #0b1c2c 100%)',
        color: '#e8f7fb',
        boxShadow: '0 18px 45px rgba(3, 20, 34, 0.22)',
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

export function Week3Dashboard() {
  const { data, loading, error } = useQuery<StatisticsData>(
    GET_SHARK_ATTACK_STATISTICS,
    { fetchPolicy: 'cache-and-network' },
  );

  const statistics = data?.statistics;
  const countries = statistics?.byCountry ?? [];
  const years = statistics?.byYear ?? [];
  const maxCountry = Math.max(...countries.map((item) => item.count), 1);
  const maxYear = Math.max(...years.map((item) => item.count), 1);

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          color: '#e8f7fb',
          background:
            'radial-gradient(circle at 85% 15%, rgba(77, 207, 220, .32), transparent 30%), linear-gradient(125deg, #061624 0%, #0a3953 55%, #087e8b 100%)',
          boxShadow: '0 22px 55px rgba(3, 31, 49, .28)',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 3, color: '#8ce4ea' }}>
          OCEAN DATA MONITORING CENTER
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontWeight: 800, letterSpacing: -1 }}>
          Shark Intelligence
        </Typography>
        <Typography sx={{ maxWidth: 680, mt: 1.5, color: 'rgba(232,247,251,.78)' }}>
          Historical attack intelligence, geographic concentration and temporal patterns from the Shark Attacks domain.
        </Typography>
      </Box>

      {loading && !statistics && (
        <Stack spacing={2} sx={{ py: 6, alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#0b8f9c' }} />
          <Typography color="text.secondary">Loading ocean intelligence...</Typography>
        </Stack>
      )}

      {error && (
        <Alert severity="error">
          GraphQL statistics could not be loaded: {error.message}
        </Alert>
      )}

      {!loading && !error && statistics && statistics.total === 0 && (
        <Alert severity="info">
          No shark attack data is available yet. Run the import to populate the dashboard.
        </Alert>
      )}

      {statistics && (
        <>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <OceanCard>
                <CardContent>
                  <Typography variant="overline" sx={{ color: '#8ce4ea', letterSpacing: 2 }}>
                    TOTAL SHARK ATTACKS
                  </Typography>
                  <Typography variant="h2" sx={{ mt: 1, fontWeight: 800, color: '#fff' }}>
                    {statistics.total.toLocaleString()}
                  </Typography>
                  <Typography sx={{ mt: 1, color: 'rgba(232,247,251,.65)' }}>
                    Records persisted in the shark intelligence data store
                  </Typography>
                </CardContent>
              </OceanCard>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <OceanCard>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Top 5 Countries</Typography>
                  <Typography sx={{ color: 'rgba(232,247,251,.62)', mb: 2 }}>
                    Highest concentration by country
                  </Typography>
                  <Stack spacing={1.6}>
                    {countries.map((item) => (
                      <Box key={item.country}>
                        <Stack direction="row" sx={{ mb: 0.5, justifyContent: 'space-between' }}>
                          <Typography>{item.country}</Typography>
                          <Typography sx={{ color: '#8ce4ea', fontWeight: 700 }}>{item.count}</Typography>
                        </Stack>
                        <Box sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.1)' }}>
                          <Box sx={{ width: `${(item.count / maxCountry) * 100}%`, height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, #55d6e0, #159bb0)' }} />
                        </Box>
                      </Box>
                    ))}
                    {countries.length === 0 && <Typography sx={{ color: 'rgba(232,247,251,.62)' }}>No country data.</Typography>}
                  </Stack>
                </CardContent>
              </OceanCard>
            </Grid>
          </Grid>

          <OceanCard>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Attacks by Year</Typography>
              <Typography sx={{ color: 'rgba(232,247,251,.62)', mb: 2 }}>
                Chronological distribution calculated by MongoDB aggregation
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 640, height: 280, position: 'relative', borderLeft: '1px solid rgba(255,255,255,.25)', borderBottom: '1px solid rgba(255,255,255,.25)', px: 2, pt: 2 }}>
                  <svg viewBox="0 0 1000 260" role="img" aria-label="Attacks by year" style={{ width: '100%', height: 230, overflow: 'visible' }}>
                    <polyline
                      fill="none"
                      stroke="#70e1e7"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={years.map((item, index) => {
                        const x = years.length === 1 ? 500 : (index / (years.length - 1)) * 960 + 20;
                        const y = 230 - (item.count / maxYear) * 200;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {years.map((item, index) => {
                      const x = years.length === 1 ? 500 : (index / (years.length - 1)) * 960 + 20;
                      const y = 230 - (item.count / maxYear) * 200;
                      return (
                        <g key={item.year}>
                          <circle cx={x} cy={y} r="5" fill="#d8fbff" stroke="#159bb0" strokeWidth="3" />
                          <text x={x} y="252" textAnchor="middle" fill="rgba(232,247,251,.7)" fontSize="12">{item.year}</text>
                          <text x={x} y={Math.max(y - 10, 14)} textAnchor="middle" fill="#8ce4ea" fontSize="12">{item.count}</text>
                        </g>
                      );
                    })}
                  </svg>
                </Box>
              </Box>
            </CardContent>
          </OceanCard>
        </>
      )}
    </Stack>
  );
}