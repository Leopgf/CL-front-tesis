import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";

/**
 * Componente que representa
 * la tabla de aristas del proyecto selecionado
 */
const EdgesTable = () => {
  const { selectedProject } = useContext(AppContext);
  const [loader, setLoader] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "source", headerName: "Origen", width: 200 },
    { field: "target", headerName: "Destino", width: 200 },
    { field: "relation", headerName: "Relación", width: 200 },
    { field: "dms", headerName: "DMS", width: 200 },
    { field: "abstractness", headerName: "Abstractness", width: 200 },
    { field: "coupling", headerName: "Coupling", width: 200 },
  ];

  useEffect(() => {
    setLoader(false);
  }, [selectedProject.elements]);

  return (
    <div style={{ height: 400, width: "100%" }}>
    <button>prueba</button>
      {!loader ? (
        <DataGrid 
          rows={nodeHelper.getRelationData(selectedProject)} 
          columns={columns} 
          pageSize={10} 
        />
      ) : (
        <Loader />
      )}
      <p>prueba</p>
    </div>
  );
};

export default EdgesTable;
