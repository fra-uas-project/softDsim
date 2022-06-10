import {
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Box, Stat, Heading, Flex,
} from "@chakra-ui/react"
import React, { useState } from "react";

const TasksPanel = (props) => {


    console.log('tasks', props)
    return (
        <>
            <Flex size='lg' fontWeight='bold' mb='2' color='black' flexFlow="column">
                <Heading size='md' fontWeight='bold' m='3'>Tasks<hr></hr></Heading>
                <Box m="2" bg='blue.100' borderRadius='2xl' boxShadow='md'>
                    <Stat>
                        <StatLabel>Todo</StatLabel>
                        <StatNumber>{props.simTasks.tasks_todo}</StatNumber>
                        {/* set api calls here*/}

                        <StatHelpText>
                            <StatArrow type='increase' />
                            100%
                        </StatHelpText>
                    </Stat>
                </Box>
                <Box m="2" bg='blue.100' borderRadius='2xl' boxShadow='md'>
                    <Stat>
                        <StatLabel>Done</StatLabel>
                        <StatNumber>{props.simTasks.task_done}</StatNumber>

                        <StatHelpText>
                            <StatArrow type='increase' />
                            75%
                        </StatHelpText>
                    </Stat>
                </Box>
                <Box m="2" bg='blue.100' borderRadius='2xl' boxShadow='md'>
                    <Stat>
                        <StatLabel>Unittested</StatLabel>
                        <StatNumber>{props.simTasks.tasks_unit_tested}</StatNumber>

                        <StatHelpText>
                            <StatArrow type='increase' />
                            50%
                        </StatHelpText>
                    </Stat>

                </Box>
                <Box m="2" bg='blue.100' borderRadius='2xl' boxShadow='md'>
                    <Stat>
                        <StatLabel>Integrationtested</StatLabel>
                        <StatNumber>{props.simTasks.tasks_integration_tested}</StatNumber>

                        <StatHelpText>
                            <StatArrow type='increase' />
                            50%
                        </StatHelpText>
                    </Stat>

                </Box>
                <Box m="2" bg='blue.100' borderRadius='2xl' boxShadow='md'>
                    <Stat>
                        <StatLabel>Bug</StatLabel>
                        <StatNumber>{props.simTasks.tasks_bug}</StatNumber>

                        <StatHelpText>
                            <StatArrow type='increase' />
                            50%
                        </StatHelpText>
                    </Stat>

                </Box>
            </Flex>
        </>
    )
}

export default TasksPanel