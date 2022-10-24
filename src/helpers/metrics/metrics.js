import React, { useContext } from "react";
import {
  putMetrics,
  combineMetrics,
  compositeComponets,
} from '../../api/metrics/metrics.js';

import AppContext from "../../auth/context/context.js"
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";




const ManageMetrics = async (user, selectedProject, umbralName) => {
    // setReloadSidebar(true);
        await putMetrics(user,
        selectedProject.projectIndex,
        selectedProject.arcIndex,
        selectedProject.verIndex,
        umbralName);
      // ModalMessage(
      //   "¡Metricas calculadas con exito!",
      //   " ",
      //   "success",
      //   false,
      //   4000
      // );
    //window.location.reload()
  };


  const ManageCombineMetrics = async (user, selectedProject, weighing) => {
    await combineMetrics(
      user,
      selectedProject.projectIndex,
      selectedProject.arcIndex,
      selectedProject.verIndex,
      weighing
    );
  }

  const ManageCreateCompositeComponent = async (user, selectedProject, umbral_q) => {
    await compositeComponets (
      user,
      selectedProject.projectIndex,
      selectedProject.arcIndex,
      selectedProject.verIndex,
      umbral_q
    )
  }

  export { ManageMetrics, ManageCombineMetrics, ManageCreateCompositeComponent};
