import {
    Box,
    FormHelperText,
    HStack, IconButton,
    Input, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Text
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {HiOutlineMinus} from "react-icons/hi";

const QuestionAnswer = (props) => {
    const [label, setLabel] = useState(props.answer.label);
    const [points, setPoints] = useState(props.answer.points)
    const [isRight, setIsRight] = useState(props.answer.right)

    const handleLabelChange = (event) => {
        setLabel(event.target.value)
    };

    const handlePointsChange = (event) => {
        setPoints(event)
    };

    const toggleRightWrong = () => {
        setIsRight(!isRight)
        props.answer.right = ! props.answer.right
    };

    useEffect(() => {
        props.answer.label = label
    }, [label])

    useEffect(() => {
        props.answer.points = points
    }, [points])

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