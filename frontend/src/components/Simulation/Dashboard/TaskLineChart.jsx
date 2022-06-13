import React, {useState} from "react";
import Chart from "react-apexcharts";
import {Heading, HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, VStack} from "@chakra-ui/react";

const TaskLineChart = ({title}) => {
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
            categories: Array.from(Array(365).keys())
        },
        stroke: {
            curve: 'smooth',
        },
        colors: ['#4299E1'],
    }


    const tmpSeries = [
        {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        },
    ]



    const [options, setOptions] = useState(tmpOptions);
    const [series, setSeries] = useState(tmpSeries);

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
                    <StatNumber>4830</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Integration tested</StatLabel>
                    <StatNumber>3824</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Unit tested</StatLabel>
                    <StatNumber>4230</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        232 since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Bugs</StatLabel>
                    <StatNumber>4830</StatNumber>
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