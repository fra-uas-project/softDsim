import { 
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
Box,Stat,Text, Heading, } from "@chakra-ui/react"
import React, { useState } from "react";

const EmployeesPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Employee Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'>Tasks</Heading>
            <Box m="2">
            <Stat>
            <StatLabel>Easy Tasks</StatLabel>
            <StatNumber>950</StatNumber> 
            {/* set api calls here*/}
            
            <StatHelpText>
             <StatArrow type='increase' />
             100%
            </StatHelpText>
            </Stat>
            </Box>
            <Box m="2">
            <Stat>
            <StatLabel>Medium Tasks</StatLabel>
            <StatNumber>950</StatNumber>
            
            <StatHelpText>
             <StatArrow type='increase' />
             75%
            </StatHelpText>
            </Stat>
            </Box>
            <Box m="2">
            <Stat>
            <StatLabel>Hard Tasks</StatLabel>
            <StatNumber>950</StatNumber>
            
            <StatHelpText>
             <StatArrow type='increase' />
             50%
            </StatHelpText>
            </Stat>
            </Box>
            </Text>
        </>
    )
}

export default EmployeesPanel