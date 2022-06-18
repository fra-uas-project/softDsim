import {Flex, FormControl, Grid, Switch} from '@chakra-ui/react'
import ActionSlider from './ActionSlider'
import ActionToggle from './ActionToggle'
import ActionSelect from './ActionSelect'
import {actionIcon} from "../../../utils/utils";
import ActionElement from "./ActionElement";

const Action = (props) => {
    if (Object.keys(props).length > 0) {
        return (
            <Grid borderRadius="xl">
                {
                    // Bugfix
                    props.action.action === 'bugfix' ?
                        <ActionElement title="Bugfixing" secondaryText="Start Bugfixing" icon={actionIcon.BUGFIX}>
                            <FormControl display="flex" justifyContent="end">
                                <Switch onChange={(event) => props.onSelectAction({
                                    type: props.action.action,
                                    value: event.target.checked
                                })} size='lg'/>
                            </FormControl>
                        </ActionElement>
                        :
                        // Unit Test
                        props.action.action === 'unittest' ?
                            <ActionElement title="Unit Testing" secondaryText="Start Unit Testing"
                                           icon={actionIcon.UNITTEST}>
                                <FormControl display="flex" justifyContent="end">
                                    <Switch onChange={(event) => props.onSelectAction({
                                        type: props.action.action,
                                        value: event.target.checked
                                    })} size='lg'/>
                                </FormControl>
                            </ActionElement>
                            :
                            // Integration Test
                            props.action.action === 'integrationtest' ?
                                <ActionElement title="Integration Testing" secondaryText="Start Integration Testing"
                                               icon={actionIcon.INTEGRATIONTEST}>
                                    <FormControl display="flex" justifyContent="end">
                                        <Switch onChange={(event) => props.onSelectAction({
                                            type: props.action.action,
                                            value: event.target.checked
                                        })} size='lg'/>
                                    </FormControl>
                                </ActionElement>
                                :
                                // Meeting
                                props.action.action === 'meetings' ?
                                    <ActionElement title="Meetings" secondaryText="Set number of meetings"
                                                   icon={actionIcon.MEETINGS}>
                                        <Flex w="full">
                                            <ActionSlider onSlide={(event) => props.onSelectAction({
                                                type: props.action.action,
                                                value: event
                                            })} lower_limit={props.action.lower_limit}
                                                          upper_limit={props.action.upper_limit}/>
                                        </Flex>
                                    </ActionElement>
                                    :
                                    // Training
                                    props.action.action === 'training' ?
                                        <ActionElement title="Training" secondaryText="Set training for employees"
                                                       icon={actionIcon.TRAINING}>
                                            <Flex w="full">
                                                <ActionSlider onSlide={(event) => props.onSelectAction({
                                                    type: props.action.action,
                                                    value: event
                                                })} lower_limit={props.action.lower_limit}
                                                              upper_limit={props.action.upper_limit}/>
                                            </Flex>
                                        </ActionElement>
                                        :
                                        // Team Event
                                        props.action.action === 'teamevent' ?
                                            <ActionElement title="Team Event" secondaryText="Schedule teamevent"
                                                           icon={actionIcon.TEAMEVENT}>
                                                <ActionToggle onEventbutton={(event) => props.onSelectAction({
                                                    type: props.action.action,
                                                    value: event
                                                })} textTrue="Team Event Scheduled"
                                                              textFalse="Schedule Team Event"/>
                                            </ActionElement>
                                            :
                                            // Salary
                                            props.action.action === 'salary' ?
                                                <ActionElement title="Salary"
                                                               secondaryText="Change Salary of employees"
                                                               icon={actionIcon.SALARY}>
                                                    <ActionSelect onActionSelect={(event) => props.onSelectAction({
                                                        type: props.action.action,
                                                        value: event
                                                    })} type="salary"
                                                                  selection={['Below Average', 'Average', 'Above Average']}/>
                                                </ActionElement>
                                                :
                                                // Overtime
                                                props.action.action === 'overtime' ?
                                                    <ActionElement title="Overtime"
                                                                   secondaryText="Change working hours"
                                                                   icon={actionIcon.OVERTIME}>
                                                        <ActionSelect
                                                            onActionSelect={(event) => props.onSelectAction({
                                                                type: props.action.action,
                                                                value: event
                                                            })} type="overtime"
                                                            selection={['Leave early', 'Normal hours', 'Encourage overtime', 'Enforce overtime']}/>
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