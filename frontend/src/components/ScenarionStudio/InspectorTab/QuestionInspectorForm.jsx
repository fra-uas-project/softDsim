import {
    Box,
    Button,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl, FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import QuestionAnswer from "./QuestionAnswer";
import {v4 as uuidv4} from 'uuid';
import {HiOutlinePlus} from "react-icons/hi";
import {questionEnum} from "../scenarioStudioData";
import {findQuestion, getErrorColor, getErrorMessage, isError} from "../../../utils/utils";
import DeleteButton from "./DeleteButton";

const QuestionInspectorForm = ({updateEditorList, questionData, setSelectedObject, validationErrors}) => {
    const basicAnswers = [
        {
            id: uuidv4(),
            parentId: questionData.id,
            displayName: questionData.displayName,
            type: "ANSWER",
            label: "",
            points: "0",
            right: true
        },
        {
            id: uuidv4(),
            parentId: questionData.id,
            displayName: questionData.displayName,
            type: "ANSWER",
            label: "",
            points: "0",
            right: false
        },
    ]

    const [answers, setAnswers] = useState(questionData?.answers);
    const [displayName, setDisplayName] = useState(questionData?.displayName);
    const [questionText, setQuestionText] = useState(questionData?.text);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    const onChangeQuestionText =  (event) => {
        setQuestionText(event.target.value)
    }

    const onSubmitDisplayName = () => {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.displayName = displayName;
            })
    }

    const onSubmitQuestionText = () => {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.text = questionText;
            })
    }

    const addAnswer = () => {
        const newAnswer = {
            id: uuidv4(),
            parentId: questionData.id,
            displayName: questionData.displayName,
            label: "",
            points: "0",
            right: false,
            type: "ANSWER"
        }
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.answers.push(newAnswer);
            })
    };

    const removeAnswer = (id) => {
        const index = answers.findIndex(answer => answer.id === id)
        const copyAnswers = Array.from(answers)
        copyAnswers.splice(index, 1)
        setAnswers(copyAnswers)
    };

    useEffect(() => {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.answers = answers;
            })
    }, [answers, updateEditorList, questionData.id])

    useEffect(() => {
        if (answers.length === 0) {
            setAnswers(basicAnswers)
        }
    }, [answers.length])

    return(
        <VStack maxW="300px" mb={3}>
            <Editable value={displayName} w="full" fontWeight="bold"
                      onChange={(value) => onChangeDisplayName(value)}
                      onSubmit={onSubmitDisplayName}
            >
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

            <FormControl isInvalid={isError(validationErrors, questionData.id, "text")}>
                <FormLabel htmlFor='question' color="gray.400" fontWeight="semibold">Question</FormLabel>
                <Input id="question" value={questionText} errorBorderColor={getErrorColor(validationErrors, questionData.id, "text")}
                       onChange={(value) => onChangeQuestionText(value)}
                       onBlur={onSubmitQuestionText}
                />
                {isError(validationErrors, questionData.id, "text") ?
                    <FormErrorMessage color={getErrorColor(validationErrors, questionData.id, "text")}>
                        {getErrorMessage(validationErrors, questionData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>
            <Box h={3}/>
            <FormControl>
                <FormLabel color="gray.400" fontWeight="semibold" htmlFor="">Answers</FormLabel>
                {
                        answers.map((answer, index) => {
                            return <QuestionAnswer
                                        key={answer.id}
                                        questionId={questionData.id}
                                        updateEditorList={updateEditorList}
                                        answer={answer}
                                        removeAnswer={() => {removeAnswer(answer.id)}}
                                        multiRight={questionData.type === questionEnum.MULTI}
                                        isNotRemovable={index < 1} // Minimum one
                                        validationErrors={validationErrors}
                            />
                        })
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
            <DeleteButton
                component={questionData}
                updateEditorList={updateEditorList}
                setSelectedObject={setSelectedObject}
            />
        </VStack>
    )
}

export default QuestionInspectorForm;