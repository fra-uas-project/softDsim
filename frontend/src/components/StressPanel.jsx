import {
    Box, Flex, Heading, CircularProgress, CircularProgressLabel, SimpleGrid,
} from "@chakra-ui/react"
import React, { useState } from "react";

const StressPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Stress Overview"
        }
    )

    return (
        <>
            <Flex size='lg' fontWeight='bold' mb='2' color='black' flexFlow="column">
                <Heading size='md' fontWeight='bold' p="5">Stress Overview<hr></hr></Heading>
                <SimpleGrid minChildWidth='120px' spacing='40px'>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Senior Developer
                        <CircularProgress value={40} color='blue.400' size='65'>
                            <CircularProgressLabel>40%</CircularProgressLabel>
                        </CircularProgress></Box>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'> Senior Frontend
                        <CircularProgress value={30} color='blue.400' size='65'>
                            <CircularProgressLabel>30%</CircularProgressLabel>
                        </CircularProgress></Box>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Junior Developer
                        <CircularProgress value={75} color='blue.400' size='65'>
                            <CircularProgressLabel>75%</CircularProgressLabel>
                        </CircularProgress></Box>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Some Developer
                        <CircularProgress value={60} color='blue.400' size='65'>
                            <CircularProgressLabel>60%</CircularProgressLabel>
                        </CircularProgress></Box>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Backend Developer
                        <CircularProgress value={15} color='blue.400' size='65'>
                            <CircularProgressLabel>15%</CircularProgressLabel>
                        </CircularProgress></Box>
                    <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Backend Developer
                        <CircularProgress value={15} color='blue.400' size='65'>
                            <CircularProgressLabel>15%</CircularProgressLabel>
                        </CircularProgress></Box>
                </SimpleGrid>
            </Flex>
        </>
    )
}

export default StressPanel