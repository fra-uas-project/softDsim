import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview, FormControl, FormHelperText,
    FormLabel, HStack, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper, Select,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import InspectorItemSelector from "./InspectorItemSelector";
import MarkdownTextfield from "./MarkdownTextfield";

const FragmentInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.fragmentData?.displayName);
    const [endConditionType, setEndConditionType] = useState(props.fragmentData?.simulation_end?.type);
    const [endConditionLimit, setEndConditionLimit] = useState(props.fragmentData?.simulation_end?.limit);
    const [limitType, setLimitType] = useState(props.fragmentData?.simulation_end?.limit_type);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    const onChangeEndConditionType =  (event) => {
        setEndConditionType(event.target.value)
    }

    const onChangeEndConditionLimit =  (value) => {
        setEndConditionLimit(value)
    }

    const onChangeLimitType =  (event) => {
        setLimitType(event.target.value)
    }

    useEffect(() => {
        props.fragmentData.displayName = displayName;
        props.fragmentData.simulation_end.type = endConditionType;
        props.fragmentData.simulation_end.limit = endConditionLimit;
        props.fragmentData.simulation_end.limit_type = limitType;
    }, [displayName, endConditionType, endConditionLimit, limitType])

    return (
        <VStack maxW="300px" alignItems="flex-start">
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
            <MarkdownTextfield
                data={props.fragmentData}
            />
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
                headline="Action Types"
            />
        </VStack>
    )
}

export default FragmentInspectorForm;