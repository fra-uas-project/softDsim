import React, {useState} from "react";
import Chart from "react-apexcharts";
import {Heading, HStack, VStack} from "@chakra-ui/react";

const LineChart = ({title}) => {
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
                    y: 80,
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

    const tmpOptions2 = {
        annotations: {
            yaxis: [
                {
                    y: 80,
                    borderColor: "#00E396",
                    label: {
                        borderColor: "#00E396",
                        style: {
                            color: "#fff",
                            background: "#00E396"
                        },
                        text: "Y Axis Annotation"
                    }
                }
            ],
            xaxis: [
                {
                    // in a datetime series, the x value should be a timestamp, just like it is generated below
                    x: new Date("11/17/2017").getTime(),
                    strokeDashArray: 0,
                    borderColor: "#775DD0",
                    label: {
                        borderColor: "#775DD0",
                        style: {
                            color: "#fff",
                            background: "#775DD0"
                        },
                        text: "X Axis Anno Vertical"
                    }
                },
                {
                    x: new Date("03 Dec 2017").getTime(),
                    borderColor: "#FEB019",
                    label: {
                        borderColor: "#FEB019",
                        style: {
                            color: "#fff",
                            background: "#FEB019"
                        },
                        orientation: "horizontal",
                        text: "X Axis Anno Horizonal"
                    }
                }
            ],
            points: [
                {
                    x: 4,
                    y: 50,
                    marker: {
                        size: 6,
                        fillColor: "#fff",
                        strokeColor: "#2698FF",
                        radius: 2
                    },
                    label: {
                        borderColor: "#FF4560",
                        offsetY: 0,
                        style: {
                            color: "#fff",
                            background: "#FF4560"
                        },

                        text: "Point Annotation (XY)"
                    }
                }
            ]
        },
        chart: {
            height: 380,
            type: "line",
            id: "areachart-2"
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "straight"
        },
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
        </HStack>
    )
}

export default LineChart;