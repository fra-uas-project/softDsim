import {Flex, HStack, Icon, Stat, StatArrow, StatHelpText, StatLabel, StatNumber} from "@chakra-ui/react";

const StatElement = ({icon, title, value, prefix, suffix, indicator, indicatorValue, indicatorColor, decimals}) => {

    return (
        <Flex backgroundColor="white" p={5} borderRadius="2xl" w="full">
            <HStack spacing={3}>
                <Flex borderRadius="100%" backgroundColor="blue.100" p={2}>
                    <Icon w={10} h={10} as={icon} color="blue.600" />
                </Flex>
                <Stat>
                    <StatLabel color="gray.400">{title}</StatLabel>
                    <StatNumber>{prefix} {parseFloat(value).toFixed(decimals)} {suffix}</StatNumber>
                    <StatHelpText whiteSpace="nowrap">
                        {indicator && <StatArrow type={indicator} color={indicatorColor}/>}
                        {prefix} {parseFloat(indicatorValue).toFixed(decimals)} {suffix} since last iteration
                    </StatHelpText>
                </Stat>
            </HStack>
        </Flex>
    )
}

export default StatElement;