import {Box,Text, Heading,Skeleton, SkeletonCircle, SkeletonText, } from "@chakra-ui/react"
import React, { useState } from "react";



const ProgressPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Progress Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold' m='3'>Progress<hr></hr></Heading>
            <Box m="2">
            <Box padding='6' boxShadow='lg' bg='white' borderRadius='2xl' m='3'>
            <SkeletonCircle size='10' />
            <SkeletonText mt='4' noOfLines={10} spacing='5' />
            </Box>
            
            </Box>
            </Text>
        </>
    )
}

export default ProgressPanel