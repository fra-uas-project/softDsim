import { Text, RadioGroup, Radio, Stack, Grid } from "@chakra-ui/react"
import React, { useState } from "react";

const RadioButton = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Projekt",
            questions: [{
                text: "Waterfall",
                value: false
            }, {
                text: "Scrum",
                value: false
            }, {
                text: "Kanban",
                value: false
            }]
        }
    )

    return (
        <>
            <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                <Text size='lg' fontWeight='bold' mb='2'>
                    {testValues.text}
                </Text>
                <RadioGroup defaultValue='1'>
                    <Stack direction='row' justify='stretch'>
                        {testValues.questions.map((question, index) => {
                            return <Radio w='full' justifyItems='center' colorScheme='blue' value={index} isChecked={question.value}>
                                {question.text}
                            </Radio>
                        })}

                    </Stack>
                </RadioGroup>
            </Grid>
        </>
    )
}

export default RadioButton