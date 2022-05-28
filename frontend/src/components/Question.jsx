import { Grid, Text, Stack, Checkbox, Radio, RadioGroup } from '@chakra-ui/react'

const Question = (props) => {
    function handleSelect(event) {
        console.log(event.target.value, ':', event.target.checked)
    }

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
                                            return <Checkbox onChange={(event) => handleSelect(event)} key={index} value={answer.label}>{answer.label}</Checkbox>
                                        })}
                                    </Stack> :
                                    <RadioGroup>
                                        <Stack placeContent='center' direction='row'>
                                            {question.answer.map((answer, index) => {
                                                return <Radio onChange={(event) => handleSelect(event)} key={index} value={answer.label}>{answer.label}</Radio>
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