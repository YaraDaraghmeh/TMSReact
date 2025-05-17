import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { ApolloProvider } from '@apollo/client';
import client from './services/apolloClient';
import Dashboard from './pages/Dashboard';
import MainLayout from './Components/MainLayout';
import ProjectsOverviewPage from './pages/ProjectsOverview';
import Tasks from './pages/Tasks'
import ChatPage from './pages/ChatPage';
import SignUp from './pages/SignUp';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          {/* inside Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project" element={<ProjectsOverviewPage />} />
            <Route path="/Task" element={<Tasks />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;