// Author: s233486
// Author: s232893
// Author: s232252

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

  const flowData = useSelector(getActiveFlowData);

 
  
  const createNewPipeline = () => {
    const templateFlowData = flowData;
    
    if(templateFlowData?.edges!=null&&templateFlowData.nodes!=null){
      
      dispatch(addNewPipeline({ id: `pipeline-${uuidv4()}`, flowData: templateFlowData }));
      { navigate("/pipelineInstantiation") }
      
    }
    dispatch(showTemplateData(false));
    
  }

  const generateJson = async () => {
    try {
      setProgress(0);
      setStatusMessage('Starting to deploy pipeline...');
      setStatusType('info');

      var edges = flowData!.edges.map(edge => {
        return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle };
      });

      console.log('copied', edges);

      const dataSinks = flowData?.edges
        .map((edge) => {
          if (edge.data?.filename) {
            const newTarget = getHandleId();
            const edgeToModify = edges.find(
              (e) => e.sourceHandle === edge.sourceHandle && e.targetHandle === edge.targetHandle
            );
            edgeToModify!.targetHandle = newTarget;

            const originalDataSink = flowData!.nodes.find(
              (node) => node.id === edge.target
            ) as Node<DataSinkNodeData>;
            return {
              type: originalDataSink?.type,
              data: {
                ...originalDataSink?.data,
                templateData: { sourceHandles: [], targetHandles: [{ id: newTarget }] },
                instantiationData: {
                  resource: {
                    organizationId:
                      originalDataSink?.data?.instantiationData.repository?.organizationId,
                    repositoryId: originalDataSink?.data?.instantiationData.repository?.id,
                    name: edge?.data?.filename,
                  },
                },
              },
              position: { x: 100, y: 100 },
              id: getNodeId(),
              width: 100,
              height: 100,
            };
          }
        })
        .filter((node) => node !== undefined) as any;

      console.log(JSON.stringify(dataSinks));

      const requestData = {
        name: pipelineName,
        pipeline: {
          nodes: flowData?.nodes
            ?.filter((node) => node.type === 'dataSource')
            .map((node) => node as Node<DataSourceNodeData>)
            .map((node) => {
              return {
                type: node.type,
                data: {
                  ...node.data,
                  instantiationData: {
                    resource: {
                      organizationId: node?.data?.instantiationData.resource?.organizationId,
                      repositoryId: node?.data?.instantiationData.resource?.repositoryId,
                      resourceId: node?.data?.instantiationData.resource?.id,
                    },
                  },
                },
                width: 100,
                height: 100,
                position: { x: 100, y: 100 },
                id: node.id,
                label: '',
              } as any;
            })
            .concat(
              flowData?.nodes
                ?.filter((node) => node.type === 'operator')
                .map((node) => node as Node<OperatorNodeData>)
                .map((node) => {
                  return {
                    type: node.type,
                    data: {
                      ...node.data,
                      instantiationData: {
                        resource: {
                          organizationId:
                            node?.data?.instantiationData.algorithm?.organizationId,
                          repositoryId:
                            node?.data?.instantiationData.algorithm?.repositoryId,
                          resourceId: node?.data?.instantiationData.algorithm?.id,
                        },
                      },
                    },
                    width: 100,
                    height: 100,
                    position: { x: 100, y: 100 },
                    id: node.id,
                    label: '',
                  } as any;
                })
            )
            .concat(dataSinks),
          edges: edges.map((edge) => {
            return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle };
          }),
        },
      };

      console.log(JSON.stringify(requestData));

      const selectedOrg = organizations[0];
      const selectedRepo = repositories.filter((repo) => repo.organizationId === selectedOrg.id)[0];

      console.log(`Selected organization ID: ${selectedOrg.id}`);
      console.log(`Selected repository ID: ${selectedRepo.id}`);

      setProgress(25);
      setStatusMessage('Uploading pipeline...');
      setStatusType('info');
      const pipelineId = await putPipeline(selectedOrg.id, selectedRepo.id, requestData);

      setProgress(50);
      setStatusMessage('Creating execution');
      setStatusType('info');

      const executionId = await putExecution(selectedOrg.id, selectedRepo.id, pipelineId);

      setProgress(75);
      setStatusMessage('Executing pipeline...');
      setStatusType('info');

      await putCommandStart(selectedOrg.id, selectedRepo.id, pipelineId, executionId);

      setProgress(100);
      setStatusMessage('Pipeline Template deployed successfully');
      setStatusType('success');

    } catch (error: any) {
      setProgress(100);
      setStatusMessage('Error: ' + error.message);
      setStatusType('error');
    }
  };


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
