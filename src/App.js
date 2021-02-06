import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./screens/Home/Home";
import './App.css';

import AuthContext from "./auth/context/context";

/** Componente que contiene todas las rutas
 *  de navegación en la aplicación
 */
function App() {
  const [user, setUser] = useState();

  /**
   * Restaurar usuario si ya se ha iniciado sesión
   */
  const restoreUser = async () => {
    const user = await localStorage.getItem('user');
    if(user) setUser(JSON.parse(user));
  }

  useEffect(() => {
    restoreUser();
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
