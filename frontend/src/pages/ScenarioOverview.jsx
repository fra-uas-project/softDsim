import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink, Button,
    Container, Flex,
    Heading, IconButton, Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr, useDisclosure, useToast,
} from "@chakra-ui/react";
import {HiChevronRight, HiOutlineTrash} from "react-icons/hi";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getCookie} from "../utils/utils";

const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedScenario, setSelectedScenario] = useState({});

    const { isOpen: isDeleteOpen , onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef();

    const toast = useToast()
    const navigate = useNavigate();

    const fetchScenarios = async () => {
        setIsLoading(true)
        const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-overview`, {
            method: 'GET',
            credentials: 'include',
        })
        const scens = await res.json();
        setScenarios(scens)
        if ('error' in scens) {
            return
        }
        setIsLoading(false)
    };

    const deleteScenario = async (scenario) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/${scenario.id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            })
            await res.json();
            await fetchScenarios();
            toast({
                title: `${scenario.name} has been deleted`,
                status: 'success',
                duration: 5000,
            });
        } catch (e) {
            toast({
                title: `Could not delete ${scenario.name}`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    return (
        <>
            <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
                <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500'/>}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=''>Scenarios</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Heading>Scenarios</Heading>
                <Box h={5}></Box>
                <Box backgroundColor="white" borderRadius="2xl" >
                    <Container maxW='6xl' pt={10} minH="70vh" maxH="70vh" h="full" pb={10}>
                        {
                            isLoading ?
                                <Flex w="full" justifyContent="center" alignItems="center">
                                    <Spinner size='xl'/>
                                </Flex>
                                :
                                <TableContainer overflowY="auto" h="full">
                                    <Table variant='simple' size="lg">
                                        <Thead>
                                            <Tr>
                                                <Th color="gray.400">Scenario ID</Th>
                                                <Th color="gray.400">Scenario Name</Th>
                                                <Th color="gray.400">Tries</Th>
                                                <Th color="gray.400">Best Score</Th>
                                                <Th color="gray.400">Actions</Th>

                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {scenarios.map((scenario, index) => {
                                                return <Tr key={index}>
                                                    <Td fontWeight="500">{scenario.id}</Td>
                                                    <Td fontWeight="500">
                                                        <Button variant="link" color="black" onClick={() => {
                                                            navigate(`${scenario.id}`, {state: scenario})
                                                        }}
                                                        >{scenario.name}</Button>
                                                    </Td>
                                                    <Td fontWeight="500">{scenario.tries}</Td>
                                                    <Td fontWeight="500">{scenario.max_score}</Td>
                                                    <Td fontWeight="500">
                                                        <IconButton
                                                            variant='ghost'
                                                            colorScheme='black'
                                                            aria-label='Delete scenario'
                                                            fontSize='20px'
                                                            icon={<HiOutlineTrash/>}
                                                            onClick={() => {
                                                                onDeleteOpen()
                                                                setSelectedScenario(scenario)
                                                            }
                                                            }
                                                        />
                                                    </Td>
                                                </Tr>
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                        }
                    </Container>
                </Box>
            </Flex>

            {/*Delete scenario alert pop up*/}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
                motionPreset='slideInBottom'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete scenario
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure that you want to delete {selectedScenario.name}? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={() => {
                                deleteScenario(selectedScenario)
                                onDeleteClose()
                            }} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
};

export default ScenarioOverview;