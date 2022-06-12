import {Grid, GridItem, HStack} from "@chakra-ui/react";
import TasksPanel from "../../TasksPanel";
import ProgressPanel from "../../ProgressPanel";
import MilestonesPanel from "../../MilestonesPanel";
import EmployeesPanel from "../../EmployeesPanel";
import StressPanel from "../../StressPanel";
import MotivationPanel from "../../MotivationPanel";
import FamiliarityPanel from "../../FamiliarityPanel";
import StatElement from "./StatElement";
import {MdOutlineTask} from "react-icons/md";
import {HiOutlineCalendar, HiOutlineCash} from "react-icons/hi";
import OpenStoryButton from "./OpenStoryButton";

const Dashboard = ({simTasks, templateScenario}) => {
    return (
        <>
            <HStack pb={5} spacing={5}>
                <OpenStoryButton templateScenario={templateScenario} />
                <StatElement
                    icon={HiOutlineCalendar}
                    title="Days until deadline"
                    value="365"
                    suffix="days"
                    indicator="decrease"
                    indicatorValue="7 days"
                    indicatorColor="red.400"
                />
                <StatElement
                    icon={HiOutlineCash}
                    title="Expenses"
                    value="379,392"
                    prefix="$"
                    indicatorValue="$ 37,920"
                    indicator="increase"
                    indicatorColor="red.400"
                />
                <StatElement
                    icon={MdOutlineTask}
                    title="Finished tasks"
                    value="394"
                    suffix="tasks"
                    indicator="increase"
                    indicatorValue="42 tasks"
                    indicatorColor="green.400"
                />
            </HStack>
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