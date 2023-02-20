import React, { useEffect, useState } from "react";
import { GlobalStyle } from "./styles/Global";
import "./App.css";
import "./styles/Theme/variables.css";
import { registerLicense } from '@syncfusion/ej2-base';

// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
    BrowserRouter, Navigate,
    Route,
    Routes
} from "react-router-dom";
import Home from "./screens/Home/Home";

import AppContext from "./auth/context/context";
import Vista from "./components/UML/UML";

/** Componente que contiene todas las rutas
 *  de navegación en la aplicación
 */
function App() {
  const [user, setUser] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectionModel, setSelectionModel] = useState([]);
  const [reloadSidebar, setReloadSidebar] = useState(false);
  const [cy, setCy] = useState();
  const [composite, setComposite] = useState(false);

    registerLicense('Mgo+DSMBaFt/QHRqVVhlXFpHaV1CQmFJfFBmRGlYeVRyfUUmHVdTRHRcQl9iQX9QdEVnW3pZc3M=;Mgo+DSMBPh8sVXJ0S0J+XE9BdlRBQmFJYVF2R2BJflRxcl9EaUwxOX1dQl9gSXxSfkRgW39acnFdQmc=;ORg4AjUWIQA/Gnt2VVhkQlFac19JXnxLfkx0RWFab196dVNMYlVBJAtUQF1hSn5Rd01iWn1edHZQT2hb;MTE1NjQ3NUAzMjMwMmUzNDJlMzBpaC9nOE4vait1ejFGS09EelUwaHpjL3lvazNWOG5ZcUd6SDdJR3FHRkEwPQ==;MTE1NjQ3NkAzMjMwMmUzNDJlMzBtbVV4Z3o0K0IvSm9nSE5FTTZOWEtUdUdSQXRMM3pBd25wWW1ibkp0U2tnPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFpCVmBWfFNpR2NbfE5xflRAal5YVBYiSV9jS31TdERrWHxccHBXQGRVWA==;MTE1NjQ3OEAzMjMwMmUzNDJlMzBBQjRscmZGT2xoZTU1V0JGc3o5OFc3UUFrR1NVNkVsbC92OWNoQk41MG9zPQ==;MTE1NjQ3OUAzMjMwMmUzNDJlMzBLOHlvWmozck9WWWEvUDd4WnJMRWIybDZZMmVIcEs1SjJiM0NRMmRFMGNjPQ==;Mgo+DSMBMAY9C3t2VVhkQlFac19JXnxLfkx0RWFab196dVNMYlVBJAtUQF1hSn5Rd01iWn1edHZTT2lV;MTE1NjQ4MUAzMjMwMmUzNDJlMzBXRlJybnVrQ0VKSXMydnJKT3dOYW9Ca2NWc3ROSEdKa1A4OVlsVUxFVmw0PQ==;MTE1NjQ4MkAzMjMwMmUzNDJlMzBDanhUWnQxcDZITHZsNVBSOWNjNmFnQTJ4UEFyU1g0UFkwNENWa0dldDZvPQ==;MTE1NjQ4M0AzMjMwMmUzNDJlMzBBQjRscmZGT2xoZTU1V0JGc3o5OFc3UUFrR1NVNkVsbC92OWNoQk41MG9zPQ==');
  /**
   * Restaurar usuario si ya se ha iniciado sesión
   */
  const restoreUser = () => {
    const tempUser = localStorage.getItem("user");
    if (tempUser) setUser(JSON.parse(tempUser));
  };

  useEffect(() => {
    restoreUser();
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContext.Provider value={{
          user, setUser,
          selectedProject, setSelectedProject,
          selectedNodes, setSelectedNodes,
          reloadSidebar, setReloadSidebar,
          selectionModel, setSelectionModel,
          cy, setCy,
          composite, setComposite,
        }}>
          <BrowserRouter>
              <Routes>
                  <Route exact path="/" element={<Home />}/>
                  {/*<Route exact path="/uml" element={<Vista />}/>*/}
                  <Route path="*" status={404} />
                  {/*<Route exact path="/users" render={() => <Users name='John Serrano' />} />*/}
                  {/*<Route component={PageNotFound} />*/}
              </Routes>
          </BrowserRouter>
      </AppContext.Provider>
    </>
  );
}

export default App;
