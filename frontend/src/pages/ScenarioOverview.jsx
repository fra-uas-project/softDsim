import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink, Button,
    Container, Flex,
    Heading, Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {HiChevronRight} from "react-icons/hi";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ScenarioOverview = () => {
    const [scenarios, setScenarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchScenarios = async () => {
        setIsLoading(true)
        const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario`, {
            method: 'GET',
            credentials: 'include',
        })
        const scens = await res.json();
        setScenarios(scens)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    return (
        <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
            <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500'/>}>
                <BreadcrumbItem>
                    <BreadcrumbLink href=''>Scenarios</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Heading>Scenarios</Heading>
            <Box h={5}></Box>
            <Box backgroundColor="white" borderRadius="2xl" minH="60vh">
                <Container maxW='4xl' pt={10}>
                    {
                        isLoading ?
                            <Flex w="full" justifyContent="center" alignItems="center">
                                <Spinner size='xl'/>
                            </Flex>
                            :
                            <TableContainer>
                                <Table variant='simple' size="lg">
                                    <Thead>
                                        <Tr>
                                            <Th color="gray.400">Scenario Name</Th>
                                            <Th color="gray.400">Tries</Th>
                                            <Th color="gray.400" isNumeric>Best Score</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {scenarios.map((scenario, index) => {
                                            return <Tr key={index}>
                                                <Td fontWeight="500">
                                                    <Button variant="link" color="black" onClick={() => {
                                                        navigate(`${scenario.id}`, {state: scenario})
                                                        console.log("S", scenario)
                                                    }}
                                                    >{scenario.name}</Button>
                                                </Td>
                                                <Td fontWeight="500">NOT_IMPLEMENTED_YET</Td>
                                                <Td fontWeight="500" isNumeric>NOT_IMPLEMENTED_YET</Td>
                                            </Tr>
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                    }
                </Container>
            </Box>
        </Flex>
    )
};

export default ScenarioOverview;