import React, {useContext, useEffect, useState} from "react";
import {DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton,} from '@mui/x-data-grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import Swal from "sweetalert2";

import AppContext from "../../../auth/context/context";
import Loader from "../../Loader/Loader";
import nodeHelper from "../../../helpers/nodes/nodes";
import axios from "axios";
import {postUpdatedElements} from "../../../api/elements/elements";
import {manageElementsUpdate, manageUpdatedResponse} from "../../../helpers/elements/elements";
import Button from "@material-ui/core/Button";

/**
 * Componente que representa
 * la tabla de nodos del proyecto selecionado
 */
const CompositeComponentTable = (props) => {
    const {
        user,
        selectedProject,
        selectedNodes,
        setSelectedNodes,
        selectionModel,
        setSelectionModel,
        setSelectedProject,
        cy,
    } = useContext(AppContext);
    let [loader, setLoader] = useState(true);
    const [loadingComponents, setLoadingComponents] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        manageElementsUpdate(user, selectedProject, setSelectedProject);

    }, [render]);

    let rows = selectedProject.elements.list_t.map((list, index) => {
        return {
            id: index,
            name: list.name ? list.name : '-',
            color: list.bg ? list.bg : '-',
            nodes: list.composite_component ? list.composite_component.join(" ") : '-',
            required_interface: list.required_interfaces
                ? list.required_interfaces
                : '-',
            provided_interface: list.provided_interfaces
                ? list.provided_interfaces
                : '-',
            description: list.description ? list.description : '-',
        };
    });

    const columns = [
        {field: 'name', headerName: 'Nombre', width: 98},
        {
            field: 'color', headerName: 'Color', width: 98,
            renderCell: (params) => {
                return (
                    <>
                        <Button style={{backgroundColor: params.getValue(params.id, "color")}}/>
                    </>
                );
            }
        },
        {field: 'nodes', headerName: 'Nodos', width: 200},
        {
            field: 'required_interface',
            headerName: 'Interfaz Requerida',
            width: 130,
        },
        {
            field: 'provided_interface',
            headerName: 'Interfaz provista',
            width: 230,
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 150,
        },
        {
            field: 'action',
            headerName: 'Cambiar descripción de Componente Compuesto',
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
                                    props.closeDrawable(false);
                                    onClick(e, params);
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
        let name = '';

        console.log(params.getValue(params.id, 'name'));

        api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach((c) => {
                thisRow[c.field] = params.getValue(params.id, c.field);
                console.log(c.field);
                if (c.field == 'name') {
                    name = params.getValue(params.id, c.field);
                }
            });

        return Swal.fire({
            title: 'Inserte la descripción del componente compuesto ' + name,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            showLoaderOnConfirm: true,
            preConfirm: async (description) => {
                console.log("description");
                console.log(description);

                const res = await axios.put('/edit_cc_description/', {
                    data: {
                        user_id: user.uid,
                        project_index: selectedProject.projectIndex,
                        arch_index: selectedProject.arcIndex,
                        ver_index: selectedProject.verIndex,
                        name: name,
                        description: description,
                    },
                });

                return res.data;
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
            console.log('result');
            console.log(result);
            if (result.isConfirmed) {
                if (result.value.ok) {
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

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton onResize={undefined} nonce={undefined} onResizeCapture={undefined}/>
                <GridToolbarFilterButton nonce={undefined} onResize={undefined} onResizeCapture={undefined}/>
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <div>

                {!loadingComponents ? (
                    <Button
                        className="btn-total"
                        onClick={async () => {
                            setLoadingComponents(true);
                            await axios.put('/create_cc_board/', {
                                data: {
                                    user_id: user.uid,
                                    project_index: selectedProject.projectIndex,
                                    arch_index: selectedProject.arcIndex,
                                    ver_index: selectedProject.verIndex,
                                }

                            });
                            setRender(!render)
                            setLoadingComponents(false);
                        }}
                    >
                        Calcular Interfaces
                    </Button>
                ) : (
                    <Loader />
                )}
            </div>
            <div style={{ height: '100vh', width: '100%' }}>
                {!loader ? (


                    <DataGrid
                        rows={rows}
                        getEstimatedRowHeight={() => 300}
                        getRowHeight={() => 'auto'}
                        components={{ Toolbar: CustomToolbar }}
                        sx={{
                            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                                py: 1,
                            },
                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                                py: '15px',
                            },
                            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                                py: '22px',
                            },
                        }}
                        columns={columns}
                        pageSize={50}
                        onCellClick={(params) => {
                            nodeHelper.manageCellClick(
                                params.row.name,
                                selectedNodes,
                                setSelectedNodes,
                                cy,
                                setSelectionModel
                            );
                        }}
                        onColumnHeaderClick={(param) => {
                            if (param.field === '_check_') {
                                nodeHelper.manageCheckSelection(
                                    selectedNodes,
                                    setSelectedNodes,
                                    cy,
                                    setSelectionModel
                                );
                            }
                        }}
                        selectionModel={selectionModel}
                    />
                ) : (
                    <Loader />
                )}
            </div>
        </>

    );
};

export default CompositeComponentTable;
