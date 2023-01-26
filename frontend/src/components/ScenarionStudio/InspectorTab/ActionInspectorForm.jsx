import InspectorEmtpy from "./InspectorEmtpy";
import {action, findAction, getErrorColor, getErrorMessage, isError} from "../../../utils/utils";
import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl, FormErrorMessage,
    FormHelperText,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    VStack
} from "@chakra-ui/react";
import {useState} from "react";
import DeleteButton from "./DeleteButton";

const ActionInspectorForm = (props) => {

    const customActions = [
        action.MEETINGS,
        action.TRAINING
    ]

    const isCustomAction = customActions.includes(props.actionData.action);

    const [lowerLimit, setLowerLimit] = useState(props.actionData.lower_limit)
    const [upperLimit, setUpperLimit] = useState(props.actionData.upper_limit)

    // TODO: Refactor functions
    const handleChangeLowerLimit = (value) => {
        value = parseInt(value)
        setLowerLimit(value)
        props.updateEditorList(
            (draft) => {
                const action = findAction(props.actionData.id, draft)
                action.lower_limit = value;
            })
        if (value >= upperLimit) {
            setUpperLimit(value + 1)
            props.updateEditorList(
                (draft) => {
                    const action = findAction(props.actionData.id, draft)
                    action.upper_limit = value + 1;
                })
        }
    };

    const handleChangeUpperLimit = (value) => {
        value = parseInt(value)
        setUpperLimit(value)
        props.updateEditorList(
            (draft) => {
                const action = findAction(props.actionData.id, draft)
                action.upper_limit = value;
            })
        if (value <= lowerLimit) {
            setLowerLimit(value - 1)
            props.updateEditorList(
                (draft) => {
                    const action = findAction(props.actionData.id, draft)
                    action.lower_limit = value - 1;
                })
        }
    };

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
                    <FormControl isInvalid={isError(props.validationErrors, props.actionData.id, "upper_limit")}>
                        <NumberInput min={1} value={upperLimit} onChange={(value) => handleChangeUpperLimit(value)}
                                     errorBorderColor={getErrorColor(props.validationErrors, props.actionData.id, "upper_limit")}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        {isError(props.validationErrors, props.actionData.id, "upper_limit") ?
                            <FormErrorMessage mt={4}
                                              color={getErrorColor(props.validationErrors, props.actionData.id, "upper_limit")}>
                                {getErrorMessage(props.validationErrors, props.actionData.id, "upper_limit")}
                            </FormErrorMessage>
                            : <FormHelperText></FormHelperText>}
                        <FormHelperText>Upper Limit</FormHelperText>
                    </FormControl>


                    <Box h={3}/>
                    <FormControl isInvalid={isError(props.validationErrors, props.actionData.id, "lower_limit")}>
                        <NumberInput min={0} value={lowerLimit} onChange={(value) => handleChangeLowerLimit(value)}
                                     errorBorderColor={getErrorColor(props.validationErrors, props.actionData.id, "lower_limit")}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                        {isError(props.validationErrors, props.actionData.id, "lower_limit") ?
                            <FormErrorMessage mt={4}
                                              color={getErrorColor(props.validationErrors, props.actionData.id, "lower_limit")}>
                                {getErrorMessage(props.validationErrors, props.actionData.id, "lower_limit")}
                            </FormErrorMessage>
                            : <FormHelperText></FormHelperText>}
                        <FormHelperText>Lower Limit</FormHelperText>
                    </FormControl>
                </>
                :
                <InspectorEmtpy content={`${props.actionData.title} was added. No further configuration needed. `}/>
            }
            <DeleteButton
                component={props.actionData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </VStack>
    )
}

export default ActionInspectorForm;