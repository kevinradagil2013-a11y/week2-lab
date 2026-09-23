import { gql } from '@apollo/client';

export const GET_SHARK_ATTACK_STATISTICS = gql`
  query GetSharkAttackStatistics {
    statistics {
      total
      byCountry {
        country
        count
      }
      byYear {
        year
        count
      }
    }
  }
`;