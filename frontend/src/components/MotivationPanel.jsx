import { 
    Box,Text, Heading,CircularProgress, CircularProgressLabel,Grid,GridItem, } from "@chakra-ui/react"
import React, { useState } from "react";

const MotivationPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Motivation Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'  p="5">Motivation Overview<hr></hr></Heading>
                <Grid templateColumns='repeat(5, 1fr)' gap={2} m="3">
                    <GridItem w="100%" h="10">
            
                Senior Developer
            <CircularProgress value={40} color='blue.400' size='65'>
            <CircularProgressLabel>40%</CircularProgressLabel>
            </CircularProgress>
            
            </GridItem>
            <GridItem w="100%" h="10">
                Senior Frontend
            <CircularProgress value={30} color='blue.400' size='65'>
            <CircularProgressLabel>30%</CircularProgressLabel>
            </CircularProgress></GridItem>
            
            <GridItem w="100%" h="10">
                Junior Developer
            <CircularProgress value={75} color='blue.400' size='65'>
            <CircularProgressLabel>75%</CircularProgressLabel>
            </CircularProgress></GridItem>
            <GridItem w="100%" h="10">
                Some Developer
            <CircularProgress value={60} color='blue.400' size='65'>
            <CircularProgressLabel>60%</CircularProgressLabel>
            </CircularProgress></GridItem>
            <GridItem w="100%" h="10">
                Backend Developer
            <CircularProgress value={15} color='blue.400' size='65'>
            <CircularProgressLabel>15%</CircularProgressLabel>
            </CircularProgress></GridItem>
            
            </Grid>
            </Text>
        </>
    )
}

export default MotivationPanel