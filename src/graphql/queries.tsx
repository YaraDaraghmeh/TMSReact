
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

  export const STUDENT_TASK_STATS_QUERY = gql`
    query StudentTaskStats($studentId: ID!) {
      studentTaskStats(studentId: $studentId) {
        pending
        inProgress
        completed
      }
    }
  `;