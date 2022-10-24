import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
// import { putMetrics } from "../../../api/metrics/metrics";

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

/**
 * Componente que representa
 * la tabla de aristas del proyecto selecionado
 */


const EdgesTable = () => {
  const { user, selectedProject, setSelectedProject, elements/*setReloadSidebar*/ } = useContext(AppContext);
  const [loader, setLoader] = useState(true);

  const columns1 = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'source', headerName: 'Origen', width: 180 },
    { field: 'target', headerName: 'Destino', width: 180 },
    { field: 'relation', headerName: 'Relación', width: 150 },
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
    // { field: 'answer', headerName: 'Candidato a Compuesto?', width: 250 },
  ];

  // Getting the values of each input fields
  const [dms, setDms] = useState(15);
  const [nameResemblance, setNameResemblance] = useState(35);
  const [packageMapping, setPackageMapping] = useState(25);
  const [umbralName, setUmbralName] = useState(40);
  const [umbralCoupling, setUmbralCoupling] = useState(65);
  const [umbral, setUmbral] = useState(0.01);
  // const [sum, setSum] = useState(dms + nameResemblance + packageMapping);
  // let total = (dms + nameResemblance + packageMapping)
  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const [weighing, setWeighing ] = useState({
    dms: dms,
    coupling: umbralCoupling,
    name_resemblance: nameResemblance,
    package_mapping: packageMapping
  })
  const [render, setRender] = useState(false)



  // Calculate the sum total of all the input fields
  function calculateTotal() {
    const _sum = dms + nameResemblance + packageMapping;
    setSum(_sum);
    setTotal(sum);
    console.log('Se calcularon las metricas')
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
  }

  async function combineMetrics(setRender, render) {
    const q = await ManageCombineMetrics(user, selectedProject, weighing);
    console.log(q)
    setRender(!render);
    // for (const e in edgesDos) {
    //   console.log(e)
    //   edgesDos[e].q = q[e]
    // }
    return q
  }

  useEffect(() => {
    setLoader(false);
  }, [selectedProject.elements]);

  useEffect(()=>{
    console.log("ENTRO RENDER")
    manageElementsUpdate(
      user,
      selectedProject,
      setSelectedProject,
    );
    console.log("selectedProject.elements.edges")
    console.log(selectedProject.elements.edges);
    edgesDos = nodeHelper.getRelationData(selectedProject);
    console.log("edgesDos STATE")
    console.log(edgesDos);
  },[render])

  useEffect(() => {
    console.log('Calculo de metricas')
    setWeighing({
       dms: dms,
       coupling: umbralCoupling,
       name_resemblance: nameResemblance,
       package_mapping: packageMapping,
     });
    return calculateTotal();
  }, [dms, nameResemblance, packageMapping, umbralCoupling]);
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);


  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <div className="form-wrapper">
        <form className="form-umbral">
          <div className="input-align-umbral">
            <input
              className="input-styles-umbral"
              placeholder="ejm. 0.45"
              name="umbral"
              value={umbralName}
              type="number"
              min="0"
              max="1"
              onChange={(e) => {
                e.preventDefault();
                setUmbralName(Number(e.target.value));
              }}
            />
            <label className="input-label">Umbral Semejanza</label>
          </div>
          <div className="btn-total">
            <Button onClick={calculateTotal} variant="contained">
              Calcular
            </Button>
            <Button onClick={()=>calculatelistas()} variant="contained">
              Calcular222
            </Button>
          </div>
        </form>
        <div className="divider-edges"></div>
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
                name="semejanza"
                value={nameResemblance}
                onChange={(e) => {
                  e.preventDefault();
                  setNameResemblance(+e.target.value);
                  calculateTotal();
                }}
              />
              <label className="input-label">Peso Semejanza de Nombre</label>
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
                name="umbral"
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
                name="umbral"
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
                name="umbral"
                value={umbral}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setUmbral(Number(e.target.value));
                }}
              />
              <label className="input-label">Umbral Q</label>
            </div>
          </div>
          <div>
            <Button onClick={async () => {
              await combineMetrics(setRender, render);
              // console.log("edgesDos")
              // console.log(edgesDos);
              // setRender(!render)
              }}>Diferente</Button>
          </div>
          <div className="btn-total">
            <Button
              onClick={() => {
                ManageMetrics(user, selectedProject, umbralName);
              }}
            >
              Calcular Metricas
            </Button>
          </div>
        </form>
      </div>
      <div className="total-sum">
        <p>
          Total:<span>{total}</span>
        </p>
      </div>
      {sum > 100 ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          El total de los pesos no puede ser mayor a 100 —{' '}
          <strong>Vuelve a calcular!</strong>
        </Alert>
      ) : (
        <Alert severity="success">
          <AlertTitle>Calculo Exitoso</AlertTitle>
        </Alert>
      )}
      {!loader ? (
        <DataGrid rows={edgesDos} columns={columns1} pageSize={10} />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default EdgesTable;

