  import React, { useState } from 'react';
  import { useMutation, gql } from '@apollo/client';
  import { useNavigate } from 'react-router-dom';
  import { SIGNUP_MUTATION } from '../graphql/SignUpQueries';


  const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      isStudent: false,
      universityId: ''
    });
    const [error, setError] = useState('');
    const [signUp, { loading }] = useMutation(SIGNUP_MUTATION);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (formData.isStudent && !formData.universityId) {
    setError('University ID is required for students');
    return;
  }

  try {
    console.log("Sending signup mutation...");

        const { data } = await signUp({
          variables: {
            input: {
              username: formData.username.trim(),
              password: formData.password.trim(),
              name: formData.username.trim(),
              isStudent: formData.isStudent,
              universityId: formData.isStudent ? formData.universityId.trim() : null
            }
          }
          
        });
        console.log( 'signup data:', data)

    if (data.signUp.success) {
      alert(data.signUp.message);
      alert('Registration successful! You can now login with your credentials');
      navigate('/'); 
    }
    else{ alert('no data ')}
  } catch (err: any) {
  console.error('SignUp error:', err);

  if (err.graphQLErrors && err.graphQLErrors.length > 0) {
    console.error("GraphQL Error:", err.graphQLErrors[0].message);
    setError(err.graphQLErrors[0].message);
  } else if (err.networkError) {
    console.error("Network Error:", err.networkError);
    setError("Network error: " + err.networkError.message);
  } else {
    setError(err.message || 'Unknown error occurred during sign up');
  }
}


};

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-full max-w-md p-8 bg-zinc-900 text-white rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-green-400">Task Manager</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
              {error}
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
                name="username"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.username}
                onChange={handleChange}
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
                name="password"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isStudent"
                name="isStudent"
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-2"
                checked={formData.isStudent}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="isStudent" className="text-sm">
                I am a student
              </label>
            </div>

            {formData.isStudent && (
              <div>
                <label htmlFor="universityId" className="block text-sm font-medium mb-1">
                  University ID
                </label>
                <input
                  type="text"
                  id="universityId"
                  name="universityId"
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.universityId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="mt-4 text-sm text-center">
              Already have an account?{' '}
              <a 
                href="/" 
                className="text-blue-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Log in here
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default SignUp;
