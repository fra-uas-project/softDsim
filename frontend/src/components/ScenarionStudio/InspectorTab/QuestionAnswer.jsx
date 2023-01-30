import {
    Box,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    HStack,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text
} from "@chakra-ui/react";
import {HiOutlineMinus} from "react-icons/hi";
import {findQuestion, getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const QuestionAnswer = (props) => {

    const handleLabelChange = (event) => {
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.label = event.target.value;
            })
    };

    const handlePointsChange = (event) => {
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.points = event;
            })
    };

    const toggleRightWrong = () => {
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.right = !props.answer.right;
            })
    };

    return (
        <>
            <HStack alignItems="flex-start">
                <FormControl isInvalid={isError(props.validationErrors, props.answer.id, "label")}>
                    <Input value={props.answer.label} onChange={handleLabelChange}
                           errorBorderColor={getErrorColor(props.validationErrors, "label")}/>
                    {isError(props.validationErrors, props.answer.id, "label") ?
                        <FormErrorMessage color={getErrorColor(props.validationErrors, props.answer.id,  "label")}>
                            {getErrorMessage(props.validationErrors, props.answer.id,  "label")}
                        </FormErrorMessage>
                        : <FormHelperText></FormHelperText>}
                </FormControl>

                <FormControl maxWidth={24} isInvalid={isError(props.validationErrors, props.answer.id, "points")}>
                <NumberInput  value={props.answer.points} onChange={handlePointsChange}
                             errorBorderColor={getErrorColor(props.validationErrors,  props.answer.id, "points")}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                    {isError(props.validationErrors, props.answer.id, "points") ?
                        <FormErrorMessage color={getErrorColor(props.validationErrors, props.answer.id,  "points")}>
                            {getErrorMessage(props.validationErrors, props.answer.id,  "points")}
                        </FormErrorMessage>
                        : <FormHelperText></FormHelperText>}
                </FormControl>

                <IconButton aria-label="Remove Answer" icon={<HiOutlineMinus />} size="xs" variant='ghost' mt="8px !important" onClick={props.removeAnswer} isDisabled={props.isNotRemovable}/>

            </HStack>
            <FormHelperText>
                <HStack justify="space-between">
                    {props.multiRight && !props.isNotRemovable ?
                        <Text
                            color={props.answer.right ? "green.400" : "red.400"}
                            cursor="pointer" onClick={toggleRightWrong}
                        >{props.answer.right ? "Right Answer" : "Wrong Answer"}</Text>
                        :
                        <Text color={props.answer.right ? "green.400" : "red.400"}>{props.answer.right ? "Right Answer" : "Wrong Answer"}</Text>
                    }
                    <Text pr={10}>Points</Text>
                </HStack>
            </FormHelperText>
            <Box h={7}/>
        </>
    )
}

export default QuestionAnswer;