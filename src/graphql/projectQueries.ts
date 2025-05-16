import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      progress
      status
      startDate
      endDate
      students {
        id
        name
      }
    }
  }
`;
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      progress
      status
      startDate
      endDate
      students {
        id
        name
      }
    }
  }
`;
