import InspectorEmtpy from "./InspectorEmtpy";
import {action} from "../utils/utils";
import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormHelperText,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const ActionInspectorForm = (props) => {

    const customActions = [
        action.MEETINGS,
        action.TRAINING
    ]

    const isCustomAction = customActions.includes(props.actionData.action);

    const [lowerLimit, setLowerLimit] = useState(props.actionData.lower_limit)
    const [upperLimit, setUpperLimit] = useState(props.actionData.upper_limit)

    const handleChangeLowerLimit = (value) => {
        setLowerLimit(value)
        value = parseInt(value)
        if (value >= upperLimit) {
            setUpperLimit(value + 1)
        }
    };

    const handleChangeUpperLimit = (value) => {
        setUpperLimit(value)
        value = parseInt(value)
        if (value <= lowerLimit) {
            setLowerLimit(value - 1)
        }
    };

    useEffect(() => {
        props.actionData.lower_limit = lowerLimit;

    }, [lowerLimit, props.actionData])

    useEffect(() => {
        props.actionData.upper_limit = upperLimit;
    }, [upperLimit, props.actionData])

    return (
        <VStack maxW="300px" alignItems="flex-start" w="full">
            {isCustomAction ?
                <>
                    <Editable defaultValue={props.actionData.title} w="full" fontWeight="bold" isDisabled>
                        <EditablePreview/>
                        <EditableInput/>
                    </Editable>
                    <Divider/>
                    <Box h={3}/>
                    <FormControl>
                        <NumberInput min={1} value={upperLimit} onChange={(value) => handleChangeUpperLimit(value)}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>Upper Limit</FormHelperText>

                        <Box h={3}/>

                        <NumberInput min={0} value={lowerLimit} onChange={(value) => handleChangeLowerLimit(value)}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>Lower Limit</FormHelperText>
                    </FormControl>
                </>
                :
                <InspectorEmtpy content={`${props.actionData.title} was added. No further configuration needed. `}/>
            }
        </VStack>
    )
}

export default ActionInspectorForm;