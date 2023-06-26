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
} from "@chakra-ui/react";
import { HiChevronRight, HiOutlineTrash, HiDownload } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/utils";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import { IoIosMenu } from "react-icons/io";

const ScenarioManagement = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [selectedScenario, setSelectedScenario] = useState({});
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();
  const navigate = useNavigate();

  window.value = 10;

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
      console.log(e);
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
      console.log(e);
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
        <Heading>Scenarios</Heading>
        <Box h={5}></Box>
        <Box backgroundColor="white" borderRadius="2xl">
          <Container maxW="6xl" pt={10} minH="70vh" maxH="70vh" h="full" pb={10}>
            <HStack justifyContent="space-between" mr={3} spacing={3} alignItems="center">
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
    </>
  );
};
export default ScenarioManagement;
