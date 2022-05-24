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
    Spacer
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Question from "../components/Question";
import Action from "../components/Action"

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

    // test values for simulation
    const [testSimValues, setTestSimValues] = useState(
        {
            "simulation_fragments": [
                {
                    "index": 2,
                    "points": 300,
                    "text": "Hier steht die Story",
                    "actions": [
                        {
                            "title": "bugfix"
                        },
                        {
                            "title": "unittest"
                        },
                        {
                            "title": "integrationtest"
                        },
                        {
                            "title": "meetings",
                            "lower_limit": 0,
                            "upper_limit": 25
                        },
                        {
                            "title": "training",
                            "lower_limit": 0,
                            "upper_limit": 50
                        },
                        {
                            "title": "teamevent"
                        }
                    ]
                }
            ]
        }
    )

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
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Start
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
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
                    <Container maxW='container.2xl' h='full'>
                        <Flex h='full'>
                            <Box w='60%'>
                                <Grid
                                    h='100%'
                                    templateRows='repeat(2, 1fr)'
                                    templateColumns='repeat(5, 1fr)'
                                    gap={4}
                                    textAlign='center'
                                    fontWeight='bold'
                                    color='white'
                                >
                                    <GridItem rowSpan={2} _hover={{ boxShadow: '2xl' }} colSpan={1} boxShadow='md' rounded='md' bg='blue.300'> Tasks</GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='blue.800'>Progress Graph</GridItem>
                                    <GridItem colSpan={2} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='blue.100'>Employees</GridItem>
                                    <GridItem colSpan={4} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='blue.700'>Stress Level</GridItem>
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
                                            Object.keys(testSimValues)[0] === 'question_collections' ? 'Questions' :
                                                Object.keys(testSimValues)[0] === 'simulation_fragments' ? 'Actions' : ''
                                        }
                                    </b>
                                </p>
                                <Grid
                                    gap={4}
                                    p='5'
                                    justify="flex-end"
                                >
                                    {/* Question Collection */}
                                    {Object.keys(testSimValues)[0] === 'question_collections' ?
                                        <>
                                            {testSimValues.question_collections.map((question, index) => {
                                                return <Question key={index} text={question.text} questions={question} />
                                            })}
                                        </>
                                        : <></>
                                    }
                                    {/* Simulation Fragment */}
                                    {Object.keys(testSimValues)[0] === 'simulation_fragments' ?
                                        <>
                                            {testSimValues.simulation_fragments.map((actions, index) => {
                                                return <Action key={index} text={actions.text} actions={actions.actions} />
                                            })}
                                        </>
                                        : <></>
                                    }
                                    <GridItem colSpan={1}>
                                        <Button colorScheme='blue' size='lg'>
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
