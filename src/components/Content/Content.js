import React, { useContext, useState, useEffect } from "react";
import "./Content.css";

import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import AppContext from "../../auth/context/context";
import CytoscapeComponent from "react-cytoscapejs";
import Loader from "../Loader/Loader";
import nodesHelper from "../../helpers/nodes/nodes";

/**
 * Componente que representa el contenido
 * de la arquitectura seleccionada
 */
const Content = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [elementos, setElementos] = useState();
  const [load, setLoad] = useState(false);
  const {
    selectedProject,
    cy,
    setCy,
    selectedNodes,
    setSelectedNodes,
    setSelectionModel,
  } = useContext(AppContext);

  /** Creacion de capa de estilos para el grafo segun Cytoscape */
  var state = {
    layout: {
      name: "circle",
      fit: true,
      padding: 30,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true,
      avoidOverlapPadding: 150,
    },
    stylesheet: [
      {
        selector: "node",
        style: {
          content: "data(id)",
          "font-size": 20,
          shape: "round-rectangle",
          "text-wrap": "wrap",
          "text-max-width": 80,
          "text-valign": "center",
          color: "#fff",
          "text-outline-color": "#18202C",
          width: 270,
          color: "white",
          height: 40,
          "background-color": "#18202C",
        },
      },
      {
        selector: "edge",
        style: {
          content: function (ele) {
            return checked ? ele.scratch("relation") === "implements"
              ? "Implementa"
              : "Extiende" : "";
          },
          width: 4,
          "font-size": 20,
          "curve-style": "bezier",
          "edge-text-rotation": "autorotate",
          "target-arrow-shape": "triangle-tee",
          "text-valign": "top",
          "text-halign": "center",
          color: "#fff",
          "text-outline-color": "#18202C",
          "text-outline-width": 3,
          "line-color": "#18202C",
          "target-arrow-color": "#18202C",
        },
      },
    ],
  };

  /**
   * Mostrar u ocultar el nombre de las
   * relaciones entre los nodos
   */
  const setEdgesLabel = () => {
    if (!checked) {
      cy.style().selector("edge").style({
        content: "",
      });
    } else {
      cy.style()
        .selector("edge")
        .style({
          content: function (ele) {
            return ele.scratch("relation") === "implements"
              ? "Implementa"
              : "Extiende";
          },
        });
    }
  };

  /**
   * Manejador de evento al seleccionar nodo
   * @param {Event} event referencia al elemento
   */
  const selectNodeHandler = (evt) => {
    const nodeId = evt["target"]["_private"]["data"].id;
    nodesHelper.addNode(
      nodeId,
      selectedNodes,
      setSelectedNodes,
      cy,
      setSelectionModel
    );
    // cy.animate(
    //   {
    //     fit: {
    //       eles: cy.getElementById(nodeId),
    //       padding: 30,
    //     },
    //   },
    //   {
    //     duration: 100,
    //   }
    // );
    evt.preventDefault();
  };

  /**
   * Manejador de evento al dejar de seleccionar nodo
   * @param {Event} event referencia al elemento
   */
  const unselectNodeHandler = (evt) => {
    const nodeId = evt["target"]["_private"]["data"].id;
    // cy.fit();
    nodesHelper.removeNode(
      nodeId,
      selectedNodes,
      setSelectedNodes,
      cy,
      setSelectionModel
    );
    nodesHelper.repaintEdges(selectedNodes, cy);
  };

  useEffect(() => {
    if (cy) {
      cy.on("select", "node", selectNodeHandler);
      cy.on("unselect", "node", unselectNodeHandler);
      setSelectionModel([]);
      setSelectedNodes(new Set());
    }
  }, [cy]);

  useEffect(() => {
    if (cy) {
      setEdgesLabel();
    }
  }, [checked, cy]);

  useEffect(() => {
    setLoad(true);
    setElementos(selectedProject.elements);
    console.log(selectedProject.elements);
  }, [selectedProject]);

  useEffect(() => {
    if (load) {
      setLoad(false);
      setChecked(false);
    }
  }, [elementos, load]);

  return (
    <>
      {load ? (
        <Loader />
      ) : elementos ? (
        <div>
          <div className={classes.onClose}>
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={() => setChecked((prev) => !prev)}
                />
              }
              labelPlacement="start"
              style={{ marginRight: 5 }}
            />
          </div>

          <CytoscapeComponent
            id="component"
            zoom={0.5}
            maxZoom={2}
            elements={CytoscapeComponent.normalizeElements(elementos)}
            className="component"
            layout={state.layout}
            stylesheet={state.stylesheet}
            pan={{ x: 150, y: 30 }}
            cy={(cyt) => {
              setCy(cyt);
            }}
          />
        </div>
      ) : null}
    </>
  );
};

/** Creacion de capa de estilos para el componente */
const useStyles = makeStyles((theme) => ({
  onClose: {
    position: "absolute",
    right: "18px",
    top: "75px",
    zIndex: 3,
  },
}));

export default Content;
