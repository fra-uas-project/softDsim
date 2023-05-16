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
  FormHelperText,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { HiOutlineTrash } from "react-icons/hi";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const SkilltypesOverview = () => {
  const [skilltypes, setSkilltypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkilltype, setSelectedSkilltype] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isModal2Open, setIsModal2Open] = useState(false);

  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  const [skillTypeForm, setSkillTypeForm] = useState({
    name: "",
    costPerDay: 0,
    errorRate: 0,
    throughput: 0,
    managementQuality: 0,
    developmentQuality: 0,
    signingBonus: 0,
  });

  const cancelRef = useRef();
  const toast = useToast();

  const fetchSkillTypes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const skilltypesData = await res.json();
      setSkilltypes(skilltypesData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const deleteSkillType = async (skillType) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type/${skillType.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );

      if (res.ok) {
        await res.json();
        await fetchSkillTypes();
        toast({
          title: `${skillType.name} has been deleted`,
          status: "success",
          duration: 5000,
        });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (e) {
      toast({
        title: `Could not delete ${skillType.name}`,
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

  const checkSkillTypeNameExists = (name, id) => {
    return skilltypes.some(
      (skill) => skill.name && skill.name.toLowerCase() === name.toLowerCase() &&
      skill.id !== id
    );
  };

  const handleCreateSkillType = async (e) => {
    e.preventDefault();

    const {
      name,
      costPerDay,
      errorRate,
      throughput,
      managementQuality,
      developmentQuality,
      signingBonus,
    } = skillTypeForm;

    const newSkillType = {
      name,
      cost_per_day: costPerDay,
      error_rate: errorRate,
      throughput,
      management_quality: managementQuality,
      development_quality: developmentQuality,
      signing_bonus: signingBonus,
    };

    try {
      // Check if the skill type name already exists
      const nameExists = checkSkillTypeNameExists(name);

      if (nameExists) {
        toast({
          title: "Failed to create skill type",
          description:
            "Skill type name already exists. Please provide a different name.",
          status: "warning",
          duration: 5000,
        });
        return;
      } else {
        // Create the skill type if the name is unique
        const createRes = await fetch(
          `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(newSkillType),
          }
        );

        if (createRes.ok) {
          toast({
            title: `${newSkillType.name} has been created`,
            status: "success",
            duration: 5000,
          });

          // Clear the form inputs
          setSkillTypeForm({
            name: "",
            costPerDay: 0,
            errorRate: 0,
            throughput: 0,
            managementQuality: 0,
            developmentQuality: 0,
            signingBonus: 0,
          });

          // Fetch updated skill types
          fetchSkillTypes();

          // Close the modal
          setIsModalOpen(false);
        } else {
          toast({
            title: "Failed to create skill type",
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
    fetchSkillTypes();
  }, []);

  const handleOpenDeleteDialog = (skillType) => {
    setSelectedSkilltype(skillType);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteSkillType(selectedSkilltype);
    setIsDeleteOpen(false);
  };

  const handleOpenModal = () => {
    setSkillTypeForm({
      name: "",
      costPerDay: 0,
      errorRate: 0,
      throughput: 0,
      managementQuality: 0,
      developmentQuality: 0,
      signingBonus: 0,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditSkillType = (skillType) => {
    setSkillTypeForm(skillType);
    setIsModal2Open(true);
  };

  const handleUpdateSkillType = async (e) => {
    e.preventDefault();

    try {
      const { id, name } = skillTypeForm;

      // Check if the name already exists
      const nameExists = checkSkillTypeNameExists(name, id);

      if (nameExists) {
        toast({
          title: `Skill Type with the name "${name}" already exists`,
          status: "warning",
          duration: 5000,
        });
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type/${id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(skillTypeForm),
          }
        );

        if (res.ok) {
          const updatedSkillType = await res.json();

          // Update the skill type if the name doesn't exist
          const updatedSkillTypes = skilltypes.map((skill) =>
            skill.id === updatedSkillType.id ? updatedSkillType : skill
          );
          setSkilltypes(updatedSkillTypes);
          fetchSkillTypes();
          setIsModal2Open(false);
          toast({
            title: `Skill Type has been updated`,
            status: "success",
            duration: 5000,
          });
        } else {
          throw new Error("Failed to update skill type");
        }
      }
    } catch (error) {
      toast({
        title: `Could not update ${skillTypeForm.name}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleInputChange = (e) => {
    setSkillTypeForm((prevForm) => ({
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
            <BreadcrumbLink href="#">Skill Types</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button colorScheme="blue" onClick={handleOpenModal}>
          Create new
        </Button>
      </Flex>
      <Box p={4} bg="white" boxShadow="base" rounded="md">
        <Heading size="lg" mb={4}>
          Skill Types
        </Heading>
        {isLoading ? (
          <Spinner />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Cost per Day</Th>
                <Th>Error Rate</Th>
                <Th>Throughput</Th>
                <Th>Management Quality</Th>
                <Th>Development Quality</Th>
                <Th>Signing Bonus</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {skilltypes.map((skillType) => (
                <Tr key={skillType.id}>
                  <Td>{skillType.name}</Td>
                  <Td>{skillType.cost_per_day}</Td>
                  <Td>{skillType.error_rate}</Td>
                  <Td>{skillType.throughput}</Td>
                  <Td>{skillType.management_quality}</Td>
                  <Td>{skillType.development_quality}</Td>
                  <Td>{skillType.signing_bonus}</Td>
                  <Td>
                    <Popover>
                      <PopoverTrigger>
                        <ButtonGroup>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleEditSkillType(skillType)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleOpenDeleteDialog(skillType)}
                          >
                            <HiOutlineTrash />
                          </Button>
                        </ButtonGroup>
                      </PopoverTrigger>
                      {/* ... */}
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
              Delete Skill Type
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete <b>{selectedSkilltype.name}</b>?
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

      {/* Create Skill Type Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Skill Type</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleCreateSkillType}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={skillTypeForm.name}
                    maxLength={255}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Cost Per Day
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a postive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="costPerDay"
                    value={skillTypeForm.costPerDay}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Error Rate
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 1. ( x.xx )
                  </FormHelperText>
                  <Input
                    type="text"
                    name="errorRate"
                    value={skillTypeForm.errorRate}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      const inputValue =
                        e.target.value + String.fromCharCode(charCode);
                      const isValid =
                        /^\d*\.?\d*$/.test(inputValue) &&
                        parseFloat(inputValue) >= 0 &&
                        parseFloat(inputValue) <= 1;

                      if (!isValid) {
                        e.preventDefault();
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Throughput
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a positive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="throughput"
                    value={skillTypeForm.throughput}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Management Quality
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="managementQuality"
                    value={skillTypeForm.managementQuality}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (isNaN(newValue) || parseFloat(newValue) > 100) {
                        event.preventDefault();
                      }
                    }}
                    pattern="^(?:\d{1,2}(?:\.\d*)?|100(\.0*)?)$"
                    title="Please enter a number between 0 and 100"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Development Quality
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="developmentQuality"
                    value={skillTypeForm.developmentQuality}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (isNaN(newValue) || parseFloat(newValue) > 100) {
                        event.preventDefault();
                      }
                    }}
                    pattern="^(?:\d{1,2}(?:\.\d*)?|100(\.0*)?)$"
                    title="Please enter a number between 0 and 100"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Signing Bonus
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a positive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="signingBonus"
                    value={skillTypeForm.signingBonus}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
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
          <ModalHeader>Update Skill Type</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdateSkillType}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={skillTypeForm.name}
                    maxLength={255}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Cost Per Day
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a positive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="cost_per_day"
                    value={skillTypeForm.cost_per_day}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Error Rate
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 1. ( x.xx )
                  </FormHelperText>
                  <Input
                    type="text"
                    name="error_rate"
                    value={skillTypeForm.error_rate}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      const inputValue =
                        e.target.value + String.fromCharCode(charCode);
                      const isValid =
                        /^\d*\.?\d*$/.test(inputValue) &&
                        parseFloat(inputValue) >= 0 &&
                        parseFloat(inputValue) <= 1;

                      if (!isValid) {
                        e.preventDefault();
                      }
                    }}
                    pattern="^(?:0(\.\d+)?|1(\.0*)?)$"
                    title="Please enter a number between 0 and 1"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Throughput
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a positive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="throughput"
                    value={skillTypeForm.throughput}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Management Quality
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="management_quality"
                    value={skillTypeForm.management_quality}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (isNaN(newValue) || parseFloat(newValue) > 100) {
                        event.preventDefault();
                      }
                    }}
                    pattern="^(?:\d{1,2}(?:\.\d*)?|100(\.0*)?)$"
                    title="Please enter a number between 0 and 100"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Development Quality
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a number between 0 and 100.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="development_quality"
                    value={skillTypeForm.development_quality}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (isNaN(newValue) || parseFloat(newValue) > 100) {
                        event.preventDefault();
                      }
                    }}
                    pattern="^(?:\d{1,2}(?:\.\d*)?|100(\.0*)?)$"
                    title="Please enter a number between 0 and 100"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel style={{ marginBottom: "1px" }}>
                    Signing Bonus
                  </FormLabel>
                  <FormHelperText style={{ marginTop: "1px" }}>
                    Please enter a positive number.
                  </FormHelperText>
                  <Input
                    type="text"
                    name="signing_bonus"
                    value={skillTypeForm.signing_bonus}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const newValue = event.target.value + keyValue;

                      if (!/^\d*\.?\d*$/.test(newValue)) {
                        event.preventDefault();
                      }
                    }}
                    pattern="[0-9]*[.,]?[0-9]+"
                    title="Please enter a positive number."
                  />
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

export default SkilltypesOverview;