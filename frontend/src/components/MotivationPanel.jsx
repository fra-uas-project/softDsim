import { 
    Box,Text, Heading,CircularProgress, CircularProgressLabel,SimpleGrid, } from "@chakra-ui/react"
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
                <SimpleGrid minChildWidth='120px' spacing='40px'>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Senior Developer
            <CircularProgress value={80} color='blue.400' size='65'>
            <CircularProgressLabel>80%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'> Senior Frontend
            <CircularProgress value={30} color='blue.400' size='65'>
            <CircularProgressLabel>30%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Junior Developer
            <CircularProgress value={90} color='blue.400' size='65'>
            <CircularProgressLabel>90%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Some Developer
            <CircularProgress value={60} color='blue.400' size='65'>
            <CircularProgressLabel>60%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Backend Developer
            <CircularProgress value={45} color='blue.400' size='65'>
            <CircularProgressLabel>45%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md' p='1'>Backend Developer
            <CircularProgress value={65} color='blue.400' size='65'>
            <CircularProgressLabel>65%</CircularProgressLabel>
            </CircularProgress></Box>
</SimpleGrid>
            </Text>
        </>
    )
}

export default MotivationPanel