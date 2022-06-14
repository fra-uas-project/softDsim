import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Heading, HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, VStack} from "@chakra-ui/react";
import {useImmer} from "use-immer";

const TaskLineChart = ({title, data}) => {
    // remove from here when we have real data
    const tmpOptions = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        annotations: {
            xaxis: [
                {
                    x: 6,
                    borderColor: "#FEB019",
                    label: {
                        borderColor: "#FEB019",
                        style: {
                            color: "#fff",
                            background: "#FEB019"
                        },
                        orientation: "horizontal",
                        text: "Deadline"
                    }
                }
            ]
        },
        xaxis: {
            categories: Array.from(Array(100).keys(), item => item*5), // Change hardcoded value 100
            tickAmount: 10,
            labels: {
                rotate: 0
            }
        },
        stroke: {
            curve: 'smooth',
        },
        colors: ['#4299E1', "#63B3ED", "#90CDF4", "#000000"],
    }


    const tmpSeries = [
        {
            name: "Tasks Done",
            data: []
        },
        {
            name: "Tasks Unit Tested",
            data: []
        },
        {
            name: "Tasks Integration Tested",
            data: []
        },
        {
            name: "Tasks with Bugs",
            data: []
        },
    ]



    const [options, setOptions] = useState(tmpOptions);
    const [series, setSeries] = useImmer(tmpSeries);

    useEffect(() => {
        if(data.type === "SIMULATION") {
            setSeries(
                (draft) => {
                    draft[0].data.push(data.tasks.tasks_done)
                    draft[1].data.push(data.tasks.tasks_unit_tested)
                    draft[2].data.push(data.tasks.tasks_integration_tested)
                    draft[3].data.push(data.tasks.tasks_bug)
                })
        }
    }, [data])

    return (
        <HStack backgroundColor="white" borderRadius="2xl" p={5} mb={5} spacing={15} >
            <VStack justifyContent="flex-start" alignItems="start">
                <Heading size="lg" ml={5}>{title}</Heading>
                <Chart
                    options={options}
                    series={series}
                    type="line"
                    width="700"
                    height="300"
                />
            </VStack>
            <VStack w="full">
                <Stat>
                    <StatLabel color="gray.400">Done</StatLabel>
                    <StatNumber>{data.tasks.tasks_done}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Integration tested</StatLabel>
                    <StatNumber>{data.tasks.tasks_integration_tested}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Unit tested</StatLabel>
                    <StatNumber>{data.tasks.tasks_unit_tested}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Bugs</StatLabel>
                    <StatNumber>{data.tasks.tasks_bug}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
            </VStack>

        </HStack>
    )
}

export default TaskLineChart;