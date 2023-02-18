import React, { useContext, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/Add';
import Swal from "sweetalert2";

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";
import axios from "axios";
import { postUpdatedElements } from "../../../api/elements/elements";
import { manageUpdatedResponse } from "../../../helpers/elements/elements";

/**
 * Componente que representa
 * la tabla de nodos del proyecto selecionado
 */
const NodesTable = (props) => {
  const {
    user,
    selectedProject,
    selectedNodes, setSelectedNodes,
    selectionModel, setSelectionModel,
    setSelectedProject,
    cy
  } = useContext(AppContext);
  let [loader, setLoader] = useState(true);

  let rows = selectedProject.elements.nodes.map(node => {
    return { id: node.data.id, name: node.data.name,
             isInterface: !node.data.incomompleteProperties ? node.data.isInterface ? 'Si' : 'No' : '-',
             isAbtsract: node.data.hasOwnProperty('isAbstract') ? node.data.isAbtsract ? 'Si' : 'No' : '-',
             module: node.data.hasOwnProperty('module') ? node.data.module : "-",
             incomompleteProperties: node.data.incomompleteProperties ? "No" : "Si",
            composite:node.data.hasOwnProperty('composite') ? node.data.composite : "-" };
  });

  const columns = [
    { field: 'name', headerName: 'Nombre', width: 230 },
    { field: 'isInterface', headerName: 'Es Interfaz?', width: 160 },
    { field: 'isAbstract', headerName: 'Es Abstracto?', width: 165 },
    { field: 'module', headerName: 'Modulo', width: 130 },
    {
      field: 'incompleteProperties',
      headerName: 'Propiedades Completas',
      width: 230,
    },
    { field: 'composite', headerName: 'Componente Compuesto', width: 235 },
    {
      field: 'action',
      headerName: 'Cambiar Nombre del Componente Compuesto / Cambiar el Nodo de Componente Compuesto',
      sortable: false,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton aria-label="edit" size="large">
              <EditIcon
                fontSize="inherit"
                color="secondary"
                onClick={(e) => {
                  props.closeDrawable(false)
                  onClick(e, params)}
                }
              />
            </IconButton>
            <IconButton aria-label="add" size="large">
              <AddIcon
                fontSize="inherit"
                color="primary"
                onClick={(e) => {
                  props.closeDrawable(false);
                  onClickAdd(e, params);
                }}
              />
            </IconButton>
          </>
        );
      },
    },
  ];

  const onClick = async (e, params) => {
    e.stopPropagation(); // don't select this row after clicking

    const api = params.api;
    const thisRow = {};
    let name = ""

    api
      .getAllColumns()
      .filter((c) => c.field !== '__check__' && !!c)
      .forEach((c) => {thisRow[c.field] = params.getValue(params.id, c.field)
        console.log(c.field);
        if(c.field == "composite"){
          name = params.getValue(params.id, c.field);
        }}
      );

     return Swal.fire({
       title: 'Inserte nombre del componente compuesto ' + name,
       input: 'text',
       inputAttributes: {
         autocapitalize: 'off',
       },
       showCancelButton: true,
       confirmButtonText: 'Guardar',
       showLoaderOnConfirm: true,
       preConfirm: async (compositeComponent) => {
         console.log('compositeComponent', name);
         const res = await axios.put('/edit_cc_name/', {
           data: {
             user_id: user.uid,
             project_index: selectedProject.projectIndex,
             arch_index: selectedProject.arcIndex,
             ver_index: selectedProject.verIndex,
             old_name: name,
             new_name: compositeComponent,
           },
         });

         return res.data;
       },
       allowOutsideClick: () => !Swal.isLoading(),
     }).then(async (result) => {
       console.log('result');
       console.log(result);
       if(result.isConfirmed){
        if (result.value.ok) {
          const formData = new FormData();
          formData.append('user_id', user.uid);
          formData.append('ver_index', selectedProject.verIndex);
          formData.append('arc_index', selectedProject.arcIndex);
          formData.append('project_index', selectedProject.projectIndex);

          const response = await postUpdatedElements (formData);
          console.log("responseeeeeee")
          console.log(response)
          manageUpdatedResponse(response, selectedProject,   setSelectedProject);

          Swal.fire('Cambiado con éxito!', '', 'success');
        }
     }
    });
  };

  const onClickAdd = async (e, params) => {
    e.stopPropagation(); // don't select this row after clicking

    const api = params.api;
    const thisRow = {};
    let id = ""
    let options = {}

    api
      .getAllColumns()
      .filter((c) => c.field !== '__check__' && !!c)
      .forEach((c) => {thisRow[c.field] = params.getValue(params.id, c.field)
        console.log(c.field);
        if(c.field == "name"){
          id = params.getValue(params.id, c.field);
        }}
      );

      selectedProject.elements.list_t.map((list_t) => {
        options[list_t.name] = list_t.name;
      })

      console.log("options");
      console.log(options);

     return Swal.fire({
       title: 'Inserte nombre del componente compuesto ',
       input: 'select',
       inputOptions: options,
       showCancelButton: true,
       confirmButtonText: 'Guardar',
       showLoaderOnConfirm: true,
       preConfirm: async (compositeComponent) => {
         const res = await axios.put('/edit_node_cc/', {
           data: {
             user_id: user.uid,
             project_index: selectedProject.projectIndex,
             arch_index: selectedProject.arcIndex,
             ver_index: selectedProject.verIndex,
             node: id,
             new_name: compositeComponent,
           },
         });

         return res.data;
       },
       allowOutsideClick: () => !Swal.isLoading(),
     }).then(async (result) => {
      //  console.log('result');
       console.log(result);
       if(result.isConfirmed){
        if (result.value.ok) {
         // selectedProject.elements.nodes[];
         const formData = new FormData();
         formData.append('user_id', user.uid);
         formData.append('ver_index', selectedProject.verIndex);
         formData.append('arc_index', selectedProject.arcIndex);
         formData.append('project_index', selectedProject.projectIndex);

         const response = await postUpdatedElements(formData);
         console.log('responseeeeeee');
         console.log(response);
         manageUpdatedResponse(response, selectedProject, setSelectedProject);

         Swal.fire('Cambiado con éxito!', '', 'success');
       }
       }

     });
  };


  useEffect(() => {
    setLoader(false);
  }, [selectedProject.elements]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {!loader ? (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          checkboxSelection
          onCellClick={params => {
            nodeHelper.manageCellClick(params.row.name, selectedNodes, setSelectedNodes, cy, setSelectionModel);
          }}
          onColumnHeaderClick={param => {
            if (param.field === '__check__') {
              nodeHelper.manageCheckSelection(selectedNodes, setSelectedNodes, cy, setSelectionModel);
            }
          }}
          selectionModel={selectionModel}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default NodesTable;
