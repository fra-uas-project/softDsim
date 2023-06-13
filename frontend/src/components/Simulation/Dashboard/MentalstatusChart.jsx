import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, useBreakpointValue, VStack, HStack } from "@chakra-ui/react";
import { useImmer } from "use-immer";

const MentalstatusChart = ({ value, inverseColors, title }) => {
  const variant = useBreakpointValue({ base: "100%", lg: "100%", "2xl": "100%" });

  const tmpOptions = {
    chart: {
      height: 300,
      toolbar: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 10,
      labels: {
        formatter: (value) => Math.floor(value)
      }
    },
    xaxis: {
      categories: Array.from(Array(100).keys(), (item) => item * 5),
      tickAmount: 10,
      labels: {
        rotate: 0
      },
      min: null
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    colors: ["#F56565", "#38B2AC", "#FCCB44"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#48a6bb"],
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
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },
    annotations: {
      points: [
        {
          x: "Stress",
          y: value.team.stress * 100,
          label: {
            borderColor: "#FCCB44",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#FCCB44"
            },
            text: "Stress"
          }
        },
        {
          x: "Motivation",
          y: value.team.motivation * 100,
          label: {
            borderColor: "#F56565",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#F56565"
            },
            text: "Motivation"
          }
        },
        {
          x: "Familiarity",
          y: value.team.familiarity * 100,
          label: {
            borderColor: "#38B2AC",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#38B2AC"
            },
            text: "Familiarity"
          }
        }
      ]
    }
  };

  const [options, setOptions] = useState(tmpOptions);

  const tmpSeries = [
    {
      name: "Stress",
      data: []
    },
    {
      name: "Motivation",
      data: []
    },
    {
      name: "Familiarity",
      data: []
    }
  ];
  const [series, setSeries] = useImmer(tmpSeries);

  useEffect(() => {
    if (value.type === "SIMULATION" || value.type === "RESULT") {
      setSeries((draft) => {
        draft[0].data.push(value.team.stress * 100);
        draft[1].data.push(value.team.motivation * 100);
        draft[2].data.push(value.team.familiarity * 100);
      });
    }
  }, [value]);

  return (
    <HStack backgroundColor="white" borderRadius="2xl" p={5} spacing={15} mb={5} w="full">
      <VStack justifyContent="flex-start" alignItems="start" w="full">
        <Heading size="lg" ml={5}>
          {title}
        </Heading>
        <Box w="100%" h="300px">
          <Chart options={options} series={series} type="line" width="100%" height="100%" />
        </Box>
      </VStack>
    </HStack>
  );
};

export default MentalstatusChart;
