import React, { useState } from 'react';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
  import {  LOGIN_MUTATION  } from "../graphql/LoginQueries";


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const client = useApolloClient(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { 
          username: username.trim(), 
          password: password.trim() 
        }
      });

      const { token, user } = data.login;

   
      if (staySignedIn) {
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }

     
      await client.resetStore();

     
      if (user.role === 'Administrator') {
        navigate('/dashboard');
      } else if (user.role === 'Student') {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('incorrect password or username ❌ ');
      console.error('Login error:', err);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 bg-zinc-900 text-white rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">Task Manager</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="stay-signed"
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
              checked={staySignedIn}
              onChange={() => setStaySignedIn(!staySignedIn)}
              disabled={loading}
            />
            <label htmlFor="stay-signed" className="text-sm">
              Stay Signed In
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{' '}
            <a 
              href="/SignUp" 
              className="text-blue-400 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/SignUp');
              }}
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;