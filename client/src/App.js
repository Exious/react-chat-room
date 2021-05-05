import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from "./components/Login";
import Room from "./components/Room";
import Auth from "./components/Auth";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/">
          <Auth />
        </Route>
        <Route path="/room/:id" exact>
          <Room />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
      </Router>
    </AuthProvider>
  );
}

export default App;
