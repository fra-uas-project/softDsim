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
import {useEffect, useState} from "react";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

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

            <FormControl isInvalid={isError(props.validationErrors, "template_name")} >
                <FormLabel color="gray.400" htmlFor="templateName">Scenario Name</FormLabel>
                <Input id="templateName" value={templateName} errorBorderColor={getErrorColor(props.validationErrors, "template_name")}
                       onChange={(event) => {handleTemplateName(event)}}/>
                {isError(props.validationErrors,"template_name") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "template_name")}>
                        {getErrorMessage(props.validationErrors, "template_name")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>
            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,"text")}>
                <MarkdownTextfield
                    key={props.baseData.id}
                    data={props.baseData}
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

            <FormControl isInvalid={isError(props.validationErrors,"budget")} >
                <FormLabel color="gray.400" htmlFor="budget">Budget</FormLabel>
                <NumberInput w="full" min={0} id="budget" value={budget} errorBorderColor={getErrorColor(props.validationErrors, "budget")}
                             onChange={(value) => handleChangeBudget(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,"budget") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "budget")}>
                        {getErrorMessage(props.validationErrors, "budget")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,"duration")} >
                <FormLabel color="gray.400" htmlFor="duration">Duration</FormLabel>
                <NumberInput id="duration" w="full" min={0} errorBorderColor={getErrorColor(props.validationErrors, "duration")}
                             onChange={(valueString) => handleChangeDuration(valueString)} value={formatDays(duration)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,"duration") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "duration")}>
                        {getErrorMessage(props.validationErrors, "duration")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,"easy_tasks")} >
                <FormLabel color="gray.400" htmlFor="easytasks">Easy Tasks</FormLabel>
                <NumberInput min={0} w="full" id="easytasks" value={easyTasks} errorBorderColor={getErrorColor(props.validationErrors, "easy_tasks")}
                             onChange={(value) => handleChangeEasyTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,"easy_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "easy_tasks")}>
                        {getErrorMessage(props.validationErrors, "easy_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,"medium_tasks")} >
                <FormLabel color="gray.400" htmlFor="mediumtasks">Medium Tasks</FormLabel>
                <NumberInput min={0} w="full" id="mediumtasks" value={mediumTasks} errorBorderColor={getErrorColor(props.validationErrors, "medium_tasks")}
                             onChange={(value) => handleChangeMediumTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,"medium_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "medium_tasks")}>
                        {getErrorMessage(props.validationErrors, "medium_tasks")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

                <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors,"hard_tasks")} >
                <FormLabel color="gray.400" htmlFor="hardtasks">Hard Tasks</FormLabel>
                <NumberInput w="full" min={0} id="hardtasks" value={hardTasks} errorBorderColor={getErrorColor(props.validationErrors, "hard_tasks")}
                             onChange={(value) => handleChangeHardTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {isError(props.validationErrors,"hard_tasks") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, "hard_tasks")}>
                        {getErrorMessage(props.validationErrors, "hard_tasks")}
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