import { 
    Box,Text, Heading,CircularProgress, CircularProgressLabel,Grid,GridItem, } from "@chakra-ui/react"
import React, { useState } from "react";

const StressPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Stress Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'>Stress Overview</Heading>
                <Grid templateColumns='repeat(5, 1fr)' gap={5} m="2">
                    <GridItem w="100%" h="10">
            
                Senior Developer
            <CircularProgress value={40} color='green.400' size='75'>
            <CircularProgressLabel>40%</CircularProgressLabel>
            </CircularProgress>
            
            </GridItem>
            <GridItem w="100%" h="10">
                Senior Frontend
            <CircularProgress value={30} color='green.400' size='75'>
            <CircularProgressLabel>30%</CircularProgressLabel>
            </CircularProgress></GridItem>
            
            <GridItem w="100%" h="10">
                Junior Developer
            <CircularProgress value={75} color='green.400' size='75'>
            <CircularProgressLabel>75%</CircularProgressLabel>
            </CircularProgress></GridItem>
            <GridItem w="100%" h="10">
                Some Developer
            <CircularProgress value={75} color='green.400' size='75'>
            <CircularProgressLabel>75%</CircularProgressLabel>
            </CircularProgress></GridItem>
            <GridItem w="100%" h="10">
                Some Guy for something
            <CircularProgress value={75} color='green.400' size='75'>
            <CircularProgressLabel>75%</CircularProgressLabel>
            </CircularProgress></GridItem>
            
            </Grid>
            </Text>
        </>
    )
}

export default StressPanel