  import { gql } from '@apollo/client';
  
 export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      project {
        title
      }
      name
      description
      assignedTo {
        name
      }
      status
      dueDate
    }
    projects {
      id
      title
    }
    students {
      id
      name
    }
  }
`;

 export const GET_STUDENT_TASKS = gql`
 query GetStudentTasks($studentId: ID!) {
  studentTasks(studentId: $studentId) {
    id
    project {
      title
    }
    name
    description
    status
    dueDate
    assignedTo {
      id
      name
    }
  }
}
`;

 export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      name
      status
    }
  }
`;

 export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      status
    }
  }
`;
