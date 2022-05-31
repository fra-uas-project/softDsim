import { Text, Grid, FormControl, Switch } from "@chakra-ui/react"
import React, { useState } from "react";

const ActionSwitch = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Bug Fixing"
        }
    )

    return (
        <>
            <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3' justifyItems='center'>
                <Text size='lg' fontWeight='bold' mb='2'>
                    {testValues.text}
                </Text>
                <FormControl display='flex' >
                    <Switch size='lg' />
                </FormControl>
            </Grid>
        </>
    )
}

export default ActionSwitch