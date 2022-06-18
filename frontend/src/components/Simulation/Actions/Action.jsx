import { Grid, Text, FormControl, Switch, GridItem } from '@chakra-ui/react'
import ActionSlider from './ActionSlider'
import ActionToggle from './ActionToggle'
import ActionSelect from './ActionSelect'

const Action = (props) => {
    if (Object.keys(props).length > 0) {
        return (
            <>
                <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                    {
                        // Bugfix
                        props.action.action === 'bugfix' ?
                            <GridItem my={2}>
                                <Text size='lg' fontWeight='bold' mb='2'>
                                    Bugfixes
                                </Text>
                                <FormControl display='flex' justifyContent='center' >
                                    <Switch onChange={(event) => props.onSelectAction({
                                        type: props.action.action,
                                        value: event.target.checked
                                    })} size='lg' />
                                </FormControl>
                            </GridItem>
                            :
                            // Unit Test
                            props.action.action === 'unittest' ?
                                <GridItem my={2}>
                                    <Text size='lg' fontWeight='bold' mb='2'>
                                        Unit Test
                                    </Text>
                                    <FormControl display='flex' justifyContent='center' >
                                        <Switch onChange={(event) => props.onSelectAction({
                                            type: props.action.action,
                                            value: event.target.checked
                                        })} size='lg' />
                                    </FormControl>
                                </GridItem>
                                :
                                // Integration Test
                                props.action.action === 'integrationtest' ?
                                    <GridItem my={2}>
                                        <Text size='lg' fontWeight='bold' mb='2'>
                                            Integration Test
                                        </Text>
                                        <FormControl display='flex' justifyContent='center' >
                                            <Switch onChange={(event) => props.onSelectAction({
                                                type: props.action.action,
                                                value: event.target.checked
                                            })} size='lg' />
                                        </FormControl>
                                    </GridItem>
                                    :
                                    // Meeting
                                    props.action.action === 'meetings' ?
                                        <GridItem my={2}>
                                            <Text size='lg' fontWeight='bold' mb='2'>
                                                Meetings
                                            </Text>
                                            <ActionSlider onSlide={(event) => props.onSelectAction({
                                                type: props.action.action,
                                                value: event
                                            })} lower_limit={props.action.lower_limit} upper_limit={props.action.upper_limit} />
                                        </GridItem>
                                        :
                                        // Training
                                        props.action.action === 'training' ?
                                            <GridItem my={2}>
                                                <Text size='lg' fontWeight='bold' mb='2'>
                                                    Trainings
                                                </Text>
                                                <ActionSlider onSlide={(event) => props.onSelectAction({
                                                    type: props.action.action,
                                                    value: event
                                                })} lower_limit={props.action.lower_limit} upper_limit={props.action.upper_limit} />
                                            </GridItem>
                                            :
                                            // Team Event
                                            props.action.action === 'teamevent' ?
                                                <GridItem my={2}>
                                                    <Text size='lg' fontWeight='bold' mb='2'>
                                                        Team Event
                                                    </Text>
                                                    <ActionToggle onEventbutton={(event) => props.onSelectAction({
                                                        type: props.action.action,
                                                        value: event
                                                    })} />
                                                </GridItem>
                                                :
                                                // Salary
                                                props.action.action === 'salary' ?
                                                    <GridItem my={2}>
                                                        <Text size='lg' fontWeight='bold' mb='2'>
                                                            Salary
                                                        </Text>
                                                        <ActionSelect onActionSelect={(event) => props.onSelectAction({
                                                            type: props.action.action,
                                                            value: event
                                                        })} type="salary" selection={['Below Average', 'Average', 'Above Average']} />
                                                    </GridItem>
                                                    :
                                                    // Overtime
                                                    props.action.action === 'overtime' ?
                                                        <GridItem my={2}>
                                                            <Text size='lg' fontWeight='bold' mb='2'>
                                                                Overtime
                                                            </Text>
                                                            <ActionSelect onActionSelect={(event) => props.onSelectAction({
                                                                type: props.action.action,
                                                                value: event
                                                            })} type="overtime" selection={['Leave early', 'Normal hours', 'Encourage overtime', 'Enforce overtime']} />
                                                        </GridItem>
                                                        :
                                                        <></>
                    }

                </Grid>
            </>
        )
    } else {
        return <></>
    }
}

export default Action