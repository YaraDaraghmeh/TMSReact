import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { ApolloProvider } from '@apollo/client';
import client from './services/apolloClient';
import Tasks from './pages/Tasks';
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Task" element={<Tasks/>} />
          <Route path="/dashboard2" element={<div>Coming soon222!</div>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;