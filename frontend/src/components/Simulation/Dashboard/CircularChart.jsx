import Chart from "react-apexcharts";
import React, {useState} from "react";
import {Flex, Heading, useBreakpointValue, VStack} from "@chakra-ui/react";

const CircularChart = ({value, inverseColors, title}) => {
    const variant = useBreakpointValue({ base: "200", lg: "200", "2xl": "300" })

    const tmpOptions = {
        chart: {
            height: 350,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    position: 'front',
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function (val) {
                            return parseInt(val);
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#48a6bb'],
                inverseColors: inverseColors,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: ["#F56565"],
        stroke: {
            lineCap: 'round'
        },
        labels: ['Percent'],
    };

    const [options, setOptions] = useState(tmpOptions);

    return (
        <Flex>
            <VStack>
                <Heading size="md">{title}</Heading>
                <Chart
                    options={options}
                    series={[value*100]}
                    type="radialBar"
                    width={variant}
                />
            </VStack>
        </Flex>
    )
}

export default CircularChart;