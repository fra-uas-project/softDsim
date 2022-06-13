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
import {HiChevronRight} from "react-icons/hi";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import Question from "../components/Question";
import Action from "../components/Action"
import ModelSelection from '../components/ModelSelection'
import {getCookie} from "../utils/utils"
import Dashboard from "../components/Simulation/Dashboard/Dashboard";
import MarkdownDisplay from "../components/MarkdownDisplay";

const Simulation = () => {
    const [userScenario, setUserScenario] = useState({});

    const location = useLocation();

    // scenario template data
    const {state} = useLocation();

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
    const [returnValues, setReturnValues] = useState()

    const [scenarioIsLoading, setScenarioIsLoading] = useState(true);

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
        }
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
            } else if (nextData.type === 'EVENT') {
                setDataValidationStatus(true)
                setSimValues(nextData)
            }
            // set taskValues
            setSimTasks(nextData.tasks)

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

    useEffect(() => {
        console.log('dataValidationStatus', dataValidationStatus)
    }, [dataValidationStatus]);

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
                                {scenarioIsLoading ? <Skeleton height='80vh' />: <Dashboard templateScenario={state} data={scenarioValues} />}

                            </Box>
                            <Spacer/>
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
                                            Object.keys(simValues)[0] === 'question_collections' ? 'Questions' :
                                                Object.keys(simValues)[0] === 'simulation_fragments' ? 'Actions' :
                                                    Object.keys(simValues)[0] === 'model_selection' ? 'Model Selection' : ''
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
                                    {Object.keys(simValues)[0] === 'simulation_fragments' ?
                                        <>
                                            {simValues.simulation_fragments.map((actions, index) => {
                                                return <Action key={index} text={actions.text} actions={actions.actions} />
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
                                    {Object.keys(simValues)[0] === 'event' ?
                                        <>
                                        </>
                                        : <></>
                                    }
                                    <GridItem colSpan={1}>
                                        <Button onClick={() => { dataValidationStatus ? handleNext(currentSimID) : console.log('data status:', dataValidationStatus) }} colorScheme={dataValidationStatus ? 'blue' : 'gray'} size='lg'>
                                            Next Week
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
