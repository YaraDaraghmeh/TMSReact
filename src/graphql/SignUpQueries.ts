import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      success
      message
      user {
        id
        username
      }
    }
  }
`;