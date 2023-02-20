import React, {useContext, useEffect, useState} from "react";
import {DiagramComponent} from "@syncfusion/ej2-react-diagrams";
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
        renderConnectorUML()
    }, [])

    useEffect(() => {

    }, [nodes])

    const renderNodesUML = () => {
        let nodos = []
        selectedProject.elements.list_t.map((node) => {
            let members = []
            node.composite_component.map((component) => {
                let member = {
                    name: component
                }
                members.push(member)
            })
            let object = {
                id: node.name,
                shape: {
                    type: 'UmlClassifier',
                    enumerationShape: {
                        name: node.name,
                        members: members
                    },
                    classifier: 'Enumeration'
                },
                offsetX: node.offsetX,
                offsetY: node.offsetY
            }
            nodos.push(object)
        })
        setNodes(nodos)
    }

    const renderConnectorUML = () => {
        let conectores = []
        const nodesStatic = selectedProject.elements.list_t
        selectedProject.elements.list_t.map((node) => {
            console.log("NODOSSS")
            console.log(node)
            node.provided_interfaces?.map((provided) => {
                nodesStatic.map((nodos) => {
                    nodos.required_interfaces?.map((required) => {
                        console.log("REQUIRED")
                        console.log(required)
                        console.log(provided)
                        if (required == provided) {
                            let exist = false
                            conectores?.map((connect) => {
                                if (connect.sourcePoint.x == node.offsetX && connect.targetPoint.x == nodos.offsetX) {
                                    exist = true
                                }
                            })
                            if (!exist) {
                                console.log("PASO?")
                                console.log(node.offsetX, node.offsetY)
                                console.log(nodos.offsetX, nodos.offsetY)
                                let object = {
                                    id: "connector" + conectores.length,
                                    //Define connector start and end points
                                    sourcePoint: {x: node.offsetX, y: node.offsetY},
                                    targetPoint: {x: nodos.offsetX, y: nodos.offsetY},
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
