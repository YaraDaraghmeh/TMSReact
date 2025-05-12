// graphql/queries.ts

import { gql } from '@apollo/client';

export const DASHBOARD_COUNTS_QUERY = gql`
  query GetStats {
    stats {
      totalProjects
      totalTasks
      finishedProjects
      totalStudents
    }
  }
`;
