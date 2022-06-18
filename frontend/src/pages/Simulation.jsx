import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Skeleton,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Question from "../components/Simulation/Actions/Question";
import Action from "../components/Simulation/Actions/Action"
import ModelSelection from '../components/ModelSelection'
import Skilltype from "../components/Simulation/Actions/Skilltype"
import { getCookie } from "../utils/utils"
import Dashboard from "../components/Simulation/Dashboard/Dashboard";
import MarkdownDisplay from "../components/MarkdownDisplay";

const Simulation = () => {
    const [userScenario, setUserScenario] = useState({});

    const location = useLocation();

    // scenario template data
    const { state } = useLocation();

    const { isOpen, onOpen, onClose } = useDisclosure();

    // current simulation play id
    const [currentSimID, setCurrentSimID] = useState()

    // current simulation type (eg. model, question, segment, event)
    const [currentType, setCurrentType] = useState()

    // validation status of user selected data
    const [dataValidationStatus, setDataValidationStatus] = useState(false)

    // values for simulation
    const [simValues, setSimValues] = useState({})
    const [simTasks, setSimTasks] = useState({
        tasks_todo: 0,
        task_done: 0,
        tasks_unit_tested: 0,
        tasks_integration_tested: 0,
        tasks_bug: 0
    })

    // contains all values from next endpoint
    const [scenarioValues, setScenarioValues] = useState({})

    // contains the values that should be sent to the next endpoint
    const [returnValues, setReturnValues] = useState();

    const [scenarioIsLoading, setScenarioIsLoading] = useState(true);

    // rerender function for actions
    const [rerender, setRerender] = useState(0);

    // rerender function for skilltypes
    const [rerenderSkill, setRerenderSkill] = useState(0);

    // define simulation fragment values
    const [simFragmentActions, setSimFragmentActions] = useState();

    // save all available skilltypes
    const [skillTypes, setSkillTypes] = useState([])

    // save skilltype return object
    const [skillTypeReturn, setSkillTypeReturn] = useState([])

    const fetchUserScenario = () => {
        const userScenarioMock = {
            scn_name: "Scenario 1"
        }
        setUserScenario(userScenarioMock)
    };

    const scenarioPath = () => {
        const url = location.pathname;
        const newUrl = url.slice(0, url.lastIndexOf("/"));
        return newUrl;
    }

    async function handleSelection(event) {
        if (currentType === 'MODEL') {
            setReturnValues({
                scenario_id: currentSimID,
                type: currentType,
                model: event
            })
            setDataValidationStatus(true)
        } else if (currentType === 'QUESTION') {
            const tempReturnValues = {
                scenario_id: currentSimID,
                type: currentType,
                question_collection: event
            }
            setReturnValues(tempReturnValues)
            setDataValidationStatus(true)
        } else if (currentType === 'SIMULATION') {
            var tempSimFragmentActions = simFragmentActions

            // write new value into action fragment
            tempSimFragmentActions[event.type] = event.value

            // set fragment state
            setSimFragmentActions(tempSimFragmentActions)

            const tempReturnValues = {
                scenario_id: currentSimID,
                type: currentType,
                actions: tempSimFragmentActions,
                members: skillTypeReturn
            }

            setReturnValues(tempReturnValues)
            setDataValidationStatus(true)
        }
    }

    function createSkillTypeObject(skillTypesList) {
        // create list that can be returned to next endpoint
        var list = []
        for (const type of skillTypesList) {
            list.push(
                {
                    "skill_type": type,
                    "change": 0
                }
            )
        }
        // set state
        setSkillTypeReturn(list)
        return list
    }

    function resetSkillTypeObject() {
        // reset change values for each skill type, required for displaying on frontend after clicking next
        var tempSKillTypeList = skillTypeReturn
        for (const type in tempSKillTypeList) {
            tempSKillTypeList[type].change = 0
        }

        setSkillTypeReturn(tempSKillTypeList)
    }

    function updateSkillTypeObject(skill, value) {
        // get index of skill that will be updates
        const skillIndex = skillTypeReturn.findIndex(object => {
            return object.skill_type === skill;
        });

        // create temporary object to overwrite current one
        var tempSkillTypeReturn = skillTypeReturn

        // update change value
        tempSkillTypeReturn[skillIndex].change = tempSkillTypeReturn[skillIndex].change + value

        // update state
        setSkillTypeReturn(tempSkillTypeReturn)
        setRerenderSkill(rerenderSkill + 50)
    }

    function getSkillTypeCount(skill) {
        var skillTypeCount = 0
        for (const type of simValues.members) {
            if (type.skill_type.name === skill) {
                skillTypeCount = skillTypeCount + 1
            }
        }
        return skillTypeCount
    }

    async function startScenario() {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/start`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "template-id": state.id, "config-id": 1 }),
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })

            const scenario = await res.json()
            setCurrentSimID(scenario.data.id)
            await handleNext(scenario.data.id)
            setScenarioIsLoading(false)

            // get skilltypes
            const resSkill = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })

            var skillTypesList = []

            const resSkillReturn = await resSkill.json()

            for (const type of resSkillReturn.data) {
                skillTypesList.push(type.name)
            }

            setSkillTypes(skillTypesList)
            createSkillTypeObject(skillTypesList)
        } catch (err) {
            console.log(err)
        }
    }

    async function handleNext(simID) {
        setDataValidationStatus(false)
        var nextValues = {}
        if (returnValues === undefined) {
            nextValues = { "scenario_id": simID, "type": "START" }
        } else {
            nextValues = returnValues
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/next`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(nextValues),
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })

            const nextData = await res.json()
            console.log('NextData:', nextData)
            // set type
            setCurrentType(nextData.type)
            // set data
            if (nextData.type === 'QUESTION') {
                setSimValues(nextData.question_collection)
                setDataValidationStatus(true)
            } else if (nextData.type === 'MODEL') {
                setSimValues(nextData.models)
            } else if (nextData.type === 'SIMULATION') {
                setSimValues(nextData)
                setDataValidationStatus(true)
                let tempActions = {}

                // get all actions from next data object
                for (const action of nextData.actions) {
                    if (action.action === 'bugfix') {
                        tempActions.bugfix = false
                    } else if (action.action === 'unittest') {
                        tempActions.unittest = false
                    } else if (action.action === 'integrationtest') {
                        tempActions.integrationtest = false
                    } else if (action.action === 'meetings') {
                        tempActions.meetings = action.lower_limit
                    } else if (action.action === 'teamevent') {
                        tempActions.teamevent = false
                    } else if (action.action === 'training') {
                        tempActions.training = action.lower_limit
                    } else if (action.action === 'salary') {
                        tempActions.salary = 1
                    } else if (action.action === 'overtime') {
                        tempActions.overtime = 0
                    }
                }

                // set action values with default values
                setSimFragmentActions(tempActions)

                const tempReturnValues = {
                    scenario_id: currentSimID,
                    type: nextData.type,
                    actions: tempActions,
                    members: skillTypeReturn
                }
                setReturnValues(tempReturnValues)

                // quick and dirty solution for rerendering, please don't judge
                resetSkillTypeObject()
                setRerender(rerender + 20)
                setRerenderSkill(rerenderSkill + 50)
            } else if (nextData.type === 'EVENT') {
                setDataValidationStatus(true)
                setSimValues(nextData)
            } else if (nextData.type === 'RESULT') {
                setDataValidationStatus(true)
                setSimValues(nextData)
            }

            // set overall scenario values
            setScenarioValues(nextData)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log("TS", state)
        fetchUserScenario();
        onOpen();
    }, [onOpen]);

    useEffect(() => {
        console.log('currentSimID', currentSimID)
    }, [currentSimID]);

    return (
        <>
            <Modal isOpen={isOpen} closeOnOverlayClick={false} isCentered size="3xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Story</ModalHeader>
                    <ModalBody>
                        <MarkdownDisplay markdownText={state.story} />
                    </ModalBody>

                    <ModalFooter gap={5}>
                        <Button colorScheme="blue" variant="ghost" as={Link} to="/scenarios">
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={() => { onClose(); startScenario() }}>
                            Start Simulation
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <Flex px={10} pt={2} flexDir="column" flexGrow={0}>
                <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} to={scenarioPath()}>Scenarios</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=''>{state.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex flexDir="column" flexGrow={1}>
                    <Heading p='5'>Active Scenario: {state.name}</Heading>

                    <Container maxW='container.2xl' h='full'>
                        <Flex h='full'>
                            <Box w='60%'>
                                {scenarioIsLoading ? <Skeleton height='80vh' />: <Dashboard templateScenario={state} data={simValues} />}

                            </Box>
                            <Spacer />
                            {/* right side of simulation studio */}
                            <Box
                                p='3'

                                w='38%'
                                h='full'
                                boxShadow='md'
                                rounded='md'
                                bg='white'
                                textAlign='center'
                            >
                                <p>
                                    {/* change heading depending on dataset */}
                                    <b>
                                        {
                                            currentType === 'QUESTION' ? 'Questions' :
                                                currentType === 'SIMULATION' ? 'Actions' :
                                                    currentType === 'MODEL' ? 'Model Selection' :
                                                        currentType === 'EVENT' ? 'Event' : ''
                                        }
                                    </b>
                                </p>
                                <Grid
                                    gap={4}
                                    p='5'
                                    justify="flex-end"
                                >
                                    {/* Question Collection */}
                                    {currentType === 'QUESTION' ?
                                        <>
                                            <Question onSelect={(event) => handleSelection(event)}
                                                question_collection={simValues}
                                            />
                                        </>
                                        : <></>
                                    }
                                    {/* Simulation Fragment */}
                                    {currentType === 'SIMULATION' ?
                                        <>
                                            <Grid templateColumns='repeat(2, 1fr)' gap={5}>
                                                {skillTypeReturn.map((skilltype, index) => {
                                                    return <Skilltype key={index + rerenderSkill}
                                                        onUpdateChange={(event) => { updateSkillTypeObject(event.name, event.value) }}
                                                        skillTypeName={skilltype.skill_type}
                                                        currentCount={getSkillTypeCount(skilltype.skill_type)}
                                                        countChange={skilltype.change} />
                                                })}
                                            </Grid>
                                            {simValues.actions.map((action, index) => {
                                                return <Action onSelectAction={(event) => handleSelection(event)} key={index + rerender} action={action} />
                                            })}
                                        </>
                                        : <></>
                                    }
                                    {/* Model Selection */}
                                    {currentType === 'MODEL' ?
                                        <>
                                            <ModelSelection onSelectModel={(event) => handleSelection(event)} models={simValues} />
                                        </>
                                        : <></>
                                    }
                                    {/* Event */}
                                    {currentType === 'EVENT' ?
                                        <>
                                        </>
                                        : <></>
                                    }
                                    <GridItem colSpan={1}>
                                        <Button onClick={() => { dataValidationStatus ? handleNext(currentSimID, skillTypes) : console.log('data status:', dataValidationStatus) }} colorScheme={dataValidationStatus ? 'blue' : 'gray'} size='lg'>
                                            {currentType === 'SIMULATION' ? 'Next Week' : 'Next'}
                                        </Button>
                                    </GridItem>
                                </Grid>
                            </Box>
                        </Flex >
                    </Container >

                </Flex>
            </Flex>
        </>
    )
};


export default Simulation;
