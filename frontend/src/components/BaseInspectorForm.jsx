import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview, FormControl, FormHelperText,
    FormLabel, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper
} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const BaseInspectorForm = (props) => {
    const formatDays = (val) => val + ` days`
    const parseDays = (val) => val.replace(/^\days/, '')

    const [duration, setDuration] = useState(props.baseData.duration);
    const [budget, setBudget] = useState(props.baseData.budget);
    const [easyTasks, setEasyTasks] = useState(props.baseData.easy_tasks);
    const [mediumTasks, setMediumTasks] = useState(props.baseData.medium_tasks);
    const [hardTasks, setHardTasks] = useState(props.baseData.hard_tasks);

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

    useEffect(() => {
        props.baseData.duration = duration;
        props.baseData.budget = budget;
        props.baseData.easy_tasks = easyTasks;
        props.baseData.medium_tasks = mediumTasks;
        props.baseData.hard_tasks = hardTasks;
    }, [duration, budget, easyTasks, mediumTasks, hardTasks])

    return (
        <>
            <Editable defaultValue='Base Information' w="full" fontWeight="bold" isDisabled>
                <EditablePreview/>
                <EditableInput/>
            </Editable>
            <Divider/>

            <Box h={3}/>

            <FormControl>
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