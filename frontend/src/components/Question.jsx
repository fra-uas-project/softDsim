import { Grid, Text, Stack, Checkbox, Radio, RadioGroup, Box } from '@chakra-ui/react'

const Question = (props) => {
    function handleSelect(event, type) {
        console.log(event.target.value, ':', event.target.checked)
        if (type) {

        } else if (!type) {

        }
    }
    console.log('PROPS', props.question_collection.questions)

    if (Object.keys(props).length > 0 && props.question_collection !== undefined) {
        return (
            <>
                <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                    {props.question_collection.questions.map((question, index) => {
                        return (
                            <Box key={index}>
                                <Text size='lg' fontWeight='bold' mb='2'>
                                    {question.text}
                                </Text>
                                {question.multi ?
                                    <Stack placeContent='center' direction='row'>
                                        {question.answers.map((answer, index) => {
                                            return <Checkbox onChange={(event) => handleSelect(event, question.multi)} key={index} value={answer.label}>{answer.label}</Checkbox>
                                        })}
                                    </Stack> :
                                    <RadioGroup>
                                        <Stack placeContent='center' direction='row'>
                                            {question.answers.map((answer, index) => {
                                                return <Radio onChange={(event) => handleSelect(event, question.multi)} key={index} value={answer.label}>{answer.label}</Radio>
                                            })}
                                        </Stack>
                                    </RadioGroup>
                                }
                            </Box>
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