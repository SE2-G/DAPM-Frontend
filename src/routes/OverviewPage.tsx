import { Box } from "@mui/material";
import OrganizationSidebar from "../components/OverviewPage/OrganizationSidebar";
import PipelineAppBar from "../components/PipeLineComposer/PipelineAppBar";
import PipelineGrid from "../components/OverviewPage/PipelineGrid";
import { ReactFlowProvider } from "reactflow";
import { useSelector } from 'react-redux';
import { getActivePipeline, getEdges, getNodes, getPipelines } from "../redux/selectors";
import { Edge, Node } from 'reactflow';


export default function UserPage() {

    return (
        <ReactFlowProvider>
        <div>
            <Box sx={{display: 'flex'}}>
                <OrganizationSidebar />
                <PipelineGrid />
            </Box>
        </div>
        </ReactFlowProvider>
    )
}
