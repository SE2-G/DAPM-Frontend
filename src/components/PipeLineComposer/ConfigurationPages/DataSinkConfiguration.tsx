import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Node, useUpdateNodeInternals } from "reactflow";
import { useDispatch, useSelector } from 'react-redux';
import { Box, InputLabel, MenuItem, Select } from '@mui/material';
import { NodeData } from '../../../redux/states';
import { getNodes } from '../../../redux/selectors';
import { addHandle } from '../../../redux/slices/nodeSlice';


export interface AlgorithmConfugurationProps {
  nodeprop: Node<NodeData> | undefined;
}

export default function DataSinkConfiguration({ nodeprop }: AlgorithmConfugurationProps) {

  const [logData, setLogData] = React.useState("");

  return (
      <List>
        <>
          <ListItem>
            <Box sx={{ width: '100%', display: "flex", flexDirection: "column" }}>
            <InputLabel id="demo-simple-select-standard-label">Please select the repository</InputLabel>
            <Select
              labelId="algorithm-simple-select-label"
              id="algorithm-simple-select"
              value={logData}
              label="LogData"
              sx={{ width: '100%' }}
              onChange={(event) => setLogData(event?.target.value as string)}
            >
              <MenuItem value={"Repository 1"}>Repository 1</MenuItem>
              <MenuItem value={"Repository 2"}>Repository 2</MenuItem>
              <MenuItem value={"Repository 3"}>Repository 3</MenuItem>
            </Select>
            </Box>
            </ListItem>
        </>
      </List>
  );
}
