// @ts-nocheck
import axios from "axios";
import jwt from "jwt-encode";

const url = "/metricas/";

/**
 * Editar el nombre de una versión en la base de datos
 * @param {JSON} user objeto con la información del usuario
 * @param {Integer} projectIndex índice del proyecto
 * @param {Integer} arcIndex índice de la arquitectura
 * @param {Integer} verIndex índice de la versión
 * @param {Integer} nameResemblanceUmbral nombre de la versión
 * @returns versiones de una arquitectura de un proyecto
 * del usuario o error
 */
// const putMetrics = async (user, projectIndex, arcIndex, verIndex, nameResemblanceUmbral) => {
//     const putMetrics = {
//         user_id: user.uid,
//         project_index: projectIndex,
//         arch_index: arcIndex,
//         ver_index: verIndex,
//         name_ressemblance_umbral: nameResemblanceUmbral,
//     };
//     try {
//         const response = await axios.put(url, {
//             setMetrics: putMetrics,
//         });
//         return response.data;

//     } catch (error) {
//         return error.response.status;
//     }
// }

const putMetrics = async (user, projectIndex, arcIndex, verIndex, name_ressemblance_umbral) => {
    const putMetrics = {
         user_id: user.uid,
         project_index: projectIndex,
         arch_index: arcIndex,
         ver_index: verIndex,
         name_ressemblance_umbral: name_ressemblance_umbral,
   }

   const token = jwt(putMetrics, 'secret');

    try {
        const response = await axios.put(url, {
            token: token
        });
        return response.data;
    } catch (error) {
        return error.response.status;
    }
};

const combineMetrics = async (user, projectIndex, arcIndex, verIndex, weighing) => {
  const combine_metrics = {
    user_id: user.uid,
    project_index: projectIndex,
    arch_index: arcIndex,
    ver_index: verIndex,
    weighing: {
      dms: weighing.dms,
      coupling: weighing.coupling,
      name_resemblance: weighing.name_resemblance,
      package_mapping: weighing.package_mapping,
    },
  };

  try {
    const res = await axios.put('/combine-metrics/', {
      data: combine_metrics
    });
    return res.data
  }catch (err){
    return err.res.status
  }
}

const compositeComponets = async(
  user,
  projectIndex,
  arcIndex,
  verIndex,
  umbral_q
) => {
  const create_composite_component = {
    user_id: user.uid,
    project_index: projectIndex,
    arch_index: arcIndex,
    ver_index: verIndex,
    umbral_q
}
 try {
    const res = await axios.put('/composite-component/', {
      data: create_composite_component,
    });
    console.log(res)
    console.log(res.data)
    return res.data
  }catch (err){
    return err.res.status
  };
}

export {
    putMetrics, combineMetrics, compositeComponets
}
