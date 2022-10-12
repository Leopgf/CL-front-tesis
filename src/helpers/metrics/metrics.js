import React, { useContext } from "react";
import { putMetrics } from "../../api/metrics/metrics.js";

import AppContext from "../../auth/context/context.js"
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";




const ManageMetrics = async (user, selectedProject, setReloadSidebar) => {  
    setReloadSidebar(true);
    await putMetrics(user,
        selectedProject.projectIndex,
        selectedProject.arcIndex,
        selectedProject.verIndex);
    
      ModalMessage(
        "¡Metricas calculadas con exito!",
        " ",
        "success",
        false,
        4000
      );
    //   window.location.reload()
  };

  export { ManageMetrics };