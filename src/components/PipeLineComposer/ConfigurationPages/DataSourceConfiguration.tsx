import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Node } from "reactflow";
import { DataSourceNodeData, NodeData, OrganizationNodeData } from '../../../redux/states/pipelineState';
import { useDispatch, useSelector } from 'react-redux';
import { getNodes } from '../../../redux/selectors';
import { updateNode } from '../../../redux/slices/pipelineSlice';
import { getResources } from '../../../redux/selectors/apiSelector';
import { RootState } from '../../../redux/states';

export interface AlgorithmConfugurationProps {
  nodeprop: Node<NodeData> | undefined;
}

export default function DataSourceConfiguration({ nodeprop }: AlgorithmConfugurationProps) {
  const dispatch = useDispatch();

  const node = useSelector(getNodes)?.find(node => node.id === nodeprop?.id) as Node<DataSourceNodeData> | undefined;

  const parentNode = useSelector(getNodes)?.find(n => n.id === node?.parentNode) as Node<OrganizationNodeData> | undefined;

  const resources = useSelector(getResources).filter(resource => resource.type !== "operator" && resource.organizationId === parentNode?.data?.instantiationData.organization?.id);

  if (!resources || resources.length === 0) {
    return (
      <Typography sx={{ padding: 2, color: 'red', textAlign: 'center' }}>
        No data sources available for the current configuration.
      </Typography>
    );
  }

  const setLogData = (resource: string) => {
    dispatch(updateNode({
      ...node!,
      data: {
        ...node?.data!,
        instantiationData: {
          resource: resources.find(r => r.id === resource)
        }
      }
    }));
  };

  return (
    <List>
      <header>Instantiation Data</header>
      <ListItem>
        <Box sx={{ width: '100%', display: "flex", flexDirection: "column" }}>
          <InputLabel id="data-select-label">Select Data Source</InputLabel>
          <Select
            labelId="data-select-label"
            id="data-select"
            value={node?.data.instantiationData?.resource?.id ?? ""}
            onChange={(event) => setLogData(event.target.value as string)}
            sx={{ width: '100%' }}
          >
            {resources.map((resource) => (
              <MenuItem key={resource.id} value={resource.id}>
                {resource.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </ListItem>
    </List>
  );
}
