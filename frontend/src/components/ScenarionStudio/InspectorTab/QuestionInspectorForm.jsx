import {
    Box,
    Button,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    VStack
} from "@chakra-ui/react";
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

    if (questionData.answers.length === 0) {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.answers = basicAnswers;
            })
    }

    const onChangeDisplayName =  (value) => {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.displayName = value;
            })
    }

    const onChangeQuestionText =  (event) => {
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.text = event.target.value;
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
        updateEditorList(
            (draft) => {
                const question = findQuestion(questionData.id, draft)
                question.answers = question.answers.filter((answer) => {return answer.id !== id});
            })
    };

    return(
        <VStack maxW="300px" mb={3}>
            <Editable value={questionData.displayName} w="full" fontWeight="bold"
                      onChange={(value) => onChangeDisplayName(value)}
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
                <Input id="question" value={questionData.text} errorBorderColor={getErrorColor(validationErrors, questionData.id, "text")}
                       onChange={(value) => onChangeQuestionText(value)}
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
                    questionData.answers.map((answer, index) => {
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
                    questionData.answers.length < 6 ?
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