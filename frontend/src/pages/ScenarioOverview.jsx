import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/utils";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

const ScenarioOverview = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [selectedScenario, setSelectedScenario] = useState({});
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");

  const [courses, setCourses] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  window.value = 10;

  const fetchUserCourses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/user-courses`,
          {
            method: "GET",
            credentials: "include",
          });
      const data = await response.json();
      setCourses(data);
      return data;
    } catch (error) {
      return [];
    }
  };

  const fetchScenarioIds = async () => {
    try {
      const userCourses = await fetchUserCourses(); // Call fetchUserCourses first
      const courseIds = userCourses.map(course => course.id);

      const scenarioIds = [];

      for (const courseId of courseIds) {
        const scenarioResponse = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`,
            {
              method: "GET",
              credentials: "include",
            });
        if (!scenarioResponse.ok) {
          throw new Error(`Error fetching scenario IDs for course ${courseId}`);
        }

        const scenarioData = await scenarioResponse.json();
        const scenarioIdsInCourse = scenarioData.map(scenario => scenario.id);
        scenarioIds.push(...scenarioIdsInCourse);
      }

      console.log('Scenario IDs:', scenarioIds);
      return scenarioIds;
    } catch (error) {
      console.log('Error fetching scenario IDs:', error);
      return [];
    }
  };



  const fetchScenarios = async () => {
    setIsLoading(true);

    try {
      const scenarioIds = await fetchScenarioIds();

      const scenarios = [];

      for (const scenarioId of scenarioIds) {
        const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-overview/${scenarioId}`,
            {
              method: "GET",
              credentials: "include",
            });
        const scenario = await response.json();
        scenarios.push(scenario);
      }

      setScenarios(scenarios);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching scenarios:', error);
      setIsLoading(false);
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
