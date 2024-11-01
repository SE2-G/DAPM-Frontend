import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import SourceIcon from '@mui/icons-material/Source';
import { NodeData } from "../../../redux/states/pipelineState";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { RootState } from "../../../redux/states";
import { useSelector } from 'react-redux';
import ErrorIcon from '@mui/icons-material/Error';


const DataSourceNode = ({ data, selected }: NodeProps<NodeData>) => {
    const isDeploying = useSelector((state:RootState) => state.pipelineState.isDeploying);
    const statusType = useSelector((state: RootState) => state.pipelineState.statusType);

    const getStatusIcon = () => {
        if (isDeploying && statusType === 'info') {
          return <CircularProgress size={24} sx={{ color: 'orange' }} />;
        } else if (statusType === 'error') {
          return <ErrorIcon color="error" />;
        } else if (statusType === 'success') {
          return <CheckCircleIcon color="success" />;
        } else {
          return <HourglassEmptyIcon color="disabled" />; // Default or idle icon
        }
      };

    return (
       <div>
        <div style={{display: "flex",justifyContent: "center", alignItems: "center", height: "100%",marginBottom:"5px"}}>
            {getStatusIcon()}
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
            <SourceIcon />
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

DataSourceNode.displayName = "DataSource";

export default memo(DataSourceNode);

