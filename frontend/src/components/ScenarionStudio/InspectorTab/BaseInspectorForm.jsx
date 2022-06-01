import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import {useState} from "react";
import MarkdownTextfield from "./MarkdownTextfield";

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

    return (
        <>
            <Editable defaultValue='Base Information' w="full" fontWeight="bold" isDisabled>
                <EditablePreview/>
                <EditableInput/>
            </Editable>
            <Divider/>

            <Box h={3} />

            <FormControl>
                <FormLabel color="gray.400" htmlFor="templateName">Scenario Name</FormLabel>
                <Input id="templateName" value={templateName}
                       onChange={(event) => {handleTemplateName(event)}}/>
                <FormHelperText></FormHelperText>

            <Box h={3}/>

            <MarkdownTextfield
                key={props.baseData.id}
                data={props.baseData}
                updateEditorList={props.updateEditorList}
            />

            <Box h={3}/>


                <FormLabel color="gray.400" htmlFor="budget">Budget</FormLabel>
                <NumberInput min={0} id="budget" value={budget} onChange={(value) => handleChangeBudget(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText></FormHelperText>

                <Box h={3}/>

                <FormLabel color="gray.400" htmlFor="duration">Duration</FormLabel>
                <NumberInput id="duration" min={0} onChange={(valueString) => handleChangeDuration(valueString)} value={formatDays(duration)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText></FormHelperText>

                <Box h={3}/>

                <FormLabel color="gray.400" htmlFor="easytasks">Easy Tasks</FormLabel>
                <NumberInput min={0} id="easytasks" value={easyTasks} onChange={(value) => handleChangeEasyTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText></FormHelperText>

                <Box h={3}/>

                <FormLabel color="gray.400" htmlFor="mediumtasks">Medium Tasks</FormLabel>
                <NumberInput min={0} id="mediumtasks" value={mediumTasks} onChange={(value) => handleChangeMediumTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText></FormHelperText>

                <Box h={3}/>

                <FormLabel color="gray.400" htmlFor="hardtasks">Hard Tasks</FormLabel>
                <NumberInput min={0} id="hardtasks" value={hardTasks} onChange={(value) => handleChangeHardTasks(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText></FormHelperText>
            </FormControl>

        </>
    )
}

export default BaseInspectorForm;