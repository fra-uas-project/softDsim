import { Text, Grid, Button } from "@chakra-ui/react"
import React, { useState } from "react";

const ActionToggle = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Event",
        }
    )

    const [buttonValue, setButtonValue] = useState(false)

    function handleButtonClick() { setButtonValue(!buttonValue) }

    return (
        <>
            <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3' justifyItems='center'>
                <Text size='lg' fontWeight='bold' mb='2'>
                    {testValues.text}
                </Text>
                <Button
                    colorScheme={buttonValue ? 'blue' : 'blackAlpha'} size='lg'
                    onClick={handleButtonClick}
                    w='50%'
                >
                    {buttonValue ? 'Yes' : 'No'}
                </Button>
            </Grid>
        </>
    )
}

export default ActionToggle