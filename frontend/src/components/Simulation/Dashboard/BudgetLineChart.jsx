import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Box, Heading, HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, VStack} from "@chakra-ui/react";
import {useImmer} from "use-immer";

const LineChart = ({title, data}) => {
    // remove from here when we have real data
    const tmpOptions = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            responsive: [{
                breakpoint: 1000,
                options: {
                    chart: {
                        width: "200px"
                    }
                },
            }]
        },
        annotations: {
            yaxis: [
                {
                    y: data.management.budget,
                    borderColor: "#ff9d9d",
                    label: {
                        borderColor: "#ff9d9d",
                        style: {
                            color: "#fff",
                            background: "#ff9d9d"
                        },
                        text: "Budget Limit"
                    }
                }
            ],
            // xaxis: [
            //     {
            //         x: 365,
            //         borderColor: "#FEB019",
            //         label: {
            //             borderColor: "#FEB019",
            //             style: {
            //                 color: "#fff",
            //                 background: "#FEB019"
            //             },
            //             orientation: "horizontal",
            //             text: "Deadline"
            //         }
            //     }
            // ]
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
        colors: ['#4299E1', "#ff9d9d"],
    }

    const tmpSeries = [
        {
            name: "Cost",
            data: []
        },
        {
            name: "Linear Cost",
            data: []
        },
    ]



    const [options, setOptions] = useState(tmpOptions);
    const [series, setSeries] = useImmer(tmpSeries);
    const [linearCost, setLinearCost] = useState(0)

    useEffect(() => {
        if(data.type === "SIMULATION" || data.type === "RESULT") {
            setSeries(
                (draft) => {
                    draft[0].data.push(parseFloat(data.state.cost).toFixed(2))
                    draft[1].data.push(parseFloat(linearCost).toFixed(2))
                })
            setLinearCost(parseFloat(linearCost) + parseFloat((data.management.budget / (data.management.duration / 5)).toFixed(2)))
        }
    }, [data])

    return (
        <HStack backgroundColor="white" borderRadius="2xl" p={5} spacing={15} mb={5} w="full">
            <VStack justifyContent="flex-start" alignItems="start" w="full">
                <Heading size="lg" ml={5}>{title}</Heading>
                <Box w="100%" h="300px">
                <Chart
                    options={options}
                    series={series}
                    type="line"
                    width="100%"
                    height="100%"
                />
                </Box>
            </VStack>
            <VStack minW="200px" alignItems="baseline">
                <Stat>
                    <StatLabel color="gray.400">Cost</StatLabel>
                    <StatNumber>$ {data.state.cost.toFixed(2)}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        $ {((series[0].data[series[0].data.length -1] - series[0].data[series[0].data.length -2]) || 0).toFixed(2)} since last iteration
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel color="gray.400">Linear Cost</StatLabel>
                    <StatNumber>$ {series[1].data[series[1].data.length -1]}</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        $ {((series[1].data[series[1].data.length -1] - series[1].data[series[1].data.length -2]) || 0).toFixed(2)} since last iteration
                    </StatHelpText>
                </Stat>
            </VStack>
        </HStack>
    )
}

export default LineChart;