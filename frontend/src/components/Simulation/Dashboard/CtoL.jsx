import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  Box,
  Heading,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";

const LineChart = ({ data }) => {
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
          y: data["stress"].value,
          borderColor: data["stress"].color,
          label: {
            borderColor: data["stress"].color,
            style: {
              color: "#fff",
              background: data["stress"].color
            },
            text: data["stress"].label
          }
        },
        {
          y: data.motivation.value,
          borderColor: data.motivation.color,
          label: {
            borderColor: data.motivation.color,
            style: {
              color: "#fff",
              background: data.motivation.color
            },
            text: data.motivation.label
          }
        },
        {
          y: data.familiarity.value,
          borderColor: data.familiarity.color,
          label: {
            borderColor: data.familiarity.color,
            style: {
              color: "#fff",
              background: data.familiarity.color
            },
            text: data.familiarity.label
          }
        }
      ],
    },
    xaxis: {
      categories: data.categories,
      tickAmount: 10,
      labels: {
        rotate: 0
      }
    },
    stroke: {
      curve: 'smooth',
    },
    colors: [data.stress.color, data.motivation.color, data.familiarity.color],
  };

  const tmpSeries = [
    {
      name: data.stress.label,
      data: []
    },
    {
      name: data.motivation.label,
      data: []
    },
    {
      name: data.familiarity.label,
      data: []
    }
  ];

  const [options, setOptions] = useState(tmpOptions);
  const [series, setSeries] = useImmer(tmpSeries);

  useEffect(() => {
    setSeries(draft => {
      draft[0].data.push(data.stress.value);
      draft[1].data.push(data.motivation.value);
      draft[2].data.push(data.familiarity.value);
    });
  }, [data]);

  return (
    <HStack backgroundColor="white" borderRadius="2xl" p={5} spacing={15} mb={5} w="full">
      <VStack justifyContent="flex-start" alignItems="start" w="full">
        <Heading size="lg" ml={5}>{data.title}</Heading>
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
          <StatLabel color="gray.400">{data.stress.label}</StatLabel>
          <StatNumber>{data.stress.value}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {data.stress.change} since last iteration
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel color="gray.400">{data.motivation.label}</StatLabel>
          <StatNumber>{data.motivation.value}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {data.motivation.change} since last iteration
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel color="gray.400">{data.familiarity.label}</StatLabel>
          <StatNumber>{data.familiarity.value}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {data.familiarity.change} since last iteration
          </StatHelpText>
        </Stat>
      </VStack>
    </HStack>
  );
};

export default LineChart;