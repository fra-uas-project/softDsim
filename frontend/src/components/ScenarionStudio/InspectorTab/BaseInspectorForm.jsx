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
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const BaseInspectorForm = (props) => {
    const formatDays = (val) => val + ` days`

    const handleTemplateName = (event) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.template_name = event.target.value;
            })
    };

    const handleChangeDuration = (valueString) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.duration = valueString;
            })
    };

    const handleChangeBudget = (value) => {
        // setBudget(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.budget = value;
            })
    };

    const handleChangeEasyTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.easy_tasks = value;
            })
    };

    const handleChangeMediumTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.medium_tasks = value;
            })
    };

    const handleChangeHardTasks = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.hard_tasks = value;
            })
    };

    return (
        <>
            <Editable defaultValue='Base Information' w="full" fontWeight="bold" isDisabled>
                <EditablePreview/>
                <EditableInput/>
            </Editable>
            <Divider/>

            <Box h={3} />

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "template_name")} >
                <FormLabel color="gray.400" htmlFor="templateName">Scenario Name</FormLabel>
                <Input id="templateName" value={props.baseData.template_name} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "template_name")}
                       onChange={(event) => {handleTemplateName(event)}}/>
                {isError(props.validationErrors, props.baseData.id, "template_name") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "template_name")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "template_name")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "text")}>
                <MarkdownTextfield
                    key={props.baseData.id}
                    data={props.baseData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "text")}
                />
                {isError(props.validationErrors, props.baseData.id, "text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.baseData.id, "text")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "budget")} >
                <FormLabel color="gray.400" htmlFor="budget">Budget</FormLabel>
                <NumberInput w="full" min={0} id="budget" value={props.baseData.budget} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "budget")}
                             onChange={(value) => handleChangeBudget(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.baseData.id, "budget") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "budget")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "budget")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "duration")} >
                <FormLabel color="gray.400" htmlFor="duration">Duration</FormLabel>
                <NumberInput id="duration" w="full" min={0} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "duration")}
                             onChange={(valueString) => handleChangeDuration(valueString)} value={formatDays(props.baseData.duration)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,props.baseData.id, "duration") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "duration")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "duration")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "easy_tasks")} >
                <FormLabel color="gray.400" htmlFor="easytasks">Easy Tasks</FormLabel>
                <NumberInput min={0} w="full" id="easytasks" value={props.baseData.easy_tasks} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "easy_tasks")}
                             onChange={(value) => handleChangeEasyTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,props.baseData.id, "easy_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "easy_tasks")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "easy_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,props.baseData.id, "medium_tasks")} >
                <FormLabel color="gray.400" htmlFor="mediumtasks">Medium Tasks</FormLabel>
                <NumberInput min={0} w="full" id="mediumtasks" value={props.baseData.medium_tasks} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "medium_tasks")}
                             onChange={(value) => handleChangeMediumTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,props.baseData.id, "medium_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "medium_tasks")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "medium_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "hard_tasks")}>
                <FormLabel color="gray.400" htmlFor="hardtasks">Hard Tasks</FormLabel>
                <NumberInput w="full" min={0} id="hardtasks" value={props.baseData.hard_tasks} errorBorderColor={getErrorColor(props.validationErrors, props.baseData.id, "hard_tasks")}
                             onChange={(value) => handleChangeHardTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors, props.baseData.id, "hard_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "hard_tasks")}>
                        {getErrorMessage(props.validationErrors, props.baseData.id, "hard_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <FormControl isInvalid={isError(props.validationErrors, props.baseData.id, "empty_tasks")}>
            {isError(props.validationErrors, props.baseData.id, "empty_tasks") ?
                <FormErrorMessage color={getErrorColor(props.validationErrors, props.baseData.id, "empty_tasks")}>
                    {getErrorMessage(props.validationErrors, props.baseData.id, "empty_tasks")}
                </FormErrorMessage>
                : <FormHelperText></FormHelperText>}
            </FormControl>


            <DeleteButton
                component={props.baseData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </>
    )
}

export default BaseInspectorForm;