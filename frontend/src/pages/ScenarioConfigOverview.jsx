import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  VStack,
  Td,
  Spinner,
  FormHelperText,
  Button,
  Container,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Popover,
  PopoverTrigger,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react";
import { HiOutlineTrash } from "react-icons/hi";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const ScenarioConfigOverview = () => {
  const [scenarioConfigs, setScenarioConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenarioConfig, setSelectedScenarioConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [updatedScenarioConfig, setUpdatedScenarioConfig] = useState([]);

  const [isModal2Open, setIsModal2Open] = useState(false);

  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  const [scenarioConfigForm, setScenarioConfigForm] = useState({
    name: "",
    stressWeekendReduction: 0,
    stressOvertimeIncrease: 0,
    stressErrorIncrease: 0,
    doneTasksPerMeeting: 0,
    trainSkillIncreaseRate: 0,
    costMemberTeamEvent: 0,
    randomness: 0,
  });

  const cancelRef = useRef();
  const toast = useToast();

  const checkScenarioConfigNameExists = (name, id) => {
    return scenarioConfigs.some(
      (config) =>
        config.name &&
        config.name.toLowerCase() === name.toLowerCase() &&
        config.id !== id
    );
  };

  const fetchScenarioConfigs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/scenario-config`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const scenarioConfigsData = await res.json();
      setScenarioConfigs(scenarioConfigsData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const deleteScenarioConfig = async (scenarioConfig) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/scenario-config/${scenarioConfig.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      await res.json();
      await fetchScenarioConfigs();
      toast({
        title: `${scenarioConfig.name} has been deleted`,
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: `Could not delete ${scenarioConfig.name}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const getCookie = (name) => {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  };

  const handleCreateScenarioConfig = async (e) => {
  e.preventDefault();

  const {
    name,
    stressWeekendReduction,
    stressOvertimeIncrease,
    stressErrorIncrease,
    doneTasksPerMeeting,
    trainSkillIncreaseRate,
    costMemberTeamEvent,
    randomness,
  } = scenarioConfigForm;

  const newScenarioConfig = {
    name,
    stress_weekend_reduction: stressWeekendReduction,
    stress_overtime_increase: stressOvertimeIncrease,
    stress_error_increase: stressErrorIncrease,
    done_tasks_per_meeting: doneTasksPerMeeting,
    train_skill_increase_rate: trainSkillIncreaseRate,
    cost_member_team_event: costMemberTeamEvent,
    randomness,
  };

  try {
    const nameExists = checkScenarioConfigNameExists(name);

    if (nameExists) {
      toast({
        title: "Failed to create Scenario Configuration",
        description:
          "Scenario Configuration name already exists. Please provide a different name.",
        status: "warning",
        duration: 5000,
      });
      return;
    } else {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/scenario-config`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify(newScenarioConfig),
        }
      );

      if (res.ok) {
        toast({
          title: `${newScenarioConfig.name} has been created`,
          status: "success",
          duration: 5000,
        });

        setScenarioConfigForm({
          name: "",
          stressWeekendReduction: "-",
          stressOvertimeIncrease: 0,
          stressErrorIncrease: 0,
          doneTasksPerMeeting: 0,
          trainSkillIncreaseRate: 0,
          costMemberTeamEvent: 0,
          randomness: 0,
        });

        fetchScenarioConfigs();

        setIsModalOpen(false);
      } else {
        toast({
          title: "Failed to create scenario configuration",
          status: "error",
          duration: 5000,
        });
      }
    }
  } catch (error) {
    toast({
      title: "An error occurred",
      status: "error",
      duration: 5000,
    });
  }
};

  useEffect(() => {
    fetchScenarioConfigs();
  }, []);

  const handleCloseDeleteDialog = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteScenarioConfig(selectedScenarioConfig);
    setIsDeleteOpen(false);
  };

  const handleOpenModal = () => {
    setScenarioConfigForm({
      name: "",
      stressWeekendReduction: "-",
      stressOvertimeIncrease: 0,
      stressErrorIncrease: 0,
      doneTasksPerMeeting: 0,
      trainSkillIncreaseRate: 0,
      costMemberTeamEvent: 0,
      randomness: 0,
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditScenarioConfig = (scenarioConfig) => {
    setScenarioConfigForm(scenarioConfig);
    setIsModal2Open(true);
  };

  const handleUpdateScenarioConfig = async (e) => {
    e.preventDefault();

    try {
      const { id, name } = scenarioConfigForm;

      const nameExists = checkScenarioConfigNameExists(name, id);

      if (nameExists) {
        toast({
          title: `Scenario configuration with the name "${name}" already exists`,
          status: "warning",
          duration: 5000,
        });
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_DJANGO_HOST}/api/scenario-config/${id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(scenarioConfigForm),
          }
        );

        if (res.ok) {
          const updatedScenarioConfig = await res.json();

          const updatedScenarioConfigs = scenarioConfigs.map((config) =>
            config.id === updatedScenarioConfig.id
              ? updatedScenarioConfig
              : config
          );
          setScenarioConfigs(updatedScenarioConfigs);
          fetchScenarioConfigs();
          setIsModal2Open(false);
          toast({
            title: `Scenario configuration has been updated`,
            status: "success",
            duration: 5000,
          });
        } else {
          throw new Error("Failed to update scenario configuration");
        }
      }
    } catch (error) {
      toast({
        title: `Could not update ${scenarioConfigForm.name}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleInputChange = (e) => {
    setScenarioConfigForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Container maxW="container.xl">
      <Flex justifyContent="space-between" alignItems="center" mt={6} mb={4}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Scenario Configurations</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {scenarioConfigs.length === 0 && (
        <Button onClick={handleOpenModal} colorScheme="blue" >Create New</Button>
      )}
      </Flex>
      <Box p={4} bg="white" boxShadow="base" rounded="md">
        <Heading size="lg" mb={4}>
          Scenario Configuration
        </Heading>
        {isLoading ? (
          <Spinner />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Stress Weekend Reduction</Th>
                <Th>Stress Overtime Increase</Th>
                <Th>Stress Error Increase</Th>
                <Th>Done Tasks Per Meeting</Th>
                <Th>Train Skill Increase Rate</Th>
                <Th>cost Member Team Event</Th>
                <Th>randomness</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {scenarioConfigs.map((scenarioConfig) => (
                <Tr key={scenarioConfig.id}>
                  <Td>{scenarioConfig.name}</Td>
                  <Td>{scenarioConfig.stress_weekend_reduction}</Td>
                  <Td>{scenarioConfig.stress_overtime_increase}</Td>
                  <Td>{scenarioConfig.stress_error_increase}</Td>
                  <Td>{scenarioConfig.done_tasks_per_meeting}</Td>
                  <Td>{scenarioConfig.train_skill_increase_rate}</Td>
                  <Td>{scenarioConfig.cost_member_team_event}</Td>
                  <Td>{scenarioConfig.randomness}</Td>
                  <Td>
                    <Popover>
                      <PopoverTrigger>
                        <ButtonGroup>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() =>
                              handleEditScenarioConfig(scenarioConfig)
                            }
                          >
                            Edit
                          </Button>

                        </ButtonGroup>
                      </PopoverTrigger>

                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Scenario configuration Type
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete{" "}
              <b>{selectedScenarioConfig.name}</b>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Scenario Configuration</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleCreateScenarioConfig}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={scenarioConfigForm.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stress Weekend Reduction</FormLabel>
                  <Input
                    type="text"
                    name="stressWeekendReduction"
                    defaultValue={scenarioConfigForm.stressWeekendReduction}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const inputValue = e.target.value;
                      const caretPosition = e.target.selectionStart;

                      if (
                        caretPosition === 0 &&
                        e.key !== "-" &&
                        e.key !== "Backspace"
                      ) {
                        e.preventDefault();
                        return;
                      }

                      if (
                        inputValue.startsWith("-") &&
                        caretPosition === 1 &&
                        e.key === "Backspace"
                      ) {
                        e.preventDefault();
                        return;
                      }

                      const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
                      if (!isValidInput && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stress Overtime Increase</FormLabel>
                  <Input
                    type="text"
                    name="stressOvertimeIncrease"
                    value={scenarioConfigForm.stressOvertimeIncrease}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stress Error Increase</FormLabel>
                  <Input
                    type="text"
                    name="stressErrorIncrease"
                    value={scenarioConfigForm.stressErrorIncrease}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Done Tasks Per Meeting</FormLabel>
                  <Input
                    type="text"
                    name="doneTasksPerMeeting"
                    value={scenarioConfigForm.doneTasksPerMeeting}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Train Skill Increase Rate</FormLabel>
                  <Input
                    type="text"
                    name="trainSkillIncreaseRate"
                    value={scenarioConfigForm.trainSkillIncreaseRate}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Cost Member Team Event</FormLabel>
                  <Input
                    type="text"
                    name="costMemberTeamEvent"
                    value={scenarioConfigForm.costMemberTeamEvent}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Randomness</FormLabel>
                  <Select
                    name="randomness"
                    value={updatedScenarioConfig.randomness}
                    onChange={handleInputChange}
                    placeholder="Select"
                    required
                  >
                    <option value="" disabled hidden>
                      Select
                    </option>
                    <option value="full">Full</option>
                    <option value="semi">Semi</option>
                    <option value="none">None</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Create
              </Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModal2Open} onClose={closeModal2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Scenario Configuration</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdateScenarioConfig}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={scenarioConfigForm.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stress Weekend Reduction</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a negative number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="stress_weekend_reduction"
                    value={scenarioConfigForm.stress_weekend_reduction}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      const inputValue = e.target.value;
                      const caretPosition = e.target.selectionStart;

                      if (
                        caretPosition === 0 &&
                        e.key !== "-" &&
                        e.key !== "Backspace"
                      ) {
                        e.preventDefault();
                        return;
                      }

                      if (
                        inputValue.startsWith("-") &&
                        caretPosition === 1 &&
                        e.key === "Backspace"
                      ) {
                        e.preventDefault();
                        return;
                      }

                      const isValidInput = /^-?\d*\.?\d*$/.test(inputValue);
                      if (!isValidInput && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stress Overtime Increase</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="stress_overtime_increase"
                    value={scenarioConfigForm.stress_overtime_increase}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />

                </FormControl>
                <FormControl>
                  <FormLabel>Stress Error Increase</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="stress_error_increase"
                    value={scenarioConfigForm.stress_error_increase}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />

                </FormControl>
                <FormControl>
                  <FormLabel>Done Tasks Per Meeting</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="done_tasks_per_meeting"
                    value={scenarioConfigForm.done_tasks_per_meeting}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />

                </FormControl>
                <FormControl>
                  <FormLabel>Train Skill Increase Rate</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="train_skill_increase_rate"
                    value={scenarioConfigForm.train_skill_increase_rate}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />

                </FormControl>
                <FormControl>
                  <FormLabel>Cost Member Team Event</FormLabel>
                                    <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="cost_member_team_event"
                    value={scenarioConfigForm.cost_member_team_event}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                  />

                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Randomness</FormLabel>
                  <Select
                    name="randomness"
                    value={scenarioConfigForm.randomness}
                    onChange={handleInputChange}
                    placeholder="Select"
                    required
                  >
                    <option value="" disabled hidden>
                      Select
                    </option>
                    <option value="full">Full</option>
                    <option value="semi">Semi</option>
                    <option value="none">None</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Update
              </Button>
              <Button onClick={closeModal2}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ScenarioConfigOverview;