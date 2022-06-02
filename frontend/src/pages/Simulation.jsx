import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Container, Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    Grid,
    GridItem,
    Spacer,

} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Question from "../components/Question";
import Action from "../components/Action"
import ModelSelection from '../components/ModelSelection'
import { getCookie } from "../utils/utils"
import TasksPanel from "../components/TasksPanel";
import StressPanel from "../components/StressPanel";
import EmployeesPanel from "../components/EmployeesPanel";
import ProgressPanel from "../components/ProgressPanel";
import MilestonesPanel from "../components/MilestonesPanel";
import MotivationPanel from "../components/MotivationPanel";
import FamiliarityPanel from "../components/FamiliarityPanel";
import SideDrawerLeft from "../components/SideDrawerLeft";

const Simulation = () => {
    const [userScenario, setUserScenario] = useState({});

    const location = useLocation();

    const { isOpen, onOpen, onClose } = useDisclosure();

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

    const [currentSimID, setCurrentSimID] = useState()

    const [currentType, setCurrentType] = useState()

    // test values for simulation
    const [simValues, setSimValues] = useState({})

    const [returnValues, setReturnValues] = useState()

    async function handleSelection(event) {
        if (Object.keys(simValues)[0] === 'model_selection') {
            await setReturnValues({
                simulationId: currentSimID,
                model: event
            })
        } else if (Object.keys(simValues)[0] === 'question_collections') {

        }
    }

    async function startScenario() {
        console.log('ES STARTET')
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/start`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "template-id": 1, "config-id": 1 }),
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })

            const scenario = await res.json()
            setCurrentSimID(scenario.data.id)
        } catch (err) {
            console.log(err)
        } finally {
            handleNext()
        }
    }

    async function handleNext() {
        console.log(currentSimID)
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/next`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "scenario_id": currentSimID, "type": "MODEL" }),
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })

            const nextData = await res.json()
            console.log(nextData)
            // set type
            setCurrentType(nextData.type)
            // set data
            if (nextData.type === 'QUESTION') {
                setSimValues(nextData.question_collection)
            }

            // setSimValues(scenario.data.id)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserScenario();
        onOpen();
    }, [onOpen]);


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Scenario Description Here</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => { onClose(); startScenario() }}>
                            Start
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
                        <BreadcrumbLink href=''>{userScenario.scn_name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>


                <Flex flexDir="column" flexGrow={1}>
                    <Heading p='5'>Active Scenario: {userScenario.scn_name}</Heading>
                    <Box backgroundColor="white" borderRadius="2xl"  p="2">
                    <Container maxW='container.2xl' h='full'>
                        <Flex h='full'>
                            <Box w='60%'>
                                <Box boxShadow='md' rounded='md' p='3' mb='5'><SideDrawerLeft /></Box>
                                <Grid
                                    templateRows='repeat(4, 1fr)'
                                    templateColumns='repeat(6, 1fr)'
                                    gap={5}
                                    textAlign='center'
                                    fontWeight='bold'
                                    color='white'
                                >
                                    <GridItem rowSpan={1} _hover={{ boxShadow: '2xl' }} colSpan={1} boxShadow='md' rounded='md' bg='grey.300'><TasksPanel /></GridItem>
                                    <GridItem colSpan={3} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300'><ProgressPanel /></GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300'><MilestonesPanel /></GridItem>
                                    <GridItem colSpan={6} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300'><EmployeesPanel /></GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300' p='2'><StressPanel /></GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300' p='2'><MotivationPanel /></GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='grey.300' p='2'><FamiliarityPanel /></GridItem>
                                </Grid>
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
                                            <Question onSelectModel={(event) => handleSelection(event, simValues.question_collections)}
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
                                    {Object.keys(simValues)[0] === 'model_selection' ?
                                        <>
                                            <ModelSelection onSelectModel={(event) => handleSelection(event)} />
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
                                        <Button onClick={handleNext} colorScheme='blue' size='lg'>
                                            Next Week
                                        </Button>
                                    </GridItem>
                                </Grid>
                            </Box>
                        </Flex >
                    </Container >
                    </Box>
                </Flex>
            </Flex>
        </>
    )
};


export default Simulation;
