import { Grid, Text, FormControl, Switch, GridItem } from '@chakra-ui/react'
import ActionSlider from './ActionSlider'
import ActionToggle from './ActionToggle'
import ActionSelect from './ActionSelect'

const Action = (props) => {
    if (Object.keys(props).length > 0) {
        return (
            <>
                <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                    <Text size='lg' fontWeight='bold' mb='2'>
                        {props.text}
                    </Text>
                    {
                        props.actions.map((action, index) => {
                            return <Grid key={index}>
                                {
                                    // Bugfix
                                    action.title === 'bugfix' ?
                                        <GridItem my={2}>
                                            <Text size='lg' fontWeight='bold' mb='2'>
                                                Bugfixes
                                            </Text>
                                            <FormControl display='flex' justifyContent='center' >
                                                <Switch size='lg' />
                                            </FormControl>
                                        </GridItem>
                                        :
                                        // Unit Test
                                        action.title === 'unittest' ?
                                            <GridItem my={2}>
                                                <Text size='lg' fontWeight='bold' mb='2'>
                                                    Unit Test
                                                </Text>
                                                <FormControl display='flex' justifyContent='center' >
                                                    <Switch size='lg' />
                                                </FormControl>
                                            </GridItem>
                                            :
                                            // Integration Test
                                            action.title === 'integrationtest' ?
                                                <GridItem my={2}>
                                                    <Text size='lg' fontWeight='bold' mb='2'>
                                                        Integration Test
                                                    </Text>
                                                    <FormControl display='flex' justifyContent='center' >
                                                        <Switch size='lg' />
                                                    </FormControl>
                                                </GridItem>
                                                :
                                                // Meeting
                                                action.title === 'meetings' ?
                                                    <GridItem my={2}>
                                                        <Text size='lg' fontWeight='bold' mb='2'>
                                                            Meetings
                                                        </Text>
                                                        <ActionSlider lower_limit={action.lower_limit} upper_limit={action.upper_limit} />
                                                    </GridItem>
                                                    :
                                                    // Training
                                                    action.title === 'training' ?
                                                        <GridItem my={2}>
                                                            <Text size='lg' fontWeight='bold' mb='2'>
                                                                Trainings
                                                            </Text>
                                                            <ActionSlider lower_limit={action.lower_limit} upper_limit={action.upper_limit} />
                                                        </GridItem>
                                                        :
                                                        // Team Event
                                                        action.title === 'teamevent' ?
                                                            <GridItem my={2}>
                                                                <Text size='lg' fontWeight='bold' mb='2'>
                                                                    Team Event
                                                                </Text>
                                                                <ActionToggle />
                                                            </GridItem>
                                                            :
                                                            // Salary
                                                            action.title === 'salary' ?
                                                                <GridItem my={2}>
                                                                    <Text size='lg' fontWeight='bold' mb='2'>
                                                                        Salary
                                                                    </Text>
                                                                    <ActionSelect selectionText="Select salary for next sprint" selection={['Below Average', 'Average', 'Above Average']} />
                                                                </GridItem>
                                                                :
                                                                // Overtime
                                                                action.title === 'overtime' ?
                                                                    <GridItem my={2}>
                                                                        <Text size='lg' fontWeight='bold' mb='2'>
                                                                            Overtime
                                                                        </Text>
                                                                        <ActionSelect selectionText="Select overtime for next sprint" selection={['Leave early', 'Normal hours', 'Encourage overtime', 'Enforce overtime']} />
                                                                    </GridItem>
                                                                    :
                                                                    <></>
                                }
                            </Grid>
                        })
                    }
                </Grid>
            </>
        )
    } else {
        return <></>
    }
}

export default Action