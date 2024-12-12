import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PipelineCard from './PipelineCard';
import { Button, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPipeline, setImageData } from '../../redux/slices/pipelineSlice';
import { getPipelines } from '../../redux/selectors';
import FlowDiagram from './ImageGeneration/FlowDiagram';
import ReactDOM from 'react-dom';
import { toPng } from 'html-to-image';
import { Edge, Node } from 'reactflow';
import { getNodesBounds, getViewportForBounds } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { PipelineState, NodeState, EdgeData, NodeData } from '../../redux/states/pipelineState';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AutoGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pipelines = useSelector(getPipelines);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const createNewPipeline = () => {
    dispatch(addNewPipeline({ id: `pipeline-${uuidv4()}`, flowData: { nodes: [], edges: [] } }));
    navigate("/pipeline");
  };

  // const isTemplate = (pipeline: { nodes: { type: string; instantiationData?: any }[]; edges: { type: string; instantiationData?: any }[] }) => {
  //   return pipeline.nodes.every((node: { type: string; instantiationData?: any }) => node.type === 'Template' && !node.instantiationData) &&
  //          pipeline.edges.every((edge: { type: string; instantiationData?: any }) => edge.type === 'Template' && !edge.instantiationData);
  // };

  const isTemplate = (pipeline: NodeState) => {
    // 检查所有节点是否为模板节点
    const allNodesAreTemplates = pipeline.nodes.every((node: Node<NodeData>) => {
      // 节点类型为模板且 instantiationData 为 undefined 或是一个空对象
      const instantiationDataEmpty =
        !node.data.instantiationData ||
        Object.keys(node.data.instantiationData).length === 0;
  
      return node.data.templateData && instantiationDataEmpty;
    });
  
    // 检查所有边是否为模板边
    const allEdgesAreTemplates = pipeline.edges.every((edge: Edge<EdgeData>) => {
      // 边的 filename 属性未定义或为空
      return !edge.data?.filename;
    });
  
    return allNodesAreTemplates && allEdgesAreTemplates;
  };
  

  

  const templates = pipelines.filter(({ pipeline }: { pipeline: { nodes: any[]; edges: any[] } }) => isTemplate(pipeline));
  const instances = pipelines.filter(({ pipeline }: { pipeline: { nodes: any[]; edges: any[] } }) => !isTemplate(pipeline));

  const renderPipelinePreview = (pipelineList: { id: string; name: string; imgData: string }[]) => {
    return pipelineList.map(({ id, name, imgData }) => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={id}>
        <PipelineCard id={id} name={name} imgData={imgData}></PipelineCard>
      </Grid>
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, flexBasis: "100%" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => createNewPipeline()}
        sx={{ backgroundColor: "#bbb", "&:hover": { backgroundColor: "#eee" }, marginBlockStart: "10px" }}
      >
        Create New
      </Button>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ marginBlockStart: "20px" }}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Templates" />
        <Tab label="Instances" />
      </Tabs>

      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ padding: "10px" }}>
        {activeTab === 0 && renderPipelinePreview(templates)}
        {activeTab === 1 && renderPipelinePreview(instances)}
      </Grid>
    </Box>
  );
}
