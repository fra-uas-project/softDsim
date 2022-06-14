import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Heading, HStack, VStack} from "@chakra-ui/react";
import {useImmer} from "use-immer";

const LineChart = ({title, templateScenario, data}) => {
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
            yaxis: [
                {
                    y: templateScenario.management_goal.budget,
                    borderColor: "#00E396",
                    label: {
                        borderColor: "#00E396",
                        style: {
                            color: "#fff",
                            background: "#00E396"
                        },
                        text: "Budget Limit"
                    }
                }
            ],
            xaxis: [
                {
                    x: 365,
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
        colors: ['#4299E1'],
    }

    const tmpSeries = [
        {
            name: "Cost",
            data: []
        },
    ]



    const [options, setOptions] = useState(tmpOptions);
    const [series, setSeries] = useImmer(tmpSeries);

    useEffect(() => {
        if(data.type === "SIMULATION") {
            setSeries(
                (draft) => {
                    draft[0].data.push(data.state.cost)
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
        </HStack>
    )
}

export default LineChart;