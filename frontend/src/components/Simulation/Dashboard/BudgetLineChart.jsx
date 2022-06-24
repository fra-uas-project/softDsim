import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Heading, HStack, VStack} from "@chakra-ui/react";
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
            }
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
                    draft[0].data.push(data.state.cost)
                    draft[1].data.push(linearCost)
                })
            setLinearCost(parseFloat(linearCost) + parseFloat((data.management.budget / (data.management.duration / 5)).toFixed(2)))
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