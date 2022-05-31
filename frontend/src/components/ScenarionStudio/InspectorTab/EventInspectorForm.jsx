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
import {useEffect, useState} from "react";

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

    const onChangeEndConditionType = (event) => {
        setEndConditionType(event.target.value)
    }

    const onChangeEndConditionLimit = (value) => {
        setEndConditionLimit(value)
    }

    const onChangeLimitType = (event) => {
        setLimitType(event.target.value)
    }

    const handleChangeDuration = (valueString) => {
        setDuration(parseDays(valueString))
    };

    const handleChangeBudget = (value) => {
        setBudget(value)
    };

    const handleChangeEasyTasks = (value) => {
        setEasyTasks(value)
    };

    const handleChangeMediumTasks = (value) => {
        setMediumTasks(value)
    };

    const handleChangeHardTasks = (value) => {
        setHardTasks(value)
    };

    const handleChangeStress = (value) => {
        setStress(value)
    };

    const handleChangeMotivation = (value) => {
        setMotivation(value)
    };

    useEffect(() => {
        props.eventData.displayName = displayName;
        props.eventData.trigger.type = endConditionType;
        props.eventData.trigger.limit = endConditionLimit;
        props.eventData.trigger.limit_type = limitType;
        props.eventData.budget = budget;
        props.eventData.duration = duration;
        props.eventData.easy_tasks = easyTasks;
        props.eventData.medium_tasks = mediumTasks;
        props.eventData.hard_tasks = hardTasks;
        props.eventData.stress = stress;
        props.eventData.motivation = motivation;
    }, [displayName, endConditionType, endConditionLimit, limitType, budget, duration, easyTasks, mediumTasks, hardTasks, stress, motivation])

    return (
        <VStack maxW="300px" alignItems="flex-start" mb={5}>
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
            <Divider/>
            <Box h={3}/>
            <MarkdownTextfield
                data={props.eventData}
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
        </VStack>
    )
}

export default EventInspectorForm;