import {Flex, HStack} from "@chakra-ui/react";
import StatElement from "./StatElement";
import {MdOutlineTask} from "react-icons/md";
import {HiOutlineCalendar, HiOutlineCash} from "react-icons/hi";
import OpenStoryButton from "./OpenStoryButton";
import TaskLineChart from "./TaskLineChart";
import CircularChart from "./CircularChart";
import BudgetLineChart from "./BudgetLineChart";

const Dashboard = ({simTasks, templateScenario}) => {
    return (
        <>
            <HStack pb={5} spacing={5}>
                <OpenStoryButton templateScenario={templateScenario}/>
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

            <TaskLineChart title="Tasks"/>
            <BudgetLineChart title="Budget"/>

            <Flex>
                <HStack backgroundColor="white" borderRadius="2xl" p={5} mb={5} w="full" justifyContent="center">
                    <CircularChart value={[60]} inverseColors={true} title="Avg. Stress"/>
                    <CircularChart value={[20]} inverseColors={false} title="Avg. Motivation"/>
                    <CircularChart value={[20]} inverseColors={false} title="Avg. Familarity"/>
                </HStack>
            </Flex>
        </>
    )
}

export default Dashboard;