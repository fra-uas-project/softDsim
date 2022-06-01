import { 
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    
Box,Stat,Text, Heading, } from "@chakra-ui/react"
import React, { useState } from "react";

const TasksPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Tasks Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold' m='3'>Tasks</Heading>
            <Box m="2" bg='blue.100' borderRadius='2xl'>
            <Stat>
            <StatLabel>Todo</StatLabel>
            <StatNumber>426</StatNumber> 
            {/* set api calls here*/}
            
            <StatHelpText>
             <StatArrow type='increase' />
             100%
            </StatHelpText>
            </Stat>
            </Box>
            <Box m="2" bg='blue.100' borderRadius='2xl'>
            <Stat>
            <StatLabel>Done</StatLabel>
            <StatNumber>189</StatNumber>
            
            <StatHelpText>
             <StatArrow type='increase' />
             75%
            </StatHelpText>
            </Stat>
            </Box>
            <Box m="2" bg='blue.100' borderRadius='2xl'>
            <Stat>
            <StatLabel>Unittested</StatLabel>
            <StatNumber>42</StatNumber>
            
            <StatHelpText>
             <StatArrow type='increase' />
             50%
            </StatHelpText>
            </Stat>
            
            </Box>
            <Box m="2" bg='blue.100' borderRadius='2xl'>
            <Stat>
            <StatLabel>Integrationtested</StatLabel>
            <StatNumber>42</StatNumber>
            
            <StatHelpText>
             <StatArrow type='increase' />
             50%
            </StatHelpText>
            </Stat>
            
            </Box>
            <Box m="2" bg='blue.100' borderRadius='2xl'>
            <Stat>
            <StatLabel>Bug</StatLabel>
            <StatNumber>42</StatNumber>
            
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

export default TasksPanel