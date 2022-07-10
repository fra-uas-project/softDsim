import {Box, Checkbox, Grid, Heading, Radio, RadioGroup} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import QuestionElement from "./QuestionElement";

const Question = (props) => {
    function handleSelect(event, answer, type, questionID) {
        const answerID = answer.id
        var tempReturnObject = returnObject
        if (type) {
            // multiple choice
            // get array inddex of question
            const questionIndex = tempReturnObject.questions.findIndex(object => {
                return object.id === questionID;
            });

            // get array index of answer
            console.log('tempReturnObject.questions[questionIndex]', tempReturnObject.questions[questionIndex])
            const answerIndex = tempReturnObject.questions[questionIndex].answers.findIndex(object => {
                return object.id === answerID;
            });

            // write new value into object
            tempReturnObject.questions[questionIndex].answers[answerIndex].answer = event.target.checked
        } else if (!type) {
            // single choice
            // get array inddex of question
            const questionIndex = tempReturnObject.questions.findIndex(object => {
                return object.id === questionID;
            });

            // get array index of answer
            const answerIndex = tempReturnObject.questions[questionIndex].answers.findIndex(object => {
                return object.id === answerID;
            });

            // set all values to false
            for (const answer in tempReturnObject.questions[questionIndex].answers) {
                tempReturnObject.questions[questionIndex].answers[answer].answer = false
            }

            // write new value into object
            tempReturnObject.questions[questionIndex].answers[answerIndex].answer = true
        }
        // set return object to new object with new value
        setReturnObject(tempReturnObject)
        props.onSelect(tempReturnObject)
    }

    function createBasicAnswerObject(props) {
        // create basic return object for backend where every answer is false
        let baseObject = {
            id: props.id,
            questions: []
        }
        for (const question of props.questions) {
            const questionsID = question.id
            var answers = []
            for (const answer of question.answers) {
                answers.push({
                    id: answer.id,
                    answer: false
                })
            }
            baseObject.questions.push({
                id: questionsID,
                answers: answers
            })
        }
        setReturnObject(baseObject)
        callOnSelect(baseObject)
    }

    function callOnSelect(baseObject) {
        props.onSelect(baseObject)
    }

    const [returnObject, setReturnObject] = useState()

    useEffect(() => {
        createBasicAnswerObject(props.question_collection)
    }, [props.question_collection]);

    if (Object.keys(props).length > 0 && props.question_collection !== undefined) {
        return (
            <>
                <Grid borderRadius="xl"  p='3'>
                    {props.question_collection.questions.map((question, index) => {
                        return (
                            <Box key={index} mb={5}>
                                <Heading size='md'  mb='2'>
                                    {question.text}
                                </Heading>
                                {question.multi ?
                                    <QuestionElement>
                                        {question.answers.map((answer, index) => {
                                            return <Checkbox onChange={(event) => handleSelect(event, answer, question.multi, question.id)} key={index} value={answer.label}>{answer.label}</Checkbox>
                                        })}
                                    </QuestionElement>
                                    :
                                    <RadioGroup>
                                        <QuestionElement>
                                            {question.answers.map((answer, index) => {
                                                return <Radio onChange={(event) => handleSelect(event, answer, question.multi, question.id)} key={index} value={answer.label}>{answer.label}</Radio>
                                            })}
                                        </QuestionElement>
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