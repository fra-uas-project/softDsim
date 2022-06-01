import { 
    Box,Text, Heading,CircularProgress, CircularProgressLabel,SimpleGrid,} from "@chakra-ui/react"
import React, { useState } from "react";

const FamiliarityPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Familiarity Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'  p="5">Familiarity Overview<hr></hr></Heading>
                <SimpleGrid minChildWidth='120px' spacing='40px'>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'>Senior Developer
            <CircularProgress value={40} color='blue.400' size='65'>
            <CircularProgressLabel>40%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'> Senior Frontend
            <CircularProgress value={30} color='blue.400' size='65'>
            <CircularProgressLabel>30%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'>Junior Developer
            <CircularProgress value={75} color='blue.400' size='65'>
            <CircularProgressLabel>75%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'>Some Developer
            <CircularProgress value={60} color='blue.400' size='65'>
            <CircularProgressLabel>60%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'>Backend Developer
            <CircularProgress value={15} color='blue.400' size='65'>
            <CircularProgressLabel>15%</CircularProgressLabel>
            </CircularProgress></Box>
  <Box bg='blue.100' height='100%' borderRadius='2xl' boxShadow='md'>Backend Developer
            <CircularProgress value={15} color='blue.400' size='65'>
            <CircularProgressLabel>15%</CircularProgressLabel>
            </CircularProgress></Box>
</SimpleGrid>
            </Text>
        </>
    )
}

export default FamiliarityPanel