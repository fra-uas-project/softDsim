import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import InspectorItemSelector from "./InspectorItemSelector";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const FragmentInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.fragmentData?.displayName);
    const [endConditionType, setEndConditionType] = useState(props.fragmentData?.simulation_end?.type);
    const [endConditionLimit, setEndConditionLimit] = useState(props.fragmentData?.simulation_end?.limit);
    const [limitType, setLimitType] = useState(props.fragmentData?.simulation_end?.limit_type);
    const [actions, setActions] = useState(props.fragmentData?.actions);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    const onSubmitDisplayName = () => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.displayName = displayName;
            })
    }

    const onChangeEndConditionType = (event) => {
        setEndConditionType(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.type = event.target.value;
            })
    }

    const onChangeEndConditionLimit = (value) => {
        setEndConditionLimit(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.limit = value;
            })
    }

    const onChangeLimitType = (event) => {
        setLimitType(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.limit_type = event.target.value;
            })
    }

    const addActions =  (value) => {
        setActions(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.actions = value;
            })
    }

    return (
        <VStack maxW="300px" alignItems="flex-start" mb={3}>
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

            <FormControl isInvalid={isError(props.validationErrors,"text")}>
                <MarkdownTextfield
                    data={props.fragmentData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, "text")}
                />
                {isError(props.validationErrors,"text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, "text")}>
                        {getErrorMessage(props.validationErrors, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl>
                <FormLabel color="gray.400" htmlFor="">End Condition</FormLabel>
                <Select placeholder='Select condition' value={endConditionType} onChange={(event) => onChangeEndConditionType(event)}>
                    <option value='budget'>Budget</option>
                    <option value='duration'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='stress'>Stress Level</option>
                    <option value='motivation'>Motivation</option>
                </Select>

                <Box h={3}/>

                <HStack>
                    <Select w={20} placeholder="?" value={limitType} onChange={(event) => onChangeLimitType(event)}>
                        <option value='ge'>{">="}</option>
                        <option value='le'>{"<="}</option>
                    </Select>
                {/* TODO Validate number input*/}
                <NumberInput
                    min={0}
                    step={(endConditionType === "motivation" || endConditionType === "stress") ? 0.01 : 1}
                    max={(endConditionType === "motivation" || endConditionType === "stress") ? 1 : Infinity}
                    onChange={(value) => onChangeEndConditionLimit(value)}
                    value={endConditionLimit}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                    <FormHelperText mt={1} mx={1}>Type</FormHelperText>
                    <FormHelperText mt={1} mx={1}>Limit</FormHelperText>
                </HStack>

                <Box h={3}/>

            </FormControl>
            <InspectorItemSelector
                droppableId="actionList"
                itemList={props.finalActionList}
                type="action"
                headline="Actions"
                addActions={addActions}
                validationErrors={props.validationErrors}
            />
            <DeleteButton
                component={props.fragmentData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </VStack>
    )
}

export default FragmentInspectorForm;