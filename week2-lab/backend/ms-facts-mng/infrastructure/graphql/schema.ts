import {
  buildSchema,
  type GraphQLSchema,
} from 'graphql';

import type { GetSharkAttackStatisticsHandler } from '../../application/queries/GetSharkAttackStatisticsHandler';

type GraphQLRoot = {
  totalSharkAttacks: () => Promise<number>;
  sharkAttacksByCountry: () => Promise<unknown[]>;
  sharkAttacksByYear: () => Promise<unknown[]>;
  statistics: () => Promise<unknown>;
};

const roots = new WeakMap<GraphQLSchema, GraphQLRoot>();

export function createGraphQLSchema(
  statisticsHandler: GetSharkAttackStatisticsHandler,
): GraphQLSchema {
  const schema = buildSchema(`
    type CountryAttackStat {
      country: String!
      count: Int!
    }

    type YearAttackStat {
      year: Int!
      count: Int!
    }

    type SharkAttackStatistics {
      total: Int!
      byCountry: [CountryAttackStat!]!
      byYear: [YearAttackStat!]!
    }

    type Query {
      totalSharkAttacks: Int!
      sharkAttacksByCountry: [CountryAttackStat!]!
      sharkAttacksByYear: [YearAttackStat!]!
      statistics: SharkAttackStatistics!
    }
  `);

  const getStatistics = () =>
    statisticsHandler.execute({});

  roots.set(schema, {
    totalSharkAttacks: async () => (await getStatistics()).total,
    sharkAttacksByCountry: async () => (await getStatistics()).byCountry,
    sharkAttacksByYear: async () => (await getStatistics()).byYear,
    statistics: getStatistics,
  });

  return schema;
}

export function getGraphQLRootValue(
  schema: GraphQLSchema,
): GraphQLRoot {
  const root = roots.get(schema);

  if (!root) {
    throw new Error('GraphQL schema root is not configured.');
  }

  return root;
}