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
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const EventInspectorForm = (props) => {

    const formatDays = (val) => val + ` days`

    const onChangeDisplayName = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.displayName = value;
            })
    }

    const onChangeEndConditionType = (event) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger_type = event.target.value;
            })
    }

    const onChangeEndConditionLimit = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger_value = value;
            })
    }

    const onChangeLimitType = (event) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger_comparator = event.target.value;
            })
    }

    const handleChangeDuration = (valueString) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.duration = valueString;
            })
    };

    const handleChangeBudget = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.budget = value;
            })
    };

    const handleChangeEasyTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.easy_tasks = value;
            })
    };

    const handleChangeMediumTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.medium_tasks = value;
            })
    };

    const handleChangeHardTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.hard_tasks = value;
            })
    };

    const handleChangeStress = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.stress = value;
            })
    };

    const handleChangeFamiliarity = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.familiarity = value;
            })
    };

    const handleChangeMotivation = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.motivation = value;
            })
    };

    return (
        <VStack maxW="300px" alignItems="flex-start" mb={5}>
            <Editable value={props.eventData.displayName} w="full" fontWeight="bold"
                      onChange={(value) => onChangeDisplayName(value)}>
                <EditablePreview
                    w="full"
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer",
                    }}
                />
                <EditableInput/>
            </Editable>
            <Divider/>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "text")}>
                <MarkdownTextfield
                    data={props.eventData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "text")}
                />
                {isError(props.validationErrors, props.eventData.id, "text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.eventData.id, "text")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "trigger_type")}>
                <FormLabel color="gray.400" htmlFor="">Trigger</FormLabel>
                <Select placeholder='Select condition' value={props.eventData.trigger_type}
                        errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "trigger_type")}
                        onChange={(event) => onChangeEndConditionType(event)}>
                    <option value='budget'>Budget</option>
                    <option value='time'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='stress'>Stress Level</option>
                    <option value='motivation'>Motivation</option>
                    <option value='familiarity'>Familiarity</option>
                </Select>
                {isError(props.validationErrors, props.eventData.id, "trigger_type") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "trigger_type")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "trigger_type")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <HStack alignItems="flex-start">
                <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "trigger_comparator")}
                             w="auto">
                    <Select w={20} placeholder="?" value={props.eventData.trigger_comparator} onChange={(event) => onChangeLimitType(event)}
                            errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "trigger_comparator")}>
                        <option value='ge'>{">="}</option>
                        <option value='le'>{"<="}</option>
                    </Select>
                    {isError(props.validationErrors, props.eventData.id, "trigger_comparator") ?
                        <FormErrorMessage maxW={20}
                                          color={getErrorColor(props.validationErrors, props.eventData.id, "trigger_comparator")}>
                            {getErrorMessage(props.validationErrors, props.eventData.id, "trigger_comparator")}
                        </FormErrorMessage>
                        : <FormHelperText></FormHelperText>}
                </FormControl>

                <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "trigger_value")}>
                    <NumberInput
                        min={0}
                        step={(props.eventData.trigger_type === "motivation" || props.eventData.trigger_type === "stress" || props.eventData.trigger_type === "familiarity") ? 0.01 : 1}
                        max={(props.eventData.trigger_type === "motivation" || props.eventData.trigger_type === "stress" || props.eventData.trigger_type === "familiarity") ? 1 : Infinity}
                        onChange={(value) => onChangeEndConditionLimit(value)}
                        value={props.eventData.trigger_value}
                        errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "trigger_value")}>
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                    {isError(props.validationErrors, props.eventData.id, "trigger_value") ?
                        <FormErrorMessage
                            color={getErrorColor(props.validationErrors, props.eventData.id, "trigger_value")}>
                            {getErrorMessage(props.validationErrors, props.eventData.id, "trigger_value")}
                        </FormErrorMessage>
                        : <FormHelperText></FormHelperText>}
                </FormControl>
            </HStack>
            <HStack w="full" justifyContent="space-between">
                <FormHelperText mt={1} mx={1}>Type</FormHelperText>
                <FormHelperText mt={1} mx={1}>Limit</FormHelperText>
            </HStack>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "impact")}>
                <FormLabel color="gray.400" htmlFor="">Impact</FormLabel>
                {isError(props.validationErrors, props.eventData.id, "impact") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "impact")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "impact")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "budget")}>
                <NumberInput id="budget" value={props.eventData.budget} onChange={(value) => handleChangeBudget(value)}
                             errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "budget")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "budget") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "budget")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "budget")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Budget</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "duration")}>
                <NumberInput id="duration" onChange={(valueString) => handleChangeDuration(valueString)}
                             value={formatDays(props.eventData.duration)}
                             errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "duration")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "duration") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "duration")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "duration")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Duration</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "easy_tasks")}>
                <NumberInput id="easytasks" value={props.eventData.easy_tasks} onChange={(value) => handleChangeEasyTasks(value)}
                             errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "easy_tasks")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "easy_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "easy_tasks")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "easy_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Easy Tasks</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "medium_tasks")}>
                <NumberInput id="mediumtasks" value={props.eventData.medium_tasks} onChange={(value) => handleChangeMediumTasks(value)}
                             errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "medium_tasks")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "medium_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "medium_tasks")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "medium_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Medium Tasks</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "hard_tasks")}>
                <NumberInput id="hardtasks" value={props.eventData.hard_tasks} onChange={(value) => handleChangeHardTasks(value)}
                             errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "hard_tasks")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "hard_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "hard_tasks")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "hard_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Hard Tasks</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "stress")}>
                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeStress(value)}
                    value={props.eventData.stress}
                    errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "stress")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "stress") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "stress")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "stress")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Stress</FormHelperText>
            </FormControl>

            <Box h={3}/>
            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "motivation")}>
                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeMotivation(value)}
                    value={props.eventData.motivation}
                    errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "motivation")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "motivation") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "motivation")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "motivation")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Motivation</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.eventData.id, "familiarity")}>
                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeFamiliarity(value)}
                    value={props.eventData.familiarity}
                    errorBorderColor={getErrorColor(props.validationErrors, props.eventData.id, "familiarity")}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.eventData.id, "familiarity") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.eventData.id, "familiarity")}>
                        {getErrorMessage(props.validationErrors, props.eventData.id, "familiarity")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
                <FormHelperText>Familiarity</FormHelperText>
            </FormControl>

            <Box h={3}/>

            <DeleteButton
                component={props.eventData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </VStack>
    )
}

export default EventInspectorForm;