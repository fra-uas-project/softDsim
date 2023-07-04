import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
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
  HStack,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Divider,
  FormHelperText,
} from "@chakra-ui/react";
import { FaAlignJustify } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/utils";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import { IoIosMenu } from "react-icons/io";
import { Link } from "react-router-dom";

const ScenarioManagement = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [selectedScenario, setSelectedScenario] = useState({});
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScoreCardModalOpen, setIsScoreCardModalOpen] = useState(false);

  const [scoreCardParams, setScoreCardParams] = useState({
    budget_p: "",
    time_p: "",
    quality_k: "",
  });

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  window.value = 10;

  const handleScoreCardParams = async (scenario) => {
    setSelectedScenario(scenario);
    await fetchScoreCard(scenario.id);
    setIsScoreCardModalOpen(true);
  };

  const fetchScoreCard = async (selectedScenarioId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/${selectedScenarioId}/score-card`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      setScoreCardParams(data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveScoreCardParams = () => {
    const requestBody = {
      template_scenario_id: selectedScenario.id,
      budget_p: scoreCardParams.budget_p,
      time_p: scoreCardParams.time_p,
      quality_k: scoreCardParams.quality_k,
    };

    fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/${selectedScenario.id}/score-card`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: `Score card has been updated`,
            status: "success",
            duration: 5000,
          });
          setIsScoreCardModalOpen(false);
        } else {
          toast({
            title: "Failed to update score card",
            status: "error",
            duration: 5000,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "An error occurred",
          status: "error",
          duration: 5000,
        });
      });
  };

  const fetchScenarios = async () => {
    setIsLoading(true);
    const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-overview?q=${searchQuery}`, {
      method: "GET",
      credentials: "include",
    });
    const scens = await res.json();
    setScenarios(scens);
    if ("error" in scens) {
      return;
    }
    setIsLoading(false);
  };

  const deleteScenario = async (scenario) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/${scenario.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      await res.json();
      await fetchScenarios();
      toast({
        title: `${scenario.name} has been deleted`,
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: `Could not delete ${scenario.name}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const openDateModal = () => {
    setIsDateModalOpen(true);
  };

  const closeDateModal = () => {
    setIsDateModalOpen(false);
  };

  const downloadScenario = async (scenario) => {
    openDateModal();
    setSelectedScenario(scenario);
  };

  const handleDownload = async () => {
    closeDateModal();
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("template_scenario_id", selectedScenario.id);

      if (startDate) {
        queryParams.append("from", startDate);
      }

      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/results?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const response = await res.json();

      if (Object.keys(response.data).length > 0) {
        const headers = Object.keys(response.data[0]).map((key) => key);
        const values = Object.values(response.data);

        const csvContent = [
          headers.join(";"),
          ...values.map((obj) => headers.map((key) => JSON.stringify(obj[key] || "")).join(";")),
        ].join("\n");

        const encodedCsvContent = encodeURIComponent(csvContent);
        const downloadLink = `data:text/csv;charset=utf-8,${encodedCsvContent}`;

        const link = document.createElement("a");
        link.href = downloadLink;
        link.download = `${selectedScenario.name.replace(/\s/g, "_")}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast({
          title: "No data available for this Scenario",
          status: "error",
          duration: 5000,
        });
      }
    } catch (e) {
    } finally {
      setStartDate("");
    }
  };

  useEffect(() => {
    console.log(window.value);
    fetchScenarios();
  }, []);

  return (
    <>
      <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
        <Flex alignItems="center">
          <Button ref={btnRef} colorScheme="blue" onClick={onOpen} mr={4}>
            <FaAlignJustify />
          </Button>
          <Heading as="h2" size="lg">
            Scenarios
          </Heading>
        </Flex>
        <Box h={5}></Box>
        <Box backgroundColor="white" borderRadius="2xl">
          <Container maxW="6xl" pt={10} minH="70vh" maxH="70vh" h="full" pb={10}>
            <HStack justifyContent="space-between" mr={3} spacing={3} alignItems="center">
              <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader fontSize="xl" py={4}>
                    Admin Panel
                  </DrawerHeader>
                  <Divider />
                  <DrawerBody>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '-2rem',
                      paddingLeft: '0.5rem',
                    }}>
                      <Link
                        to="/users"
                        style={{
                          fontSize: "1.5rem",
                          marginBottom: "1rem",
                          color: "black",
                          textDecoration: "none",
                          transition: "background-color 0.3s",
                          padding: "0.5rem",
                          width: '108%',
                        }}
                        activeStyle={{ color: "blue" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgb(51, 120, 212)";
                          e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "black";
                        }}
                      >
                        Users
                      </Link>
                      <Link
                        to="/scenariomanagement"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '1rem',
                          color: 'white',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s',
                          padding: '0.5rem',
                          width: '108%',
                          backgroundColor: 'grey',
                        }}
                        activeStyle={{ color: "blue" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgb(51, 120, 212)";
                          e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "grey";
                          e.target.style.color = "white";
                        }}
                      >
                        Scenarios
                      </Link>
                      <Link
                        to="/courses"
                        style={{
                          fontSize: "1.5rem",
                          marginBottom: "1rem",
                          color: "black",
                          textDecoration: "none",
                          transition: "background-color 0.3s",
                          padding: "0.5rem",
                          width: '108%',
                        }}
                        activeStyle={{ color: "blue" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgb(51, 120, 212)";
                          e.target.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "black";
                        }}
                      >
                        Courses
                      </Link>
                    </div>
                  </DrawerBody>
                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Flex align="left">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "200px",
                    border: "1px solid #333",
                    color: "#555",
                    paddingLeft: "0.5rem",
                  }}
                />
              </Flex>
            </HStack>
            {isLoading ? (
              <Flex w="full" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <TableContainer overflowY="auto" h="full">
                <Table variant="simple" size="lg">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">ID</Th>
                      <Th color="gray.400">Name</Th>
                      <Th color="gray.400"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scenarios
                      .filter((scenario) => scenario.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((scenario, index) => {
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
                            <Td>
                              <div style={{ padding: "0 0 0 70%" }}>
                                <Menu>
                                  <MenuButton
                                    as={Button}
                                    variant="ghost"
                                    colorScheme="black"
                                    rightIcon={<IoIosMenu style={{ fontSize: "18px" }} />}
                                  ></MenuButton>
                                  <MenuList>
                                    <MenuItem onClick={() => downloadScenario(scenario)}>Download Data</MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        onDeleteOpen();
                                        setSelectedScenario(scenario);
                                      }}
                                    >
                                      Delete
                                    </MenuItem>
                                    <MenuItem>Courses</MenuItem>
                                    <MenuItem>Remove from all Courses</MenuItem>
                                    <MenuItem onClick={() => handleScoreCardParams(scenario)}>Score card</MenuItem>
                                  </MenuList>
                                </Menu>
                              </div>
                            </Td>
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

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete scenario
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure that you want to delete {selectedScenario.name}? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteScenario(selectedScenario);
                  onDeleteClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isDateModalOpen} onClose={closeDateModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Date Range</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDownload}>
              Download
            </Button>
            <Button variant="ghost" onClick={closeDateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isScoreCardModalOpen} onClose={() => setIsScoreCardModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Score Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel style={{ marginBottom: "1px" }}>Budget</FormLabel>
              <FormHelperText style={{ marginTop: "1px" }}>
                Please enter a number between 0 and 1. ( x.xx )
              </FormHelperText>{" "}
              <Input
                type="text"
                value={scoreCardParams.budget_p}
                onChange={(e) => setScoreCardParams({ ...scoreCardParams, budget_p: e.target.value })}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const inputValue = e.target.value + String.fromCharCode(charCode);
                  const isValid =
                    /^\d*\.?\d*$/.test(inputValue) && parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 1;

                  if (!isValid) {
                    e.preventDefault();
                  }
                }}
                pattern="^(?:0(\.\d+)?|1(\.0*)?)$"
                title="Please enter a number between 0 and 1"
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ marginBottom: "1px" }}>Time</FormLabel>
              <FormHelperText style={{ marginTop: "1px" }}>
                Please enter a number between 0 and 1. ( x.xx )
              </FormHelperText>{" "}
              <Input
                type="text"
                value={scoreCardParams.time_p}
                onChange={(e) => setScoreCardParams({ ...scoreCardParams, time_p: e.target.value })}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const inputValue = e.target.value + String.fromCharCode(charCode);
                  const isValid =
                    /^\d*\.?\d*$/.test(inputValue) && parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 1;

                  if (!isValid) {
                    e.preventDefault();
                  }
                }}
                pattern="^(?:0(\.\d+)?|1(\.0*)?)$"
                title="Please enter a number between 0 and 1"
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ marginBottom: "1px" }}>Quality</FormLabel>
              <FormHelperText style={{ marginTop: "1px" }}>
                Please enter a number between 0 and 1. ( x.xx )
              </FormHelperText>{" "}
              <Input
                type="text"
                value={scoreCardParams.quality_k}
                onChange={(e) => setScoreCardParams({ ...scoreCardParams, quality_k: e.target.value })}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  const inputValue = e.target.value + String.fromCharCode(charCode);
                  const isValid =
                    /^\d*\.?\d*$/.test(inputValue) && parseFloat(inputValue) >= 0 && parseFloat(inputValue) <= 1;

                  if (!isValid) {
                    e.preventDefault();
                  }
                }}
                pattern="^(?:0(\.\d+)?|1(\.0*)?)$"
                title="Please enter a number between 0 and 1"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveScoreCardParams}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ScenarioManagement;
