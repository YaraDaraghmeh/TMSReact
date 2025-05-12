import { gql } from '@apollo/client';

export const DASHBOARD_COUNTS_QUERY = gql`
  query DashboardCounts {
    projectCount
    taskCount
    studentCount
    finishedProjectCount
  }
`;