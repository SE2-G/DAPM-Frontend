import { addEdge as addFlowEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, MarkerType, Node, NodeChange } from "reactflow";

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EdgeData, NodeData, NodeState, PipelineData, PipelineState } from "../states/pipelineState";

export const initialState: PipelineState = {
  pipelines: [],
  activePipelineId: "",
  history: {
    past: [],
    future: []
  }
}

const takeSnapshot = (state: PipelineState) => {
  var activePipeline = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)
  if (!activePipeline) return
  console.log("snapshot taken", activePipeline.flowData.nodes, activePipeline.flowData.edges)
  state.history.past.push({nodes: activePipeline.flowData.nodes, edges: activePipeline.flowData.edges})
}

const pipelineSlice = createSlice({
  name: 'pipelines',
  initialState: initialState,
  reducers: {
    addNewPipeline: (state, { payload }: PayloadAction<{ id: string, flowData: NodeState }>) => {
      state.pipelines.push({ id: payload.id, name: 'unnamed pipeline', flowData: payload.flowData } as PipelineData)
      state.activePipelineId = payload.id
    },
    setActivePipeline: (state, { payload }: PayloadAction<string>) => {
      state.activePipelineId = payload
    },
    setImageData: (state, { payload }: PayloadAction<{ id: string, imgData: string }>) => {
      var pipeline = state.pipelines.find(pipeline => pipeline.id === payload.id)
      if (!pipeline) return
      pipeline.imgData = payload.imgData
    },

    // actions for undo and redo

    undo(state){
      var activePipeline = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)
      if (!activePipeline) return
      const pastState = state.history.past.pop()
      if (!pastState) return

      console.log("undo", pastState)
      state.history.future.push({nodes: activePipeline.flowData.nodes, edges: activePipeline.flowData.edges})
      activePipeline.flowData.nodes = pastState.nodes
      activePipeline.flowData.edges = pastState.edges
    },
    redo(state){
      var activePipeline = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)
      if (!activePipeline) return
      const futureState = state.history.future.pop()
      if (!futureState) return

      console.log("redo", futureState.nodes, futureState.edges)
      activePipeline.flowData.nodes = futureState.nodes
      activePipeline.flowData.edges = futureState.edges
    },
    createSnapShot(state){
      takeSnapshot(state)
    },
    // takeSnapshot(state){
    //   var activePipeline = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)
    //   if (!activePipeline) return
    //   state.history.past.push({nodes: activePipeline.flowData.nodes, edges: activePipeline.flowData.edges})
    // },
    canUndo(state){

    },
    canRedo(state){

    },
    
    // actions for the active pipeline
    
    updatePipelineName: (state, { payload }: PayloadAction<string>) => {
      var activePipeline = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)
      if (!activePipeline) return
      activePipeline!.name = payload
    },
    addHandle: (state, { payload }: PayloadAction<string>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      activeFlowData?.nodes.find(node => node.id === payload)?.data?.templateData?.sourceHandles.push({ type: 'source', id: "1" })
    },
    updateSourceHandle: (state, { payload }: PayloadAction<{ nodeId?: string, handleId?: string, newType?: string }>) => {
      const { nodeId, handleId, newType } = payload;
      // Find the active pipeline based on the activePipelineId
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      
      if (!activeFlowData) return; // Early exit if no active pipeline is found
    
      // Find the node within the active pipeline's flowData that matches the nodeId
      const targetNode = activeFlowData.nodes.find(node => node.id === nodeId);

      if (!targetNode) return; // Early exit if no matching node is found
    
      // Initialize templateData and sourceHandles if they are not defined
      if (!targetNode.data.templateData?.sourceHandles) return; // Early exit if templateData or sourceHandles are not defined
    
      // Find the handle to update within the sourceHandles
      const handleToUpdate = targetNode.data.templateData.sourceHandles.find(handle => handle.id === handleId);
    
      if (!handleToUpdate) return; // Early exit if no matching handle is found

      // Update the handle's type
      handleToUpdate.type = newType;
    },
    updateTargetHandle: (state, { payload }: PayloadAction<{ nodeId?: string, handleId?: string, newType?: string }>) => {
      const { nodeId, handleId, newType } = payload;
      // Find the active pipeline based on the activePipelineId
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      
      if (!activeFlowData) return; // Early exit if no active pipeline is found
    
      // Find the node within the active pipeline's flowData that matches the nodeId
      const targetNode = activeFlowData.nodes.find(node => node.id === nodeId);

      if (!targetNode) return; // Early exit if no matching node is found
    
      // Initialize templateData and sourceHandles if they are not defined
      if (!targetNode.data.templateData?.targetHandles) return; // Early exit if templateData or sourceHandles are not defined
    
      // Find the handle to update within the sourceHandles
      const handleToUpdate = targetNode.data.templateData.targetHandles.find(handle => handle.id === handleId);
    
      if (!handleToUpdate) return; // Early exit if no matching handle is found

      // Update the handle's type
      handleToUpdate.type = newType;
    },
    
    updateNode: (state, { payload }: PayloadAction<Node<NodeData> | undefined>) => {
      if (!payload) return
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      const index = activeFlowData?.nodes.findIndex(node => node.id === payload.id)
      activeFlowData.nodes[index] = payload
    },
    addNode: (state, { payload }: PayloadAction<Node>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      
      activeFlowData.nodes.push(payload)
    },
    removeNode: (state, { payload }: PayloadAction<Node<NodeData>>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      //takeSnapshot(state)

      activeFlowData.nodes = activeFlowData.nodes.filter(node => node.id !== payload.id && node.parentNode !== payload.id)
      activeFlowData.edges = activeFlowData.edges.filter(edge =>
        !payload.data?.templateData?.sourceHandles.find(data => data.id === edge.sourceHandle) &&
        !payload.data?.templateData?.targetHandles.find(data => data.id === edge.targetHandle))
    },
    removeEdge: (state, { payload }: PayloadAction<Edge>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      //takeSnapshot(state)

      activeFlowData!.edges = activeFlowData?.edges.filter(edge => edge.id !== payload.id)
    },
    // addEdge: (state, { payload }: PayloadAction<Edge>) => {
    //   var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
    //   if (!activeFlowData) return

    //   activeFlowData.edges.push({ ...payload, markerEnd: {
    //     type: MarkerType.ArrowClosed,
    //     width: 20,
    //     height: 20,
    //     color: '#FF0072',
    //   } })
    // },
    updateEdge: (state, { payload }: PayloadAction<Edge<EdgeData> | undefined>) => {
      if (!payload) return
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      const index = activeFlowData.edges.findIndex(edge => edge.id === payload.id)
      activeFlowData.edges[index] = payload
    },
    // From react flow example
    onNodesChange: (state, { payload }: PayloadAction<NodeChange[]>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return

      activeFlowData.nodes = applyNodeChanges(payload, activeFlowData.nodes);
    },
    onEdgesChange: (state, { payload }: PayloadAction<EdgeChange[]>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return

      activeFlowData.edges = applyEdgeChanges(payload, activeFlowData.edges);
    },
    onConnect: (state, { payload }: PayloadAction<Connection>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return
      takeSnapshot(state)

      activeFlowData.edges = addFlowEdge({ ...payload, markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: 'white',
      } , style: { stroke: 'white', strokeOpacity: 1, strokeWidth: "2px" } }, activeFlowData.edges);
    },
    setNodes: (state, { payload }: PayloadAction<Node[]>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return

      activeFlowData.nodes = payload;
    },
    setEdges: (state, { payload }: PayloadAction<Edge[]>) => {
      var activeFlowData = state.pipelines.find(pipeline => pipeline.id === state.activePipelineId)?.flowData
      if (!activeFlowData) return

      activeFlowData.edges = payload;
    },
  },
})

export const { 
  //actions for all pipelines
  addNewPipeline, 
  setActivePipeline, 
  setImageData, 
  
  // actions for undo and redo
  undo,
  redo,
  createSnapShot,
  canUndo,
  canRedo,

  // actions for the active pipeline
  updateSourceHandle,
  updateTargetHandle,
  updatePipelineName, 
  addHandle, 
  updateNode, 
  addNode, 
  removeNode, 
  removeEdge, 
  // addEdge, 
  updateEdge, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  setNodes, 
  setEdges 
} = pipelineSlice.actions

export default pipelineSlice.reducer 
