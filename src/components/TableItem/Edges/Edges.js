import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";

import {
  ManageMetrics,
  ManageCombineMetrics,
  ManageCreateCompositeComponent,
} from '../../../helpers/metrics/metrics';

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";
import "./inputs.css";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { manageElementsUpdate } from '../../../helpers/elements/elements';
import axios from "axios";

/**
 * Componente que representa
 * la tabla de aristas del proyecto selecionado
 */


const EdgesTable = () => {
  const { user, selectedProject, setSelectedProject, setComposite, /* elements setReloadSidebar*/ } = useContext(AppContext);
  const [loader, setLoader] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingComponents, setLoadingComponents] = useState(false);

  const columns1 = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'source', headerName: 'Origen', width: 180 },
    { field: 'target', headerName: 'Destino', width: 180 },
    { field: 'relation', headerName: 'Relación', width: 150 },
    { field: 'index', headerName: 'Index', width: 150 },
    { field: 'coupling', headerName: 'Coupling', width: 150 },
    { field: 'abstractness', headerName: 'Abstracción', width: 180 },
    { field: 'instability', headerName: 'Inestabilidad', width: 180 },
    { field: 'dms', headerName: 'DMS', width: 150 },
    {
      field: 'nameRessemblance',
      headerName: 'Semejanza de Nombre',
      width: 180,
    },
    { field: 'packageMapping', headerName: 'Mapeo de Paquetes', width: 180 },
    { field: 'overall_q', headerName: 'Q', width: 100 },
  ];

  // Getting the values of each input fields
  const [dms, setDms] = useState(15);
  const [nameResemblance, setNameResemblance] = useState(35);
  const [packageMapping, setPackageMapping] = useState(25);
  const [umbralName, setUmbralName] = useState(40);
  const [umbralCoupling, setUmbralCoupling] = useState(0.45);
  const [umbral, setUmbral] = useState(-0.1);
  const [total, setTotal] = useState(0);
  const [weighing, setWeighing ] = useState({
    dms: dms,
    coupling: umbralCoupling,
    name_resemblance: nameResemblance,
    package_mapping: packageMapping
  })
  const [render, setRender] = useState(false)
  const [enable, setEnable] = useState(true)



  // Calculate the sum total of all the input fields
  function calculateTotal() {
    const sum = dms + nameResemblance + packageMapping;
    setTotal(sum);
  }

  // Getting all the nodes and mapping through each item
  let nodesDos = selectedProject.elements.nodes.map((node) => {
    return {
      id: node.data.id,
      name: node.data.name,
      module: node.data.module,
      incomompleteProperties: node.data.incomompleteProperties,
    };
  });

  // Getting all the edges (relaciones)
  let edgesDos = nodeHelper.getRelationData(selectedProject);

  // For loop to get the Q and answer
  function calculatelistas(){
    ManageCreateCompositeComponent(user, selectedProject, umbral);
    setComposite(true)
  }

  async function combineMetrics(setRender, render) {
    const q = await ManageCombineMetrics(user, selectedProject, weighing);
    setRender(!render);
    return q
  }

  useEffect(() => {
    setLoader(false);
  }, [selectedProject.elements]);

  useEffect(()=>{

    manageElementsUpdate(
      user,
      selectedProject,
      setSelectedProject,
    );

    edgesDos = nodeHelper.getRelationData(selectedProject);
  },[render])

  useEffect(() => {
    setWeighing({
       dms: dms,
       coupling: umbralCoupling,
       name_resemblance: nameResemblance,
       package_mapping: packageMapping,
     });
    return calculateTotal();
  }, [dms, nameResemblance, packageMapping, umbralCoupling]);



  return (
    <div style={{ height: '80vh', width: '100%', overflow: 'scroll' }}>
      <div className="form-wrapper">
        <form className="form-styles">
          <div className="input">
            <div className="input-align">
              <input
                value={dms}
                onChange={(e) => {
                  e.preventDefault();
                  setDms(+e.target.value);
                  calculateTotal();
                }}
                className="input-styles"
                placeholder="ejm. 15"
                name="dms"
              />
              <label className="input-label">Peso DMS</label>
            </div>
            <div className="input-align">
              <input
                className="input-styles"
                placeholder="ejm. 35"
                name="paquete"
                value={packageMapping}
                onChange={(e) => {
                  e.preventDefault();
                  setPackageMapping(+e.target.value);
                  calculateTotal();
                }}
              />
              <label className="input-label">Peso Mapeo de Paquete</label>
            </div>
            <div className="input-align-umbral">
              <input
                className="input-styles-umbral"
                placeholder="ejm. 0.45"
                name="umbralS"
                value={nameResemblance}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setNameResemblance(Number(e.target.value));
                }}
              />
              <label className="input-label">Peso Semejanza de Nombre</label>
            </div>
            <div className="input-align-umbral">
              <input
                className="input-styles-umbral"
                placeholder="ejm. 0.45"
                name="umbralS"
                value={umbralName}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setUmbralName(Number(e.target.value));
                }}
              />
              <label className="input-label">Umbral Semejanza</label>
            </div>
            <div className="input-align-umbral">
              <input
                className="input-styles-umbral"
                placeholder="ejm. 0.65"
                name="umbralA"
                value={umbralCoupling}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setUmbralCoupling(Number(e.target.value));
                }}
              />
              <label className="input-label">Umbral Acoplamiento</label>
            </div>
            <div className="input-align-umbral">
              <input
                className="input-styles-umbral"
                placeholder="Umbral"
                name="umbralQ"
                value={umbral}
                type="number"
                onChange={(e) => {
                  e.preventDefault();
                  setUmbral(Number(e.target.value));
                }}
              />
              <label className="input-label">Umbral Q</label>
            </div>
          </div>
          <div className="buttons">
            {!loadingMetrics ? (
              <Button
                className="btn-total"
                onClick={async () => {
                  setLoadingMetrics(true);
                  calculateTotal();
                  await ManageMetrics(user, selectedProject, umbralName);
                  setEnable(false);
                  setLoadingMetrics(false);
                }}
              >
                Calcular Metricas
              </Button>
            ) : (
              <Loader />
            )}
            {!loadingComponents ? (
              <Button
                className="btn-total"
                disabled={enable}
                onClick={async () => {
                  setLoadingComponents(true);
                  await combineMetrics(setRender, render);
                  await calculatelistas();
                  // await axios.put('/create_cc_board/', {
                  //  data: {
                  //   user_id: user.uid,
                  //   project_index: selectedProject.projectIndex,
                  //   arch_index: selectedProject.arcIndex,
                  //   ver_index: selectedProject.verIndex,
                  //  }
                  //
                  // });
                  setEnable(true);
                  setLoadingComponents(false);
                }}
              >
                Unir Componentes
              </Button>
            ) : (
              <Loader />
            )}
          </div>
        </form>
      </div>
      <div className="total-sum">
        <p>
          Total:<span>{total}</span>
        </p>
      </div>
      {/* {total <= 100 ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          El total de los pesos no puede ser mayor a 100 —{' '}
          <strong>Vuelve a calcular!</strong>
        </Alert>
      ) : (
        <Alert severity="success">
          <AlertTitle>Calculo Exitoso</AlertTitle>
        </Alert>
      )} */}
      {!loader ? (
        <DataGrid rows={edgesDos} columns={columns1} pageSize={50} />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default EdgesTable;
