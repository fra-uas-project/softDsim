import Chart from "react-apexcharts";
import React, { useState } from "react";
import { Flex, Heading, useBreakpointValue, VStack } from "@chakra-ui/react";

const CtoL = ({ value, inverseColors, title }) => {
  const variant = useBreakpointValue({ base: "300px", lg: "300px", "2xl": "300px" });

  const tmpOptions = {
    chart: {
      height: 300,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Stress', 'Motivation', 'Familiarity'] // 设置横轴标签
    },
    stroke: {
      curve: 'smooth' // 设置曲线样式为平滑曲线
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
    }
  };

  const [options, setOptions] = useState(tmpOptions);

  const series = [
    {
      name: 'Percentage',
      data: [value.stress, value.motivation, value.familiarity] // 设置折线图的数据
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
          height={300}
        />
      </VStack>
    </Flex>
  );
};

export default CtoL;