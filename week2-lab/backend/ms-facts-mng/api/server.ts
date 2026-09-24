import cors from 'cors';
import express from 'express';
import { graphql } from 'graphql';
import { delay, from } from 'rxjs';

import {
  SharkAttack,
  type SharkAttackProps,
} from '../domain/entities/SharkAttack';

import { SharkAttackReportedConsumer } from '../application/consumers/SharkAttackReportedConsumer';
import { ImportSharkAttacksHandler } from '../application/handlers/ImportSharkAttacksHandler';
import { ReportSharkAttackHandler } from '../application/handlers/ReportSharkAttackHandler';

import {
  GetSharkAttacksHandler,
} from '../application/queries/GetSharkAttacksHandler';

import {
  GetSharkAttackByIdHandler,
} from '../application/queries/GetSharkAttackByIdHandler';

import {
  GetSharkAttacksByCountryHandler,
} from '../application/queries/GetSharkAttacksByCountryHandler';

import { GetSharkAttackStatisticsHandler } from '../application/queries/GetSharkAttackStatisticsHandler';

import { OpenDataSoftClient } from '../infrastructure/external-api/OpenDataSoftClient';
import { SharkAttackFallbackProvider } from '../infrastructure/external-api/SharkAttackFallbackProvider';

import { MongoEventStore } from '../infrastructure/event-store/MongoEventStore';

import {
  createGraphQLSchema,
  getGraphQLRootValue,
} from '../infrastructure/graphql/schema';

import { MongoDatabase } from '../infrastructure/mongodb/MongoDatabase';
import { MongoSharkAttackRepository } from '../infrastructure/mongodb/MongoSharkAttackRepository';
import { GooglePubSubPublisher } from '../infrastructure/pubsub/GooglePubSubPublisher';

const app = express();

const PORT = Number(process.env.PORT ?? 3106);

const frontendUrl =
  process.env.FRONTEND_URL?.trim().replace(/\/$/, '');

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(frontendUrl ? [frontendUrl] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin =
        origin.trim().replace(/\/$/, '');

      if (
        allowedOrigins.includes(normalizedOrigin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `Origin not allowed by CORS: ${origin}`,
        ),
      );
    },
  }),
);

app.use(express.json());

app.post('/graphql', async (req, res) => {
  try {
    const result = await graphql({
      schema: graphQLSchema,
      source: req.body?.query,
      rootValue: getGraphQLRootValue(graphQLSchema),
      variableValues: req.body?.variables,
      operationName: req.body?.operationName,
    });

    res.status(result.errors ? 400 : 200).json(result);
  } catch (error) {
    res.status(400).json({
      errors: [
        {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to execute GraphQL query',
        },
      ],
    });
  }
});

const mongoDatabase = new MongoDatabase();

const sharkAttackRepository =
  new MongoSharkAttackRepository();

const eventStore = new MongoEventStore();

const openDataSoftClient =
  new OpenDataSoftClient();

const fallbackProvider =
  new SharkAttackFallbackProvider();

const pubSubPublisher =
  new GooglePubSubPublisher();

const sharkAttackConsumer =
  new SharkAttackReportedConsumer(
    sharkAttackRepository,
    eventStore,
    pubSubPublisher,
  );

const reportSharkAttackHandler =
  new ReportSharkAttackHandler();

const importSharkAttacksHandler =
  new ImportSharkAttacksHandler(
    openDataSoftClient,
    fallbackProvider,
  );

const getSharkAttacksHandler =
  new GetSharkAttacksHandler(
    sharkAttackRepository,
  );

const getSharkAttackByIdHandler =
  new GetSharkAttackByIdHandler(
    sharkAttackRepository,
  );

const getSharkAttacksByCountryHandler =
  new GetSharkAttacksByCountryHandler(
    sharkAttackRepository,
    openDataSoftClient,
    fallbackProvider,
  );

const getSharkAttackStatisticsHandler =
  new GetSharkAttackStatisticsHandler(
    sharkAttackRepository,
  );

const graphQLSchema = createGraphQLSchema(
  getSharkAttackStatisticsHandler,
);

app.get('/health', async (_req, res) => {
  try {
    await mongoDatabase.ping();

    res.json({
      status: 'ok',
      service: 'ms-facts-mng',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'ms-facts-mng',
      database: 'disconnected',
      error:
        error instanceof Error
          ? error.message
          : 'Unknown database error',
    });
  }
});

app.get('/shark-attacks', async (_req, res) => {
  try {
    const records =
      await getSharkAttacksHandler.execute({});

    res.json({
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to retrieve shark attacks',
    });
  }
});

app.get('/shark-attacks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        error: 'Invalid shark attack id',
      });
      return;
    }

    const record =
      await getSharkAttackByIdHandler.execute({
        id,
      });

    if (!record) {
      res.status(404).json({
        error: 'Shark attack not found',
      });
      return;
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to retrieve shark attack',
    });
  }
});

app.get(
  '/shark-attacks/country/:country',
  async (req, res) => {
    try {
      const country = decodeURIComponent(
        req.params.country,
      )
        .trim()
        .toUpperCase();

      if (!country) {
        res.status(400).json({
          error: 'Country is required',
        });
        return;
      }

      const result =
        await getSharkAttacksByCountryHandler.execute({
          country,
        });

      from(Promise.resolve(result.records))
        .pipe(delay(1000))
        .subscribe({
          next: (data) => {
            res.json({
              country,
              count: data.length,
              source: result.source,
              data,
            });
          },

          error: (error) => {
            res.status(500).json({
              error:
                error instanceof Error
                  ? error.message
                  : 'Unable to retrieve country cases',
            });
          },
        });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to retrieve country cases',
      });
    }
  },
);

app.post('/shark-attacks', async (req, res) => {
  try {
    const input = req.body as SharkAttackProps;

    const result =
      reportSharkAttackHandler.execute({
        type: 'ReportSharkAttack',
        input,
      });

    await sharkAttackConsumer.process(result.event);

    res.status(201).json({
      data: result.aggregate.toPrimitives(),
      event: result.event,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to create shark attack',
    });
  }
});

app.put('/shark-attacks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        error: 'Invalid shark attack id',
      });
      return;
    }

    const existing =
      await sharkAttackRepository.findById(id);

    if (!existing) {
      res.status(404).json({
        error: 'Shark attack not found',
      });
      return;
    }

    const aggregate = new SharkAttack({
      ...existing,
      id,
    });

    aggregate.update(req.body);

    const updated =
      aggregate.toPrimitives();

    await sharkAttackRepository.save(updated);

    res.json({
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to update shark attack',
    });
  }
});

app.delete(
  '/shark-attacks/:id',
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          error: 'Invalid shark attack id',
        });
        return;
      }

      const existing =
        await sharkAttackRepository.findById(id);

      if (!existing) {
        res.status(404).json({
          error: 'Shark attack not found',
        });
        return;
      }

      await sharkAttackRepository.deleteById(id);

      res.json({
        message:
          'Shark attack deleted successfully',
        id,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to delete shark attack',
      });
    }
  },
);

app.post(
  '/shark-attacks/import',
  async (_req, res) => {
    try {
      const result =
        await importSharkAttacksHandler.execute({
          type: 'ImportSharkAttacks',
        });

      for (const event of result.emittedEvents) {
        await sharkAttackConsumer.process(event);
      }

      res.status(201).json({
        imported: result.imported,
        events: result.events,
        source: result.source,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to import shark attacks',
      });
    }
  },
);

app.get('/events', async (_req, res) => {
  try {
    const events = await eventStore.findAll();

    res.json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to retrieve events',
    });
  }
});

app.get(
  '/events/:aggregateId',
  async (req, res) => {
    try {
      const aggregateId = Number(
        req.params.aggregateId,
      );

      if (!Number.isInteger(aggregateId)) {
        res.status(400).json({
          error: 'Invalid aggregate id',
        });
        return;
      }

      const events =
        await eventStore.findByAggregateId(
          aggregateId,
        );

      res.json({
        aggregateId,
        count: events.length,
        data: events,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to retrieve aggregate events',
      });
    }
  },
);

const server = app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `ms-facts-mng running on http://0.0.0.0:${PORT}`,
    );
  },
);

async function shutdown() {
  console.log(
    'Shutting down ms-facts-mng...',
  );

  server.close();

  await sharkAttackRepository.disconnect();
  await mongoDatabase.disconnect();

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
