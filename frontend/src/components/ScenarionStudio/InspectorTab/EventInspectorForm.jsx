import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
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
import {useState} from "react";
import DeleteButton from "./DeleteButton";

const EventInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.eventData?.displayName);
    const [endConditionType, setEndConditionType] = useState(props.eventData?.trigger?.type);
    const [endConditionLimit, setEndConditionLimit] = useState(props.eventData?.trigger?.limit);
    const [limitType, setLimitType] = useState(props.eventData?.trigger?.limit_type);

    const formatDays = (val) => val + ` days`
    const parseDays = (val) => val.replace(/^\days/, '')

    const [duration, setDuration] = useState(props.eventData.duration);
    const [budget, setBudget] = useState(props.eventData.budget);
    const [easyTasks, setEasyTasks] = useState(props.eventData.easy_tasks);
    const [mediumTasks, setMediumTasks] = useState(props.eventData.medium_tasks);
    const [hardTasks, setHardTasks] = useState(props.eventData.hard_tasks);
    const [stress, setStress] = useState(props.eventData.stress);
    const [motivation, setMotivation] = useState(props.eventData.motivation);

    const onChangeDisplayName = (value) => {
        setDisplayName(value)
    }

    const onSubmitDisplayName = () => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.displayName = displayName;
            })
    }

    const onChangeEndConditionType = (event) => {
        setEndConditionType(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger.type = event.target.value;
            })
    }

    const onChangeEndConditionLimit = (value) => {
        setEndConditionLimit(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger.limit = value;
            })
    }

    const onChangeLimitType = (event) => {
        setLimitType(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger.limit_type = event.target.value;
            })
    }

    const handleChangeDuration = (valueString) => {
        setDuration(parseDays(valueString))
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.duration = valueString;
            })
    };

    const handleChangeBudget = (value) => {
        setBudget(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.budget = value;
            })
    };

    const handleChangeEasyTasks = (value) => {
        setEasyTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.easy_tasks = value;
            })
    };

    const handleChangeMediumTasks = (value) => {
        setMediumTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.medium_tasks = value;
            })
    };

    const handleChangeHardTasks = (value) => {
        setHardTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.hard_tasks = value;
            })
    };

    const handleChangeStress = (value) => {
        setStress(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.stress = value;
            })
    };

    const handleChangeMotivation = (value) => {
        setMotivation(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.motivation = value;
            })
    };

    return (
        <VStack maxW="300px" alignItems="flex-start" mb={5}>
            <Editable value={displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)} onSubmit={onSubmitDisplayName}>
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
            <MarkdownTextfield
                data={props.eventData}
                updateEditorList={props.updateEditorList}
            />
            <Box h={3}/>
            <FormControl>
                <FormLabel color="gray.400" htmlFor="">Trigger</FormLabel>
                <Select placeholder='Select condition' value={endConditionType}
                        onChange={(event) => onChangeEndConditionType(event)}>
                    <option value='budget'>Budget</option>
                    <option value='duration'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='stress'>Stress Level</option>
                    <option value='motivation'>Motivation</option>
                </Select>

                <Box h={3}/>

                {/* TODO extract component*/}
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
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
                <HStack w="full" justifyContent="space-between">
                    <FormHelperText mt={1} mx={1}>Type</FormHelperText>
                    <FormHelperText mt={1} mx={1}>Limit</FormHelperText>
                </HStack>
            </FormControl>


            <Box h={3}/>

            <FormControl>
                <FormLabel color="gray.400" htmlFor="budget">Impact</FormLabel>
                <NumberInput id="budget" value={budget} onChange={(value) => handleChangeBudget(value)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Budget</FormHelperText>

                <Box h={5}/>

                <NumberInput id="duration" onChange={(valueString) => handleChangeDuration(valueString)}
                             value={formatDays(duration)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Duration</FormHelperText>

                <Box h={5}/>

                <NumberInput id="easytasks" value={easyTasks} onChange={(value) => handleChangeEasyTasks(value)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Easy Tasks</FormHelperText>

                <Box h={5}/>

                <NumberInput id="mediumtasks" value={mediumTasks} onChange={(value) => handleChangeMediumTasks(value)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Medium Tasks</FormHelperText>

                <Box h={5}/>

                <NumberInput id="hardtasks" value={hardTasks} onChange={(value) => handleChangeHardTasks(value)}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Hard Tasks</FormHelperText>

                <Box h={5}/>

                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeStress(value)}
                    value={stress}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Stress</FormHelperText>

                <Box h={5}/>

                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeMotivation(value)}
                    value={motivation}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Motivation</FormHelperText>

            </FormControl>
            <DeleteButton
                component={props.eventData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </VStack>
    )
}

export default EventInspectorForm;