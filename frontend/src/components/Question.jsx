import { Grid, Text, Stack, Checkbox, Radio, RadioGroup } from '@chakra-ui/react'

const Question = (props) => {
    if (Object.keys(props).length > 0) {
        return (
            <>
                <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                    <Text size='lg' fontWeight='bold' mb='2'>
                        {props.text}
                    </Text>
                    {props.questions.questions.map((question, index) => {
                        return (
                            <>
                                <Text size='lg' fontWeight='bold' mb='2'>
                                    {question.text}
                                </Text>
                                {question.multi ?
                                    <Stack placeContent='center' direction='row'>
                                        {question.answer.map((answer, index) => {
                                            return <Checkbox key={index}>{answer.label}</Checkbox>
                                        })}
                                    </Stack> :
                                    <RadioGroup>
                                        <Stack placeContent='center' direction='row'>
                                            {question.answer.map((answer, index) => {
                                                return <Radio key={index} value={answer.label}>{answer.label}</Radio>
                                            })}
                                        </Stack>
                                    </RadioGroup>
                                }
                            </>
                        )
                    })}
                </Grid>
            </>
        )
    } else {
        return <></>
    }

}

export default Question