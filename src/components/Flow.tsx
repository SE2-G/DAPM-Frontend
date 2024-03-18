import React, { useCallback, useRef } from "react"
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Controls,
  useReactFlow
} from "reactflow";

import CustomNode from "./Nodes/CustomNode";

import "reactflow/dist/style.css";
import styled from "styled-components";
import DataSourceNode from "./Nodes/DataSourceNode";
import DataSinkNode from "./Nodes/DataSinkNode";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    data: { label: "Custom node" },
    position: { x: 250, y: 5 }
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" }
];

const nodeTypes = {
  custom: CustomNode,
  dataSource: DataSourceNode,
  dataSink: DataSinkNode,
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: #333;
`;

let id = 0;
const getId = () => `dndnode_${id++}`;


const BasicFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlow = useReactFlow();


  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const {type, data} = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${data}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlow],
  );
  


  return (
    <ReactFlowStyled
      style={{ flexGrow: 1}}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} color="#d9d9d9"/>
      <Controls />
    </ReactFlowStyled>
  );
};

export default BasicFlow;
