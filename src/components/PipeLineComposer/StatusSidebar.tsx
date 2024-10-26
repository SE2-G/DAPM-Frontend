import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Edge, Node } from "reactflow";
import { NodeData } from '../../redux/states/pipelineState';
import { getEdges, getNodes } from '../../redux/selectors';
import { useSelector } from 'react-redux';
import AlgorithmConfiguration from './ConfigurationPages/AlgorithmConfiguration';
import DataSourceConfiguration from './ConfigurationPages/DataSourceConfiguration';
import DataSinkConfiguration from './ConfigurationPages/DataSinkConfiguration';
import OrganizationConfiguration from './ConfigurationPages/OrganizationConfiguration';
import EdgeConfiguration from './ConfigurationPages/EdgeConfiguration';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box } from '@mui/material';



const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface ConfigurationSidebarProps {
  selectableProp: Node<NodeData> | Edge | undefined;
}

export default function PersistentDrawerRight({ selectableProp }: ConfigurationSidebarProps) {

  const node = useSelector(getNodes)?.find(node => node.id === selectableProp?.id);
  const edge = useSelector(getEdges)?.find(edge => edge.id === selectableProp?.id);

  const edgeEndNode = useSelector(getNodes)?.find(node => node.data.templateData.targetHandles.find(handle => handle.id === edge?.targetHandle));

  if (edgeEndNode !== undefined && edgeEndNode?.type !== "dataSink")
    return (null)

  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: '#292929',
          position: 'fixed',
          top: '64px',
          height: 'calc(100vh - 64px)',
        }
      }}
      sx={{
        width: drawerWidth,
        position: 'static',
        flexGrow: 1,
      }}
      variant="permanent"
      anchor="right"
    >
      <Divider />
      <DrawerHeader>
        <Typography sx={{ width: '100%', textAlign: 'center' }} variant="h6" noWrap component="div">
          Status
        </Typography>
      </DrawerHeader> 
      <Divider />
      


      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{color: 'sky blue'}}/>

      <CheckCircleIcon style={{ fontSize: '50px', color: '#4caf50' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <HourglassEmptyIcon sx={{ fontSize: 50, color: 'grey' }} />
      </Box>

      

    </div>

    </Drawer>
  );
}