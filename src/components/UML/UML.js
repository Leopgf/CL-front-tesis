import React, {useContext, useEffect, useState} from "react";
import {DiagramComponent, PortVisibility} from "@syncfusion/ej2-react-diagrams";
import AppContext from "../../auth/context/context";
import Swal from "sweetalert2";

function UML({setShowUml}) {
    const {
        selectedProject,
    } = useContext(AppContext);
    const [nodes, setNodes] = useState([])
    const [connectors, setConnectors] = useState([])

    useEffect(() => {
        renderNodesUML()
        // renderConnectorUML()
    }, [])

    useEffect(() => {

    }, [nodes])

    const renderNodesUML = () => {
        let nodos = []
        selectedProject.elements.list_t.map((node) => {
            let members = []
            node.composite_component.map((component) => {
                // let member = {
                //     name: component
                // }
                members.push(component + "\n")
            })
            let object = {
                id: node.name,
                style: {
                    fill: 'white',
                    strokeColor: '#000'
                },
                annotations: [{
                    content: node.name + "\n" + members.toString().replaceAll(",", "")
                }],
                offsetX: node.offsetX,
                offsetY: node.offsetY,
                ports: [{
                    id: "port" + node.name,
                    offset: {
                        x: 1,
                        y: 0.5
                    },
                    visibility: PortVisibility.Visible,
                    //Set the style for the port
                    style: {
                        fill: 'red',
                        strokeWidth: 2,
                        strokeColor: 'black'
                    },
                    width: 12,
                    height: 12,
                    // Sets the shape of the port as Circle
                    shape: 'Circle'
                }]
            }
            nodos.push(object)
        })
        setNodes(nodos)
        renderConnectorUML(nodos)
    }

    const renderConnectorUML = (nodesData) => {
        let conectores = []
        const nodesStatic = selectedProject.elements.list_t
        selectedProject.elements.list_t.map((node) => {
            console.log("NODOSSS")
            console.log(node)
            node.provided_interfaces?.map((provided) => {
                nodesStatic.map((nodos) => {
                    nodos.required_interfaces?.map((required) => {
                        if (required == provided) {
                            let exist = false
                            conectores?.map((connect) => {
                                if (connect.sourcePoint.x == node.offsetX && connect.targetPoint.x == nodos.offsetX) {
                                    exist = true
                                }
                            })
                            if (!exist) {
                                let nodoSource = nodesData.find((nodeData)=> nodeData.id == node.name)
                                let nodoTarget = nodesData.find((nodeData)=> nodeData.id == nodos.name)
                                let object = {
                                    id: "connector" + conectores.length,
                                    //Define connector start and end points
                                    sourcePoint: {x: node.offsetX, y: node.offsetY},
                                    targetPoint: {x: nodos.offsetX, y: nodos.offsetY},
                                    sourceID: nodoSource.id,
                                    targetID: nodoTarget.id,
                                    sourcePortID: nodoSource.ports[0].id,
                                    targetPortID: nodoTarget.ports[0].id,
                                    type: "Straight",
                                    shape: {
                                        type: "UmlClassifier",
                                        //Set an relationship for connector
                                        relationship: "Inheritance"
                                    }
                                }
                                conectores.push(object)
                            }
                        }
                    })

                })
            })
        })
        console.log("CONECTORES??")
        console.log(conectores)
        setConnectors(conectores)
    }

    return (
        <div style={{height: 'auto', overflow: 'scroll'}}>
            {selectedProject ?
                <DiagramComponent id="container" width={'100%'} height={'600px'}
                                  nodes={nodes} connectors={connectors}/>
                :
                Swal.fire({
                    text: "Debe seleccionar una arquitectura",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "var(--success)",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setShowUml(false)
                    }
                })
            }

        </div>
    );
}

export default UML;
