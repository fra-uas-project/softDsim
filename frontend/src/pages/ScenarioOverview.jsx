import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

const ScenarioOverview = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  window.value = 10;

  const fetchCourseScenarios = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/user-courses`,
          {
            method: "GET",
            credentials: "include",
          });
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  };


const fetchScenarios = async () => {
  setIsLoading(true);

  if (currentUser?.admin || currentUser?.creator) {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/template-overview`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const fetchedScenarios = await res.json();

      setScenarios(fetchedScenarios);
      if ("error" in fetchedScenarios) {
        return;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  } else {
    try {
      const scenarios = await fetchCourseScenarios();
      const scenarioIds = scenarios.map(scenario => scenario.id);

      const fetchRequests = scenarioIds.map(scenarioId =>
        fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-overview/${scenarioId}`, {
          method: "GET",
          credentials: "include",
        })
      );

      const responses = await Promise.all(fetchRequests);
      const fetchedScenarios = await Promise.all(responses.map(response => response.json()));

      const uniqueFetchedScenarios = fetchedScenarios.reduce((accumulator, currentScenario) => {
        const isDuplicate = accumulator.some(scenario => scenario.id === currentScenario.id);
        if (!isDuplicate) {
          accumulator.push(currentScenario);
        }
        return accumulator;
      }, []);

      const updatedScenarios = scenarios.map(scenario => {
        const matchingScenario = uniqueFetchedScenarios.find(fetchedScenario => fetchedScenario.id === scenario.id);
        if (matchingScenario) {
          return { ...scenario, tries: matchingScenario.tries, max_score: matchingScenario.max_score };
        }
        return scenario;
      });

      setScenarios(updatedScenarios);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
};


  useEffect(() => {
    console.log(window.value)
    fetchScenarios();
  }, []);

  return (
    <>
      <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
        <Breadcrumb
          spacing="8px"
          separator={<HiChevronRight color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="">Scenarios</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>Scenarios</Heading>
        <Box h={5}></Box>
        <Box backgroundColor="white" borderRadius="2xl">
          <Container
            maxW="6xl"
            pt={10}
            minH="70vh"
            maxH="70vh"
            h="full"
            pb={10}
          >
            {isLoading ? (
              <Flex w="full" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <TableContainer overflowY="auto" h="full">
                <Table variant="simple" size="lg">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Scenario ID</Th>
                      <Th color="gray.400">Scenario Name</Th>
                      <Th color="gray.400">Tries</Th>
                      <Th color="gray.400">Best Score</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scenarios.map((scenario, index) => {
                      return (
                        <Tr key={index}>
                          <Td fontWeight="500">{scenario.id}</Td>
                          <Td fontWeight="500">
                            <Button
                              variant="link"
                              color="black"
                              onClick={() => {
                                navigate(`${scenario.id}`, { state: scenario });
                              }}
                            >
                              {scenario.name}
                            </Button>
                          </Td>
                          <Td fontWeight="500">{scenario.tries}</Td>
                          <Td fontWeight="500">{scenario.max_score}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Container>
        </Box>
      </Flex>
    </>
  );
};

export default ScenarioOverview;
