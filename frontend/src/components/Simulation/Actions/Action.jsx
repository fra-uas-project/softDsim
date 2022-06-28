import { Flex, FormControl, Grid, Switch } from '@chakra-ui/react'
import ActionSlider from './ActionSlider'
import ActionToggle from './ActionToggle'
import ActionSelect from './ActionSelect'
import { actionIcon } from "../../ScenarionStudio/scenarioStudioData"
import ActionElement from "./ActionElement";

const Action = (props) => {
    if (Object.keys(props).length > 0) {
        return (
            <Grid borderRadius="xl">
                {
                    // Bugfix
                    props.action.action === 'bugfix' ?
                        <ActionElement title="Bugfixing" secondaryText="Start Bugfixing" icon={actionIcon.BUGFIX} tooltip={"Fix known bugs. Bugs are discovered after unit testing"}>
                            <FormControl display="flex" justifyContent="end">
                                <Switch onChange={(event) => props.onSelectAction({
                                    type: props.action.action,
                                    value: event.target.checked
                                })} size='lg' defaultChecked={props.actionDefaultValues.bugfix} />
                            </FormControl>
                        </ActionElement>
                        :
                        // Unit Test
                        props.action.action === 'unittest' ?
                            <ActionElement title="Unit Testing" secondaryText="Start Unit Testing"
                                icon={actionIcon.UNITTEST} tooltip={"Test specific parts for functionality and/or bugs"}>
                                <FormControl display="flex" justifyContent="end">
                                    <Switch onChange={(event) => props.onSelectAction({
                                        type: props.action.action,
                                        value: event.target.checked
                                    })} size='lg' defaultChecked={props.actionDefaultValues.unittest} />
                                </FormControl>
                            </ActionElement>
                            :
                            // Integration Test
                            props.action.action === 'integrationtest' ?
                                <ActionElement title="Integration Testing" secondaryText="Start Integration Testing"
                                    icon={actionIcon.INTEGRATIONTEST} tooltip={"Integration testing should be done after unit testing and bug fixing"}>
                                    <FormControl display="flex" justifyContent="end">
                                        <Switch onChange={(event) => props.onSelectAction({
                                            type: props.action.action,
                                            value: event.target.checked
                                        })} size='lg' defaultChecked={props.actionDefaultValues.integrationtest} />
                                    </FormControl>
                                </ActionElement>
                                :
                                // Meeting
                                props.action.action === 'meetings' ?
                                    <ActionElement title="Meetings" secondaryText="Set number of meetings"
                                        icon={actionIcon.MEETINGS} tooltip={"Meetings are important for familiarity, set them regulary"}>
                                        <Flex w="full">
                                            <ActionSlider onSlide={(event) => props.onSelectAction({
                                                type: props.action.action,
                                                value: event
                                            })} lower_limit={props.action.lower_limit}
                                                upper_limit={props.action.upper_limit} />
                                        </Flex>
                                    </ActionElement>
                                    :
                                    // Training
                                    props.action.action === 'training' ?
                                        <ActionElement title="Training" secondaryText="Set training for employees"
                                            icon={actionIcon.TRAINING} tooltip={"Training is important for motivation and fmailiarity"}>
                                            <Flex w="full">
                                                <ActionSlider onSlide={(event) => props.onSelectAction({
                                                    type: props.action.action,
                                                    value: event
                                                })} lower_limit={props.action.lower_limit}
                                                    upper_limit={props.action.upper_limit} />
                                            </Flex>
                                        </ActionElement>
                                        :
                                        // Team Event
                                        props.action.action === 'teamevent' ?
                                            <ActionElement title="Team Event" secondaryText="Schedule teamevent"
                                                icon={actionIcon.TEAMEVENT} tooltip={"Team events reduce stress and rise motivation"}>
                                                <ActionToggle onEventbutton={(event) => props.onSelectAction({
                                                    type: props.action.action,
                                                    value: event
                                                })} textTrue="Team Event Scheduled"
                                                    textFalse="Schedule Team Event" />
                                            </ActionElement>
                                            :
                                            // Salary
                                            props.action.action === 'salary' ?
                                                <ActionElement title="Salary"
                                                    secondaryText="Change Salary of employees"
                                                    icon={actionIcon.SALARY} tooltip={"Different salarys for the employees can be set here"}>
                                                    <ActionSelect onActionSelect={(event) => props.onSelectAction({
                                                        type: props.action.action,
                                                        value: event
                                                    })} type="salary"
                                                        selection={['Below Average', 'Average', 'Above Average']} />
                                                </ActionElement>
                                                :
                                                // Overtime
                                                props.action.action === 'overtime' ?
                                                    <ActionElement title="Overtime"
                                                        secondaryText="Change working hours"
                                                        icon={actionIcon.OVERTIME} tooltip={"Overtime could be neccessary for the project but will rise stress"}>
                                                        <ActionSelect
                                                            onActionSelect={(event) => props.onSelectAction({
                                                                type: props.action.action,
                                                                value: event
                                                            })} type="overtime"
                                                            selection={['Leave early', 'Normal hours', 'Encourage overtime', 'Enforce overtime']} />
                                                    </ActionElement>
                                                    :
                                                    <></>
                }

            </Grid>
        )
    } else {
        return <></>
    }
}

export default Action