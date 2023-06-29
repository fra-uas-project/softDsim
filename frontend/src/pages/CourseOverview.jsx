import React, { useEffect, useRef, useState, useContext } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  VStack,
  Container,
  Flex,
  Heading,
  Table,
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
  Menu,
  MenuButton,
  MenuList,
  HStack,
  MenuItem,
  Text,
  Input, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Divider,
} from "@chakra-ui/react";
import { IoIosMenu } from "react-icons/io";
import { getCookie } from "../utils/utils";
import { AuthContext } from "../context/AuthProvider";
import { BsPlusSquare, BsFillTrashFill } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaAlignJustify } from "react-icons/fa";


const CourseOverview = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
  });

  const cancelRef = useRef();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const { isOpen: isModalOpen, onOpen: handleOpenModal, onClose: handleCloseModal } = useDisclosure();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [modalCourseId, setModalCourseId] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddScenarioModalOpen, setIsAddScenarioModalOpen] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedScenarios, setFetchedScenarios] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChangeNameModal = (courseId, currentName) => {
    setModalCourseId(courseId);
    setCourseId(courseId); // Set the courseId in state
    setNewName(currentName); // Reset the newName field
    setIsChangeNameModalOpen(true); // Open the modal
  };

  const handleCloseChangeNameModal = () => {
    setIsChangeNameModalOpen(false);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSaveName = async (courseId) => {
    try {
      const existingCourse = courses.find((course) => course.id !== courseId && course.name === newName);
      if (existingCourse) {
        throw new Error("Course name already exists. Please choose a different name.");
      }

      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const data = await response.json();
        handleCloseChangeNameModal();
        toast({
          title: "Course name has been updated",
          status: "success",
          duration: 5000,
        });
        const updatedCourses = courses.map((course) => {
          if (course.id === courseId) {
            return { ...course, name: newName };
          }
          return course;
        });
        setCourses(updatedCourses);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update course name");
      }
    } catch (error) {
      console.error("Error updating course name:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleOpenAddUserModal = async () => {
    try {
      const data = await fetchAllUsers();
      const filteredUsers = data.filter((user) => !users.some((u) => u.username === user.username));
      setFetchedUsers(filteredUsers);
      setIsAddUserModalOpen(true);
      handleCloseUserModal();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenAddScenarioModal = async () => {
    try {
      const data = await fetchAllScenarios();
      const filteredScenarios = data.filter((scenario) => !scenarios.some((u) => u.name === scenario.name));
      setFetchedScenarios(filteredScenarios);
      setIsAddScenarioModalOpen(true);
      handleCloseScenarioModal();
    } catch (error) {
      console.error("Error fetching Scenarios:", error);
    }
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleCloseAddScenarioModal = () => {
    setIsAddScenarioModalOpen(false);
  };

  const handleAddUser = async (courseId, id, username) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          username: username,
        }),
      });

      if (response.ok) {
        await response.json();
        toast({
          title: "User has been added to the course",
          status: "success",
          duration: 5000,
        });

        const updatedUsers = fetchedUsers.filter((user) => user.id !== id);
        setFetchedUsers(updatedUsers);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to add user to the course");
      }
    } catch (error) {
      console.error("Error adding user to the course:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleAddScenario = async (courseId, id, name) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario_id: id,
          name: name,
        }),
      });

      if (response.ok) {
        await response.json();
        toast({
          title: "Scenario has been added to the course",
          status: "success",
          duration: 5000,
        });

        const updatedScenarios = fetchedScenarios.filter((scenario) => scenario.id !== id);
        setFetchedScenarios(updatedScenarios);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to add scenario to the course");
      }
    } catch (error) {
      console.error("Error adding scenario to the course:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteUser = async (courseId, username) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ username }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await response.json();
        toast({
          title: `User has been deleted`,
          status: "success",
          duration: 5000,
        });

        const updatedUsers = users.filter((user) => user.username !== username);
        setUsers(updatedUsers);
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      toast({
        title: `Could not delete User`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteScenario = async (courseId, scenarioId) => {
    try {
      if (scenarioId === null || scenarioId === undefined) {
        throw new Error("Invalid scenario ID");
      }

      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ scenario_id: scenarioId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await response.json();
        toast({
          title: `Scenario has been deleted`,
          status: "success",
          duration: 5000,
        });

        const updatedScenarios = scenarios.filter((scenario) => scenario.id !== scenarioId);
        setScenarios(updatedScenarios);
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      toast({
        title: `Could not delete Scenario: ${error.message}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/user`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchAllScenarios = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Scenarios");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Scenarios:", error);
      return [];
    }
  };

  const getUsersOfCourse = async (courseId) => {
    setModalCourseId(courseId);
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users of course");
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error("Error fetching users of course:", error);
      return [];
    }
  };

  const getScenariosOfCourse = async (courseId) => {
    setModalCourseId(courseId);
    try {
      const response = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch scenarios of course");
      }
      const scenarios = await response.json();
      return scenarios;
    } catch (error) {
      console.error("Error fetching scenarios of course:", error);
      return [];
    }
  };

  const handleOpenUserModal = async (courseId) => {
    try {
      const users = await getUsersOfCourse(courseId);
      setUsers(users);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error("Error fetching users of course:", error);
    }
  };

  const handleOpenScenarioModal = async (courseId) => {
    try {
      const scenarios = await getScenariosOfCourse(courseId);
      setScenarios(scenarios);
      setIsScenarioModalOpen(true);
    } catch (error) {
      console.error("Error fetching scenarios of course:", error);
    }
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setUsers([]);
  };

  const handleCloseScenarioModal = () => {
    setIsScenarioModalOpen(false);
    setScenarios([]);
  };

  const checkCourseNameExists = (name, id) => {
    return courses.some(
      (course) => course.name && course.name.toLowerCase() === name.toLowerCase() && course.id !== id,
    );
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const { name } = courseForm;

    const newCourse = {
      name,
    };

    try {
      const nameExists = checkCourseNameExists(name);

      if (nameExists) {
        toast({
          title: "Failed to create course",
          description: "Course name already exists. Please provide a different name.",
          status: "warning",
          duration: 5000,
        });
        return;
      } else {
        const createRes = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify(newCourse),
        });

        if (createRes.ok) {
          toast({
            title: `${newCourse.name} has been created`,
            status: "success",
            duration: 5000,
          });

          setCourseForm({
            name: "",
          });

          fetchCourses();

          handleCloseModal();
        } else {
          toast({
            title: "Failed to create course",
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

  const fetchCourses = async () => {
    setIsLoading(true);
    const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses?q=${searchQuery}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setCourses(data.data);
    if ("error" in data) {
      return;
    }
    setIsLoading(false);
  };

  const onDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const deleteCourse = async (course) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/courses/${course.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      await res.json();
      await fetchCourses();
      toast({
        title: `${course.name} has been deleted`,
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: `Could not delete ${course.name}`,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery]);

  return (
    <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
      <Flex alignItems="center">
        <Button ref={btnRef} colorScheme="teal" onClick={onOpen} mr={4}>
          <FaAlignJustify/>
        </Button>
        <Heading as="h2" size="lg">
          Courses
        </Heading>
      </Flex>
      <Box h={5}></Box>
      <Box backgroundColor="white" borderRadius="2xl">
        <Container maxW="6xl" pt={10} minH="70vh" maxH="70vh" h="full" pb={10}>
          <HStack justifyContent="space-between" mr={3} spacing={3} alignItems="center">
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader fontSize="xl" py={4}>Admin Panel</DrawerHeader>
                <Divider />
                <DrawerBody>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link
                        to="/users"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '1rem',
                          color: 'black',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s',
                          padding: '0.5rem',
                        }}
                        activeStyle={{ color: 'blue' }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'teal')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      Users
                    </Link>
                    <Link
                        to="/scenariomanagement"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '1rem',
                          color: 'black',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s',
                          padding: '0.5rem',
                        }}
                        activeStyle={{ color: 'blue' }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'teal')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      Scenarios
                    </Link>
                    <Link
                        to="/courses"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '1rem',
                          color: 'black',
                          textDecoration: 'none',
                          transition: 'background-color 0.3s',
                          padding: '0.5rem',
                        }}
                        activeStyle={{ color: 'blue' }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'teal')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      Courses
                    </Link>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                </DrawerFooter>
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
            <Flex justifyContent="flex-end">
              <Flex justifyContent="space-between" alignItems="center" mt={6} mb={4}>
                <Button colorScheme="blue" onClick={handleOpenModal}>
                  Create new
                </Button>
              </Flex>
            </Flex>
          </HStack>
          {
            <Table variant="simple" size="lg">
              <Thead>
                <Tr>
                  <Th color="gray.400">Id</Th>
                  <Th color="gray.400">Name</Th>
                  <Th color="gray.400"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {courses
                  .filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course, index) => (
                    <Tr key={index}>
                      <Td fontWeight="500">{course.id}</Td>
                      <Td fontWeight="500">
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenChangeNameModal(course.id, course.name)}
                        >
                          {course.name}
                        </span>
                      </Td>
                      <Td fontWeight="500">
                        {currentUser?.admin && (
                          <div style={{ padding: "0 0 0 70%" }}>
                            <Menu>
                              <MenuButton
                                as={Button}
                                variant="ghost"
                                colorScheme="black"
                                rightIcon={<IoIosMenu style={{ fontSize: "18px" }} />}
                              ></MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() => {
                                    setIsDeleteOpen(true);
                                    setSelectedCourse(course);
                                  }}
                                >
                                  Delete
                                </MenuItem>
                                <MenuItem onClick={() => handleOpenUserModal(course.id)}>Manage Users</MenuItem>
                                <MenuItem onClick={() => handleOpenScenarioModal(course.id)}>Manage Scenarios</MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        )}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          }
        </Container>
      </Box>
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
              Delete course
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure that you want to delete {selectedCourse.name}? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteCourse(selectedCourse);
                  onDeleteClose();
                }}
                ml={3}
              >
                <BsFillTrashFill />
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Course</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleCreateCourse}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" name="name" value={courseForm.name} maxLength={255} onChange={handleInputChange} />
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
      <Modal isOpen={isUserModalOpen} onClose={handleCloseUserModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {users.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.id}</Td>
                      <Td>{user.username}</Td>
                      <Td>
                        <BsFillTrashFill
                          onClick={() => handleDeleteUser(modalCourseId, user.username)}
                          onMouseOver={({ target }) => (target.style.opacity = 0.5)}
                          onMouseOut={({ target }) => (target.style.opacity = 1)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No users found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              ml={3}
              onClick={handleOpenAddUserModal}
              style={{ padding: "0% 11%", margin: "0 auto" }}
            >
              <BsPlusSquare />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isScenarioModalOpen} onClose={handleCloseScenarioModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scenarios</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {scenarios.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {scenarios.map((scenario, index) => (
                    <Tr key={index}>
                      <Td>{scenario.id}</Td>
                      <Td>{scenario.name}</Td>
                      <Td>
                        <BsFillTrashFill
                          onClick={() => handleDeleteScenario(modalCourseId, scenario.id)}
                          onMouseOver={({ target }) => (target.style.opacity = 0.5)}
                          onMouseOut={({ target }) => (target.style.opacity = 1)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No Scenarios found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              ml={3}
              onClick={handleOpenAddScenarioModal}
              style={{ padding: "0% 11%", margin: "0 auto" }}
            >
              <BsPlusSquare />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isAddUserModalOpen} onClose={handleCloseAddUserModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {fetchedUsers.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fetchedUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.username}</Td>
                      <Td>
                        <Button onClick={() => handleAddUser(modalCourseId, user.id, user.username)}>
                          <IoAdd />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No users found.</Text>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddScenarioModalOpen} onClose={handleCloseAddScenarioModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Scenario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {fetchedScenarios.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fetchedScenarios.map((scenario) => (
                    <Tr key={scenario.id}>
                      <Td>{scenario.id}</Td>
                      <Td>{scenario.name}</Td>
                      <Td>
                        <Button onClick={() => handleAddScenario(modalCourseId, scenario.id, scenario.name)}>
                          <IoAdd />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No Scenarios found.</Text>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isChangeNameModalOpen} onClose={handleCloseChangeNameModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={newName} onChange={handleNameChange} placeholder="Enter new name" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => handleSaveName(modalCourseId)} ml={2}>
              Save
            </Button>
            <Button colorScheme="gray" ml={3} onClick={handleCloseChangeNameModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CourseOverview;
