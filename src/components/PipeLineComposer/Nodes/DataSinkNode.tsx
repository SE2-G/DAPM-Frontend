import { Box } from "@mui/material";
import { memo, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import SaveIcon from '@mui/icons-material/Save';
import { NodeData } from "../../../redux/states/pipelineState";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../redux/states";
import { resetPipelineState } from "../../../redux/slices/pipelineSlice";



const DataSinkNode = ({ data, selected }: NodeProps<NodeData>) => {
    const dispatch = useDispatch();
  const isDeploying = useSelector((state:RootState) => state.pipelineState.isDeploying);
  //const progress = useSelector((state: RootState) => state.pipelineState.progress);
  const statusType = useSelector((state: RootState) => state.pipelineState.statusType);

  
  const getStatusIcon = () => {
    try{
      if (isDeploying && statusType === 'info') {
        return <CircularProgress size={24} sx={{ color: 'orange' }} />;
      } else if (statusType === 'error') {
        return <ErrorIcon color="error" />;
      } else if (statusType === 'success') {
        return <CheckCircleIcon color="success" />;
      } else {
        return <HourglassEmptyIcon color="disabled" />; // Default or idle icon
      }
    } catch(error){
        console.error('Error occurred while getting status icon:', error);
        return null;

    }
    };

    return (
        <div>
        <div style={{display: "flex",justifyContent: "center", alignItems: "center", height: "100%",marginBottom:"5px"}}>
            {/*{isDeploying && <HourglassEmptyIcon fontSize="large" color="disabled" />}
            <CircularProgress color="primary" />
            <CheckCircleIcon fontSize="large" color="success" />*/}
             {/*getStatusIcon()*/} 
        </div>

        <Box sx={{ backgroundColor: '#556677', padding: '10px', color: 'white', position: "relative", border: selected ? '2px solid #007bff' : '2px solid #556677' }}>
            <Box style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", position: "absolute", top: "0", bottom: "0", left: "0" }}>
                {data?.templateData.targetHandles?.map(handle => <Handle
                    key={handle.id}
                    id={handle.id}
                    type="target"
                    position={Position.Left}
                    style={{ position: "relative", transform: "none", top: "auto" }}
                />)}
            </Box>
            <SaveIcon />
            <Box style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", position: "absolute", top: "0", bottom: "0", right: "0" }}>
                {data?.templateData.sourceHandles?.map(handle => <Handle
                    key={handle.id}
                    id={handle.id}
                    type="source"
                    position={Position.Right}
                    style={{ position: "relative", transform: "none", top: "auto" }}
                />)}
            </Box>
        </Box>
        </div>
    );
};

DataSinkNode.displayName = "DataSink";

export default memo(DataSinkNode);

