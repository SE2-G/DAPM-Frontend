import { AppBar, Box, Button, TextField, Toolbar, Typography, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getActiveFlowData, getActivePipeline } from "../../redux/selectors";
import { useState, useEffect } from "react";
import { addNewPipeline, updatePipelineName } from "../../redux/slices/pipelineSlice";
import EditIcon from '@mui/icons-material/Edit';
import { Node } from "reactflow";
import { DataSinkNodeData, DataSourceNodeData, OperatorNodeData } from "../../redux/states/pipelineState";
import { putCommandStart, putExecution, putPipeline } from "../../services/backendAPI";
import { getOrganizations, getRepositories } from "../../redux/selectors/apiSelector";
import { getHandleId, getNodeId } from "./Flow";
import { v4 as uuidv4 } from 'uuid';
import { showTemplateData } from "../../redux/slices/pipelineSlice";

export default function PipelineAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [progress, setProgress] = useState(0);
  const [showStatusBar, setShowStatusBar] = useState(false);

  useEffect(() => {
    if (statusMessage) {
      setShowStatusBar(true);
      if (statusType === 'success' || statusType === 'error') {
        const timer = setTimeout(() => {
          setShowStatusBar(false);
          setStatusMessage('');
          setProgress(0);
        }, 5000); 
        return () => clearTimeout(timer);
      }
    }
  }, [statusMessage, statusType]);

  

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);

  const pipelineName = useSelector(getActivePipeline)?.name;

  const setPipelineName = (name: string) => {
    dispatch(updatePipelineName(name));
  };

  const [validationError, setValidationError] = useState<string>('');

const validateTemplateData = (flowData: any) => {
  // Check if flowData exists and has nodes
  if (!flowData?.nodes || flowData.nodes.length === 0) {
    return "No nodes found in the pipeline";
  }

  // Validate each node's template data
  for (const node of flowData.nodes) {
    if (node.type === 'operator') {
      const operatorNode = node as Node<OperatorNodeData>;
      
      // Check source handles
      if (!operatorNode.data.templateData?.sourceHandles?.length) {
        return `Operator node "${operatorNode.data?.label || 'Unnamed'}" missing source handle configuration`;
      }
      
      // Check if all source handles have types
      const invalidSourceHandle = operatorNode.data.templateData.sourceHandles.find(handle => !handle.type);
      if (invalidSourceHandle) {
        return `Operator node "${operatorNode.data?.label || 'Unnamed'}" has source handle without type configuration`;
      }
      
      // Check target handles
      if (!operatorNode.data.templateData?.targetHandles?.length) {
        return `Operator node "${operatorNode.data?.label || 'Unnamed'}" missing target handle configuration`;
      }
      
      // Check if all target handles have types
      const invalidTargetHandle = operatorNode.data.templateData.targetHandles.find(handle => !handle.type);
      if (invalidTargetHandle) {
        return `Operator node "${operatorNode.data?.label || 'Unnamed'}" has target handle without type configuration`;
      }
    }
    
    if (node.type === 'dataSource') {
      const dataSourceNode = node as Node<DataSourceNodeData>;
      
      // Check source handles
      if (!dataSourceNode.data.templateData?.sourceHandles?.length) {
        return `Data source node "${dataSourceNode.data?.label || 'Unnamed'}" missing source handle configuration`;
      }
      
      // Check if all source handles have types
      const invalidSourceHandle = dataSourceNode.data.templateData.sourceHandles.find(handle => !handle.type);
      if (invalidSourceHandle) {
        return `Data source node "${dataSourceNode.data?.label || 'Unnamed'}" has source handle without type configuration`;
      }
    }
  }
  
  return null; // Return null if validation passes
};

  const flowData = useSelector(getActiveFlowData);

 
  
  const createNewPipeline = () => {
    const templateFlowData = flowData;

    if (templateFlowData?.edges != null && templateFlowData.nodes != null) {
      // Validate template data
      const validationError = validateTemplateData(templateFlowData);
      
      if (validationError) {
        // Show error message
        setStatusMessage(validationError);
        setStatusType('error');
        setShowStatusBar(true);
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          setShowStatusBar(false);
          setStatusMessage('');
        }, 5000);
        
        return; // Exit the function if validation fails
      }
    
    //if(templateFlowData?.edges!=null&&templateFlowData.nodes!=null){
    //  
    //  dispatch(addNewPipeline({ id: `pipeline-${uuidv4()}`, flowData: templateFlowData }));
    //  { navigate("/pipelineInstantiation") }
    //  
    //}
      dispatch(addNewPipeline({ id: `pipeline-${uuidv4()}`, flowData: templateFlowData }));
      navigate("/pipelineInstantiation");
      dispatch(showTemplateData(false));
    }
    
  }


  const getStatusIcon = () => {
    if (statusType === 'success') {
      return <CheckCircleIcon sx={{ mr: 1 }} />;
    } else if (statusType === 'error') {
      return <ErrorIcon sx={{ mr: 1 }} />;
    } else {
      
      return <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />;
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ flexGrow: 1 }}>
        <Button onClick={() => navigate('/userpage')}>
          <ArrowBackIosNewIcon sx={{ color: 'white' }} />
        </Button>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          {isEditing ? (
            <TextField
              value={pipelineName}
              onChange={(event) => setPipelineName(event?.target.value as string)}
              autoFocus
              onBlur={handleFinishEditing}
              inputProps={{ style: { textAlign: 'center', width: 'auto' } }}
            />
          ) : (
            <Box
              onClick={handleStartEditing}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Typography>{pipelineName}</Typography>
              <EditIcon sx={{ paddingLeft: '10px' }} />
            </Box>
          )}
        </Box>

        <Button
          onClick={() => createNewPipeline()}
          variant="contained"
          sx={{
            ml: 1,
            mr: 1,
            backgroundColor: '#555555', 
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#404040', 
            },
          }}
        >
          CREATE INSTANCE
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#555555', 
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#404040', 
            },
          }}
        >
          SAVE TEMPLATE
        </Button>
      </Toolbar>

      
      
    </AppBar>
  );
}
