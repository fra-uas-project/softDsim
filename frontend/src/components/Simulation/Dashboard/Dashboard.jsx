import {Box, Grid, GridItem} from "@chakra-ui/react";
import SideDrawerLeft from "../../SideDrawerLeft";
import TasksPanel from "../../TasksPanel";
import ProgressPanel from "../../ProgressPanel";
import MilestonesPanel from "../../MilestonesPanel";
import EmployeesPanel from "../../EmployeesPanel";
import StressPanel from "../../StressPanel";
import MotivationPanel from "../../MotivationPanel";
import FamiliarityPanel from "../../FamiliarityPanel";

const Dashboard = ({simTasks}) => {
    return (
        <>
        <Box boxShadow='md' rounded='md' p='3' mb='5' bg='white' _hover={{boxShadow: '2xl'}}><SideDrawerLeft/></Box>
        <Grid
            templateRows='repeat(4, 1fr)'
            templateColumns='repeat(6, 1fr)'
            gap={5}
            textAlign='center'
            fontWeight='bold'
            color='white'
        >
            <GridItem rowSpan={1} _hover={{boxShadow: '2xl'}} colSpan={1} boxShadow='md' rounded='md'
                      bg='white'><TasksPanel simTasks={simTasks}/></GridItem>
            <GridItem colSpan={3} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md'
                      bg='white'><ProgressPanel/></GridItem>
            <GridItem colSpan={2} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md' bg='white'><MilestonesPanel/></GridItem>
            <GridItem colSpan={6} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md'
                      bg='white'><EmployeesPanel/></GridItem>
            <GridItem colSpan={2} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md' bg='white'
                      p='2'><StressPanel/></GridItem>
            <GridItem colSpan={2} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md' bg='white'
                      p='2'><MotivationPanel/></GridItem>
            <GridItem colSpan={2} _hover={{boxShadow: '2xl'}} boxShadow='md' rounded='md' bg='white'
                      p='2'><FamiliarityPanel/></GridItem>
        </Grid>
</>
)
}

export default Dashboard;