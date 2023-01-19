import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl, FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {validationErrorColors, validationErrorTypes} from "../scenarioValidation";

const BaseInspectorForm = (props) => {
    const formatDays = (val) => val + ` days`
    const parseDays = (val) => val.replace(/^\days/, '')

    const [templateName, setTemplateName] = useState(props.baseData.template_name);
    const [duration, setDuration] = useState(props.baseData.duration);
    const [budget, setBudget] = useState(props.baseData.budget);
    const [easyTasks, setEasyTasks] = useState(props.baseData.easy_tasks);
    const [mediumTasks, setMediumTasks] = useState(props.baseData.medium_tasks);
    const [hardTasks, setHardTasks] = useState(props.baseData.hard_tasks);

    const handleTemplateName = (event) => {
        setTemplateName(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.template_name = event.target.value;
            })
    };

    const handleChangeDuration = (valueString) => {
        setDuration(parseDays(valueString))
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.duration = valueString;
            })
    };

    const handleChangeBudget = (value) => {
        setBudget(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.budget = value;
            })
    };

    const handleChangeEasyTasks = (value) => {
        setEasyTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.easy_tasks = value;
            })
    };

    const handleChangeMediumTasks = (value) => {
        setMediumTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.medium_tasks = value;
            })
    };

    const handleChangeHardTasks = (value) => {
        setHardTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.baseData.id)
                component.hard_tasks = value;
            })
    };

    const isError = (objectKey) => {
        return props.validationErrors.some(error => error.error.path.includes(objectKey))
    }

    const getError = (objectKey) => {
        return props.validationErrors.filter(error => error.error.path.includes(objectKey))[0]
    }

    const getErrorType = (objectKey) => {
        return props.validationErrors.filter(error => error.error.path.includes(objectKey))[0].error.type
    }

    const getErrorMessage = (objectKey) => {
        return props.validationErrors.filter(error => error.error.path.includes(objectKey))[0].error.message
    }

    const getErrorColor = (objectKey) => {
        if (isError(objectKey)) {
            if (getErrorType(objectKey) === validationErrorTypes.WARNING) {
                return `${validationErrorColors.WARNING}.500`
            } else if (getErrorType(objectKey) === validationErrorTypes.INFO) {
                return `${validationErrorColors.INFO}.500`
            } else if (getErrorType(objectKey) === validationErrorTypes.INTERNAL_ERROR) {
                return `${validationErrorColors.INTERNAL_ERROR}.500`
            } else if (getErrorType(objectKey) === validationErrorTypes.ERROR) {
                return `${validationErrorColors.ERROR}.500`
            } else {
                // default red for unknown
                return undefined
            }
        }
    }

    useEffect(() => {
        console.log("valE")
        console.log(props.validationErrors)
    }, [])

    return (
        <>
            <Editable defaultValue='Base Information' w="full" fontWeight="bold" isDisabled>
                <EditablePreview/>
                <EditableInput/>
            </Editable>
            <Divider/>

            <Box h={3} />

            <FormControl isInvalid={isError("template_name")} >
                <FormLabel color="gray.400" htmlFor="templateName">Scenario Name</FormLabel>
                <Input id="templateName" value={templateName} errorBorderColor={getErrorColor("template_name")}
                       onChange={(event) => {handleTemplateName(event)}}/>
                {isError("template_name") ?
                    <FormErrorMessage color={getErrorColor("template_name")}>
                        {getErrorMessage("template_name")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>
            <Box h={3}/>

            <FormControl isInvalid={isError("text")}>
                <MarkdownTextfield
                    key={props.baseData.id}
                    data={props.baseData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor("text")}
                />
                {isError("text") ?
                    <FormErrorMessage mt={4} color={getErrorColor("text")}>
                        {getError("text")?.error.message}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <FormControl isInvalid={isError("budget")} >
                <FormLabel color="gray.400" htmlFor="budget">Budget</FormLabel>
                <NumberInput w="full" min={0} id="budget" value={budget} errorBorderColor={getErrorColor("budget")}
                             onChange={(value) => handleChangeBudget(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError("budget") ?
                    <FormErrorMessage color={getErrorColor("budget")}>
                        {getErrorMessage("budget")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError("duration")} >
                <FormLabel color="gray.400" htmlFor="duration">Duration</FormLabel>
                <NumberInput id="duration" w="full" min={0} errorBorderColor={getErrorColor(duration)}
                             onChange={(valueString) => handleChangeDuration(valueString)} value={formatDays(duration)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError("duration") ?
                    <FormErrorMessage color={getErrorColor("duration")}>
                        {getErrorMessage("duration")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError("easy_tasks")} >
                <FormLabel color="gray.400" htmlFor="easytasks">Easy Tasks</FormLabel>
                <NumberInput min={0} w="full" id="easytasks" value={easyTasks} errorBorderColor={getErrorColor("easy_tasks")}
                             onChange={(value) => handleChangeEasyTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError("easy_tasks") ?
                    <FormErrorMessage color={getErrorColor("easy_tasks")}>
                        {getErrorMessage("easy_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError("medium_tasks")} >
                <FormLabel color="gray.400" htmlFor="mediumtasks">Medium Tasks</FormLabel>
                <NumberInput min={0} w="full" id="mediumtasks" value={mediumTasks} errorBorderColor={getErrorColor("medium_tasks")}
                             onChange={(value) => handleChangeMediumTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError("medium_tasks") ?
                    <FormErrorMessage color={getErrorColor("medium_tasks")}>
                        {getErrorMessage("medium_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError("hard_tasks")} >
                <FormLabel color="gray.400" htmlFor="hardtasks">Hard Tasks</FormLabel>
                <NumberInput w="full" min={0} id="hardtasks" value={hardTasks} errorBorderColor={getErrorColor("hard_tasks")}
                             onChange={(value) => handleChangeHardTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError("hard_tasks") ?
                    <FormErrorMessage color={getErrorColor("hard_tasks")}>
                        {getErrorMessage("hard_tasks")}
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