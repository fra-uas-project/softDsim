import {Flex, HStack, Tooltip,} from "@chakra-ui/react";
import StatElement from "./StatElement";
import {HiOutlineCalendar, HiOutlineCash, HiOutlineDocumentText} from "react-icons/hi";
import OpenStoryButton from "./OpenStoryButton";
import TaskLineChart from "./TaskLineChart";
import CircularChart from "./CircularChart";
import BudgetLineChart from "./BudgetLineChart";
import {useEffect, useState} from "react";

const Dashboard = ({data, story}) => {

    const [expenses, setExpenses] = useState(0);
    const [expensesBefore, setExpensesBefore] = useState(0);

    const [daysUntilDeadline, setDaysUntilDeadline] = useState(data.management.duration);
    const [daysUntilDeadlineBefore, setDaysUntilDeadlineBefore] = useState(0);

    const [tasks, setTasks] = useState(data.management.tasks)
    const [tasksBefore, setTasksBefore] = useState(0)

    const calcDelta = (value, valueBefore) => {
        if(value - valueBefore === 0) {
            return ""
        } else if (value - valueBefore > 0) {
            return "increase"
        }else if (value - valueBefore < 0) {
            return "decrease"
        }
    }

    useEffect(() => {
        setDaysUntilDeadlineBefore(daysUntilDeadline)
        setDaysUntilDeadline(data.management.duration - data.state.day)

        setExpensesBefore(expenses)
        setExpenses(data.state.cost)

        setTasksBefore(tasks)
        setTasks(data.tasks.tasks_todo)
    }, [data])

    return (
        <>
            <HStack pb={5} spacing={5} justifyContent="space-between">
                <OpenStoryButton story={story}/>
                <StatElement
                    icon={HiOutlineCalendar}
                    title="Days until deadline"
                    value={daysUntilDeadline}
                    suffix="days"
                    decimals="0"
                    indicator={calcDelta(daysUntilDeadline, daysUntilDeadlineBefore)}
                    indicatorValue={daysUntilDeadline - daysUntilDeadlineBefore}
                    indicatorColor={daysUntilDeadline - daysUntilDeadlineBefore < 0 ? "red.400" : "green.400"}
                />
                <StatElement
                    icon={HiOutlineCash}
                    title="Expenses"
                    value={expenses}
                    prefix="$"
                    decimals="2"
                    indicator={calcDelta(expenses, expensesBefore)}
                    indicatorValue={expenses - expensesBefore}
                    indicatorColor={expenses - expensesBefore < 0 ? "green.400" : "red.400"}
                />
                <StatElement
                    icon={HiOutlineDocumentText}
                    title="Remaining tasks"
                    value={data.tasks.tasks_todo}
                    suffix="tasks"
                    decimals="0"
                    indicator={calcDelta(tasks, tasksBefore)}
                    indicatorValue={tasks - tasksBefore}
                    indicatorColor={tasks - tasksBefore < 0 ? "green.400" : "red.400"}
                />
            </HStack>

            <TaskLineChart title="Tasks" data={data} />
            <BudgetLineChart title="Budget" data={data}/>

            <Flex>
                <HStack backgroundColor="white" borderRadius="2xl" p={5} w="full" justifyContent="center">
                    <CircularChart value={data.team.stress} inverseColors={true} title="Avg. Stress" />
                    <CircularChart value={data.team.motivation} inverseColors={false} title="Avg. Motivation"/>
                    <CircularChart value={data.team.familiarity} inverseColors={false} title="Avg. Familarity"/>
                </HStack>
            </Flex>
        </>
    )
}

export default Dashboard;