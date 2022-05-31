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
import RadioButton from "../components/RadioButton";
import ActionSlider from "../components/ActionSlider";
import ActionToggle from "../components/ActionToggle";
import ActionSwitch from "../components/ActionSwitch";

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
                    <Container maxW='container.2xl'>
                        <Flex>
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
                            <Box
                                p='3'
                                w='38%'
                                boxShadow='md'
                                rounded='md'
                                bg='gray.400'
                                textAlign='center'
                            >
                                <p>
                                    <b>Actions</b>
                                </p>
                                <Grid
                                    // templateRows='repeat(4, 1fr)'
                                    // templateColumns='repeat(3, 1fr)'
                                    gap={4}
                                    p='5'
                                    justify="flex-end"
                                >
                                    <GridItem>
                                        <RadioButton />
                                    </GridItem>
                                    <GridItem>
                                        <ActionSlider />
                                    </GridItem>
                                    <GridItem>
                                        <ActionToggle />
                                    </GridItem>
                                    <GridItem>
                                        <ActionSwitch />
                                    </GridItem>
                                    {/* <GridItem colSpan={3} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' m='2'>
                                        <Grid>
                                            <GridItem colSpan={3} rounded='md' bg='gray.100' p='2'> <b>Hier steht eine Frage</b> </GridItem>
                                            <RadioGroup defaultValue='1'>
                                                <Stack spacing={4} direction='row' p='2' justify='flex-end'>
                                                    <Radio value='1'>
                                                        Answer 1
                                                    </Radio>
                                                    <Radio value='2'>
                                                        Answer 2
                                                    </Radio>
                                                    <Radio value='3'>
                                                        Answer 3
                                                    </Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </Grid>
                                    </GridItem>
                                    <GridItem colSpan={3} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' m='2'>
                                        <Grid>
                                            <GridItem colSpan={3} rounded='md' bg='gray.100' p='2'> <b>Hier steht eine Frage</b> </GridItem>
                                            <RadioGroup defaultValue='1'>
                                                <Stack spacing={4} direction='row' p='2' justify='flex-end'>
                                                    <Radio value='1'>
                                                        Answer 1
                                                    </Radio>
                                                    <Radio value='2'>
                                                        Answer 2
                                                    </Radio>
                                                    <Radio value='3'>
                                                        Answer 3
                                                    </Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </Grid>
                                    </GridItem>
                                    <GridItem colSpan={3} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' m='2'>
                                        <Grid>
                                            <GridItem colSpan={3} rounded='md' bg='gray.100' p='2'> <b>Hier steht eine Frage</b> </GridItem>
                                            <RadioGroup defaultValue='1'>
                                                <Stack spacing={4} direction='row' p='2' justify='flex-end'>
                                                    <Radio value='1'>
                                                        Answer 1
                                                    </Radio>
                                                    <Radio value='2'>
                                                        Answer 2
                                                    </Radio>
                                                    <Radio value='3'>
                                                        Answer 3
                                                    </Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </Grid>
                                    </GridItem>
                                    <GridItem colSpan={3} _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' m='2'>
                                        <Grid>
                                            <GridItem colSpan={3} rounded='md' bg='gray.100' p='2'> <b>Hier steht eine Frage</b> </GridItem>
                                            <RadioGroup defaultValue='1'>
                                                <Stack spacing={4} direction='row' p='2' justify='flex-end'>
                                                    <Radio value='1'>
                                                        Answer 1
                                                    </Radio>
                                                    <Radio value='2'>
                                                        Answer 2
                                                    </Radio>
                                                    <Radio value='3'>
                                                        Answer 3
                                                    </Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </Grid>
                                    </GridItem>

                                    <GridItem colSpan={2} /> */}
                                    <GridItem colSpan={1}  >
                                        <Button colorScheme='blue' size='lg'>
                                            Next Week
                                        </Button> </GridItem>
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
