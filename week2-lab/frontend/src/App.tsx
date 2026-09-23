import { useState } from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';

import { Layout } from './components/Layout';
import { Week2Dashboard } from './pages/Week2Dashboard';
import { Week3Dashboard } from './pages/Week3Dashboard';

function App() {
  const [view, setView] = useState<'week2' | 'week3'>('week3');

  return (
    <Layout>
      <Stack spacing={3}>
        <ButtonGroup variant="outlined" sx={{ alignSelf: 'flex-start' }}>
          <Button onClick={() => setView('week3')} variant={view === 'week3' ? 'contained' : 'outlined'}>
            Shark Intelligence
          </Button>
          <Button onClick={() => setView('week2')} variant={view === 'week2' ? 'contained' : 'outlined'}>
            Week 2 Operations
          </Button>
        </ButtonGroup>
        {view === 'week3' ? <Week3Dashboard /> : <Week2Dashboard />}
      </Stack>
    </Layout>
  );
}

export default App;