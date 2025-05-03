export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    role: 'Administrator' | 'Student';
    studentId?: number;
  }
  
  const defaultUsers: User[] = [
    { id: 1, username: 'admin', password: 'admin123', name: 'Ali Mohammed', role: 'Administrator' },
    { id: 2, username: 'student1', password: 'student123', name: 'Ali Yaseen', role: 'Student', studentId: 1 },
    { id: 3, username: 'student2', password: 'student123', name: 'Braa Aeesh', role: 'Student', studentId: 2 },
    { id: 4, username: 'student3', password: 'student123', name: 'Ibn Al-Jawzee', role: 'Student', studentId: 3 },
  ];
  
  // Initialize users in localStorage if not already present
  function initUsers(): void {
    if (!localStorage.getItem('tms_users')) {
      localStorage.setItem('tms_users', JSON.stringify(defaultUsers));
    }
  }
  
  // Retrieve all users
  function getUsers(): User[] {
    return JSON.parse(localStorage.getItem('tms_users') || '[]');
  }
  
  // Get user by username
  function getUserByUsername(username: string): User | undefined {
    return getUsers().find(user => user.username === username);
  }
  
  // Add a new user
  function addUser(userData: Omit<User, 'id'>): void {
    const users = getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = { id: newId, ...userData };
    users.push(newUser);
    localStorage.setItem('tms_users', JSON.stringify(users));
  }
  
  // Export as object
  export const UserData = {
    initUsers,
    getUsers,
    getUserByUsername,
    addUser,
  };
  