import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import { ApolloProvider } from '@apollo/client';
import client from './services/apolloClient';
import Dashboard from './pages/Dashboard';
import MainLayout from './Components/MainLayout';
import ProjectOverviewPage from './pages/ProjectsOverview';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* inside Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project" element={<ProjectOverviewPage />} />
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
