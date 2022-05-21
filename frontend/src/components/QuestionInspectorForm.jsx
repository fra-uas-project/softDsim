import {
    Box,
    Button,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import QuestionAnswer from "./QuestionAnswer";
import {v4 as uuidv4} from 'uuid';
import {HiOutlinePlus} from "react-icons/hi";

const QuestionInspectorForm = (props) => {
    const basicAnswers = [
        {
            id: uuidv4(),
            label: "",
            points: "0",
            right: true
        },
        {
            id: uuidv4(),
            label: "",
            points: "0",
            right: false
        },

    ]

    const [answers, setAnswers] = useState(props.questionData?.answers);
    const [displayName, setDisplayName] = useState(props.questionData?.displayName);
    const [questionText, setQuestionText] = useState(props.questionData?.text);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    const onChangeQuestionText =  (event) => {
        setQuestionText(event.target.value)
    }

    const addAnswer = () => {
        const newAnswer = {
            id: uuidv4(),
            label: "",
            points: "0",
            right: false
        }
        setAnswers([...answers, newAnswer])
    };

    const removeAnswer = (id) => {
        const index = answers.findIndex(answer => answer.id === id)
        const copyAnswers = Array.from(answers)
        copyAnswers.splice(index, 1)
        setAnswers(copyAnswers)
    };


    // Update answers (not react way. should update answers in parent component with setEditorList
    const updateAnswers = () => {
        props.questionData.answers = answers
    };

    useEffect(() => {
        updateAnswers()
    }, [answers])

    useEffect(() => {
        console.log(props.questionData)
    })

    useEffect(() => {
        props.questionData.displayName = displayName
        props.questionData.text = questionText
    }, [displayName, questionText])

    return(
        <VStack maxW="300px">
            <Editable value={displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)}>
                <EditablePreview
                    w="full"
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer",
                    }}
                />
                <EditableInput/>
            </Editable>
            <Divider />
            <Box h={3}/>
            <FormControl>
                <FormLabel htmlFor='question' color="gray.400" fontWeight="semibold">Question</FormLabel>
                {/* TODO persist question and question name */}
                <Input id="question" value={questionText} onChange={(value) => onChangeQuestionText(value)} />
                <FormHelperText></FormHelperText>
            </FormControl>
            <Box h={3}/>
            <FormControl>
                <FormLabel color="gray.400" fontWeight="semibold" htmlFor="">Answers</FormLabel>
                {
                    answers.length ?
                        answers.map((answer, index) => {
                            return <QuestionAnswer // TODO make first element not removable
                                        key={answer.id}
                                        answer={answer}
                                        removeAnswer={() => {removeAnswer(answer.id)}}
                                        multiRight={props.questionData.type === "MULTI"} //TODO Use Enum (make enum globally accessible)
                                        isNotRemovable={index < 1} // Minimum one
                            />
                        })
                        :
                        setAnswers(basicAnswers)
                }
                {
                    answers.length < 6 ?
                        <Button variant='outline' w="full" leftIcon={<HiOutlinePlus />} onClick={addAnswer}>
                            Answer
                        </Button>
                        :
                        <FormHelperText color="red.400" textAlign="center">Maximum 6 answers allowed!</FormHelperText>
                }
            </FormControl>
        </VStack>
    )
}

export default QuestionInspectorForm;