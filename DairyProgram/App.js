// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import TravelForm from './TravelForm';
import Travels from './Travels';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/travel-form" component={TravelForm} />
        <Route path="/travels" component={Travels} />
      </Switch>
    </Router>
  );
}

export default App;