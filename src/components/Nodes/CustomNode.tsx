import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import styled from "styled-components";

const CustomNode = ({
  data,
  selected,
}: NodeProps) => {
  return (
    <Box sx={{backgroundColor: '#556677', padding: '10px', color: 'white', border: selected ? '2px solid red' : 'none'}}>
      <Handle
        type="target"
        position={Position.Left}
      />
      {data?.label}
      <Handle
        type="source"
        position={Position.Right}
      />
    </Box>
  );
};

CustomNode.displayName = "CustomNode";

export default memo(CustomNode);
