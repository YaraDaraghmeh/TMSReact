import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import { ApolloProvider } from '@apollo/client';
import client from './services/apolloClient';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<div>Coming soon!</div>} />
          <Route path="/dashboard2" element={<div>Coming soon222!</div>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;