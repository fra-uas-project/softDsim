import {
    Box,
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
import {useState} from "react";
import {HiOutlineMinus} from "react-icons/hi";
import {findQuestion} from "../../../utils/utils";

const QuestionAnswer = (props) => {
    const [label, setLabel] = useState(props.answer.label);
    const [points, setPoints] = useState(props.answer.points)
    const [isRight, setIsRight] = useState(props.answer.right)

    const handleLabelChange = (event) => {
        setLabel(event.target.value)
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.label = event.target.value;
            })
    };

    const handlePointsChange = (event) => {
        setPoints(event)
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.points = event;
            })
    };

    const toggleRightWrong = () => {
        setIsRight(!isRight)
        props.updateEditorList(
            (draft) => {
                const question = findQuestion(props.questionId, draft);
                const answer = question.answers.find((answer) => answer.id === props.answer.id);
                answer.right = !isRight;
            })
    };

    return (
        <>
            <HStack>
                <Input value={label} onChange={handleLabelChange}/>
                <NumberInput maxWidth={24} value={points} onChange={handlePointsChange} min={0}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <IconButton aria-label="Remove Answer" icon={<HiOutlineMinus />} size="xs" variant='ghost' onClick={props.removeAnswer} isDisabled={props.isNotRemovable}/>
            </HStack>
            <FormHelperText>
                <HStack justify="space-between">
                    {props.multiRight && !props.isNotRemovable ?
                        <Text
                            color={isRight ? "green.400" : "red.400"}
                            cursor="pointer" onClick={toggleRightWrong}
                        >{isRight ? "Right Answer" : "Wrong Answer"}</Text>
                        :
                        <Text color={isRight ? "green.400" : "red.400"}>{isRight ? "Right Answer" : "Wrong Answer"}</Text>
                    }
                    <Text pr={10}>Points</Text>
                </HStack>
            </FormHelperText>
            <Box h={7}/>
        </>
    )
}

export default QuestionAnswer;