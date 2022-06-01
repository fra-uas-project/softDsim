import {Box,Text, Heading, } from "@chakra-ui/react"
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
                <Heading size='md' fontWeight='bold'>Progress</Heading>
            <Box m="2">
            
            </Box>
            </Text>
        </>
    )
}

export default ProgressPanel