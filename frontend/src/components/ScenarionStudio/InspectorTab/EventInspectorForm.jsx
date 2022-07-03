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
    const [endConditionType, setEndConditionType] = useState(props.eventData?.trigger_type);
    const [endConditionLimit, setEndConditionLimit] = useState(props.eventData?.trigger_value);
    const [limitType, setLimitType] = useState(props.eventData?.trigger_type);

    const formatDays = (val) => val + ` days`
    const parseDays = (val) => val.replace(/^\days/, '')
    
    const [duration, setDuration] = useState(props.eventData.effects.find((effect) => effect.type === "time")?.value || 0);
    const [budget, setBudget] = useState(props.eventData.effects.find((effect) => effect.type === "budget")?.value);
    const [easyTasks, setEasyTasks] = useState(props.eventData.effects.find((effect) => effect.type === "tasks")?.easy_tasks);
    const [mediumTasks, setMediumTasks] = useState(props.eventData.effects.find((effect) => effect.type === "tasks")?.medium_tasks);
    const [hardTasks, setHardTasks] = useState(props.eventData.effects.find((effect) => effect.type === "tasks")?.hard_tasks);
    const [stress, setStress] = useState(props.eventData.effects.find((effect) => effect.type === "stress")?.value);
    const [motivation, setMotivation] = useState(props.eventData.effects.find((effect) => effect.type === "motivation")?.value);
    const [familiarity, setFamiliarity] = useState(props.eventData.effects.find((effect) => effect.type === "familiarity")?.value);

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
                component.trigger_type = event.target.value;
            })
    }

    const onChangeEndConditionLimit = (value) => {
        setEndConditionLimit(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger_value = value;
            })
    }

    const onChangeLimitType = (event) => {
        setLimitType(event.target.value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                component.trigger_comparator = event.target.value;
            })
    }

    const handleChangeDuration = (valueString) => {
        setDuration(parseDays(valueString))
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "time")
                if(target.length) {
                    target.forEach(effect => effect.value = valueString)
                } else {
                    component.effects.push({
                        type: "time",
                        value: valueString
                    });
                }
            })
    };

    const handleChangeBudget = (value) => {
        setBudget(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "budget")
                if(target.length) {
                    target.forEach(effect => effect.value = value)
                } else {
                    component.effects.push({
                        type: "budget",
                        value: value
                    });
                }
            })
    };

    const handleChangeEasyTasks = (value) => {
        setEasyTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "tasks")
                if(target.length) {
                    target.forEach(effect => effect.easy_tasks = value)
                } else {
                    component.effects.push({
                        type: "tasks",
                        easy_tasks: value,
                        medium_tasks: 0,
                        hard_tasks: 0
                    });
                }
            })
    };

    const handleChangeMediumTasks = (value) => {
        setMediumTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "tasks")
                if(target.length) {
                    target.forEach(effect => effect.medium_tasks = value)
                } else {
                    component.effects.push({
                        type: "tasks",
                        easy_tasks: 0,
                        medium_tasks: value,
                        hard_tasks: 0
                    });
                }
            })
    };

    const handleChangeHardTasks = (value) => {
        setHardTasks(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "tasks")
                if(target.length) {
                    target.forEach(effect => effect.hard_tasks = value)
                } else {
                    component.effects.push({
                        type: "tasks",
                        easy_tasks: 0,
                        medium_tasks: 0,
                        hard_tasks: value
                    });
                }            })
    };

    const handleChangeStress = (value) => {
        setStress(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "stress")
                if(target.length) {
                    target.forEach(effect => effect.value = value)
                } else {
                    component.effects.push({
                        type: "stress",
                        value: value
                    });
                }
            })
    };

    const handleChangeFamiliarity = (value) => {
        setFamiliarity(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "familiarity")
                if(target.length) {
                    target.forEach(effect => effect.value = value)
                } else {
                    component.effects.push({
                        type: "familiarity",
                        value: value
                    });
                }
            })
    };

    const handleChangeMotivation = (value) => {
        setMotivation(value)
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.eventData.id)
                const target = component.effects.filter((e) => e.type === "motivation")
                if(target.length) {
                    target.forEach(effect => effect.value = value)
                } else {
                    component.effects.push({
                        type: "motivation",
                        value: value
                    });
                }
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
                    <option value='time'>Duration</option>
                    <option value='tasks_done'>Tasks done</option>
                    <option value='stress'>Stress Level</option>
                    <option value='motivation'>Motivation</option>
                    <option value='familiarity'>Familiarity</option>
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
                        step={(endConditionType === "motivation" || endConditionType === "stress" || endConditionType === "familiarity") ? 0.01 : 1}
                        max={(endConditionType === "motivation" || endConditionType === "stress" || endConditionType === "familiarity") ? 1 : Infinity}
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

                <Box h={5}/>

                <NumberInput
                    step={0.01}
                    max={1}
                    onChange={(value) => handleChangeFamiliarity(value)}
                    value={familiarity}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Familiarity</FormHelperText>

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