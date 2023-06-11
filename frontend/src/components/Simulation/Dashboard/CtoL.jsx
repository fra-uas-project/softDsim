import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Flex, Heading, useBreakpointValue, VStack } from "@chakra-ui/react";

const CtoL = ({ value, inverseColors, title }) => {
  const variant = useBreakpointValue({ base: "100%", lg: "100%", "2xl": "100%" });

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
    xaxis: {
      categories: ['Stress', 'Motivation', 'Familiarity'],
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          colors: ['#FCCB44', '#F56565', '#38B2AC'],
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 6,
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
        style: {
          fontSize: '12px'
        }
      }
    },
    stroke: {
      curve: 'smooth'
    },
    colors: ["#F56565"],
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
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 6,
      colors: ['#F56565'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    annotations: {
      points: [
        {
          x: 'Stress',
          y: value.stress,
          marker: {
            size: 6,
            fillColor: '#FCCB44',
            strokeWidth: 0,
            shape: 'circle',
            radius: 2
          },
          label: {
            borderColor: '#FCCB44',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#FCCB44'
            },
            text: 'Stress'
          }
        },
        {
          x: 'Motivation',
          y: value.motivation,
          marker: {
            size: 6,
            fillColor: '#F56565',
            strokeWidth: 0,
            shape: 'circle',
            radius: 2
          },
          label: {
            borderColor: '#F56565',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#F56565'
            },
            text: 'Motivation'
          }
        },
        {
          x: 'Familiarity',
          y: value.familiarity,
          marker: {
            size: 6,
            fillColor: '#38B2AC',
            strokeWidth: 0,
            shape: 'circle',
            radius: 2
          },
          label: {
            borderColor: '#38B2AC',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#38B2AC'
            },
            text: 'Familiarity'
          }
        }
      ]
    }
  };

  const [options, setOptions] = useState(tmpOptions);

  const series = [
    {
      name: 'Percentage',
      data: [value.stress, value.motivation, value.familiarity]
    }
  ];

  return (
    <Flex>
      <VStack>
        <Heading size="md">{title}</Heading>
        <Chart
          options={options}
          series={series}
          type="line"
          width={variant}
          height="300px"
        />
      </VStack>
    </Flex>
  );
};

export default CtoL;
