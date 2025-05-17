import { gql } from '@apollo/client';

export const GET_USERS = gql`
    query {
      users {
        id
        username
        name
        role
      }
    }
  `;

