import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      title
      description
      progress
      status
      category
      startDate
      endDate
      students {
        id
        name
      }
      tasks {
        id
        name
        status
        dueDate
      }
    }
  }
`;

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    allStudents {
      id
      name
      email
    }
  }
`;

export const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: ID!) {
    studentById(id: $id) {
      id
      name
      email
      projects {
        id
        title
        description
        progress
        status
        startDate
        endDate
      }
    }
  }
`;

export const GET_PROJECTS_BY_STUDENT_ID = gql`
  query GetProjectsByStudentId($studentId: ID!) {
    projectsByStudentId(studentId: $studentId) {
      id
      title
      description
      progress
      status
      category
      startDate
      endDate
      tasks {
        id
        name
        status
        dueDate
      }
    }
  }
`;

export const GET_STUDENT_PROJECTS = gql`
  query GetStudentProjects($studentId: ID!) {
    projectsByStudentId(studentId: $studentId) {
      id
      title
      description
      progress
      status
      category
      startDate
      endDate
      students {
        id
        name
      }
      tasks {
        id
        name
        status
        dueDate
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

export const CREATE_STUDENT = gql`
  mutation CreateStudent($name: String!, $email: String) {
    createStudent(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;