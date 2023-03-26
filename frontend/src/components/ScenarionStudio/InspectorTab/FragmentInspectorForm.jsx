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
    Icon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Tooltip,
    VStack
} from "@chakra-ui/react";
import React from "react";
import InspectorItemSelector from "./InspectorItemSelector";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";
import {HiOutlineQuestionMarkCircle} from "react-icons/hi";

const FragmentInspectorForm = (props) => {

    const onChangeDisplayName =  (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.displayName = value;
            })
    }

    const onChangeEndConditionType = (event) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.type = event.target.value;
            })
    }

    const onChangeEndConditionLimit = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.limit = value;
            })
    }

    const onChangeLimitType = (event) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.simulation_end.limit_type = event.target.value;
            })
    }

    const addActions =  (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.fragmentData.id)
                component.actions = value;
            })
    }

    return (
        <VStack maxW="300px" alignItems="flex-start" mb={3}>
            <Editable value={props.fragmentData.displayName} w="full" fontWeight="bold"
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

            <FormControl isInvalid={isError(props.validationErrors, props.fragmentData.id, "text")}>
                <MarkdownTextfield
                    data={props.fragmentData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, props.fragmentData.id, "text")}
                />
                {isError(props.validationErrors, props.fragmentData.id, "text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.fragmentData.id, "text")}>
                        {getErrorMessage(props.validationErrors, props.fragmentData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.fragmentData.id, "endCondition")}>
                <HStack alignItems="flex-start">
                    <FormLabel color="gray.400" htmlFor="" mr={0}>End Condition</FormLabel>

                        <Tooltip label="It is necessary to define an end condition for each Simulation Fragment, expect the last fragment if multiple fragments are present." placement="top">
                            <Box>
                            <Icon w={5} h={5} as={HiOutlineQuestionMarkCircle} color="gray.400" cursor="pointer" />
                            </Box>
                        </Tooltip>
                </HStack>
                <Select placeholder='Select condition' value={props.fragmentData.simulation_end.type}
                        onChange={(event) => onChangeEndConditionType(event)}
                        errorBorderColor={getErrorColor(props.validationErrors, props.fragmentData.id, "endCondition")}>
                    <option value='budget'>Budget</option>
                    <option value='duration'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='stress'>Stress Level</option>
                    <option value='motivation'>Motivation</option>
                </Select>

                <Box h={3}/>

                <HStack>
                    <Select w={20} placeholder="?" value={props.fragmentData?.simulation_end.limit_type} onChange={(event) => onChangeLimitType(event)}
                            errorBorderColor={getErrorColor(props.validationErrors, props.fragmentData.id, "endCondition")}>
                        <option value='ge'>{">="}</option>
                        <option value='le'>{"<="}</option>
                    </Select>
                <NumberInput
                    min={0}
                    step={(props.fragmentData.simulation_end.type === "motivation" || props.fragmentData.simulation_end.type === "stress") ? 0.01 : 1}
                    max={(props.fragmentData.simulation_end.type === "motivation" || props.fragmentData.simulation_end.type === "stress") ? 1 : Infinity}
                    onChange={(value) => onChangeEndConditionLimit(value)}
                    value={props.fragmentData.simulation_end.limit}>
                    <NumberInputField errorBorderColor={getErrorColor(props.validationErrors, props.fragmentData.id, "endCondition")}/>
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
                parentData={props.fragmentData}
                validationErrors={props.validationErrors}
                validationErrorObjectKey="actions"
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