import React, { useState } from 'react';
import { UserData, User } from '../Data/UserData';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);

  React.useEffect(() => {
    UserData.initUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = UserData.getUserByUsername(username.trim());

    if (user && user.password === password.trim()) {
      const sessionData = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        studentId: user.studentId || null
      };

      if (staySignedIn) {
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
      }

      if (user.role === 'Administrator' || user.role === 'Student') {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = '../index.html';
      }
    } else {
      alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <div className="w-full max-w-md p-8 bg-zinc-900 text-white rounded-2xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-400">Task Manager</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            id="username"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="stay-signed"
            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
            checked={staySignedIn}
            onChange={() => setStaySignedIn(!staySignedIn)}
          />
          <label htmlFor="stay-signed" className="text-sm">Stay Signed In</label>
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
        >
          Sign In
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <a href="SignUp.html" className="text-blue-400 hover:underline">Sign up here</a>
        </p>
      </form>
    </div>
  </div>
  
  );
};

export default Login;
