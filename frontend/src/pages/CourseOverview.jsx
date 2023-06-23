import React, { useEffect, useRef, useState, useContext } from "react";
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
  VStack,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Input,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { FaCog } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/utils";
import { AuthContext } from "../context/AuthProvider";
import { BsPlusSquare, BsFillTrashFill } from "react-icons/bs";

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
  const navigate = useNavigate();

  const {
    isOpen: isModalOpen,
    onOpen: handleOpenModal,
    onClose: handleCloseModal,
  } = useDisclosure();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [modalCourseId, setModalCourseId] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);

  const handleOpenAddUserModal = async () => {
    try {
      const data = await fetchAllUsers();
      setFetchedUsers(data);
      setIsAddUserModalOpen(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleAddUser = async (courseId, id, username) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: id,
            username: username,
          }),
        }
      );

      if (response.ok) {
        await response.json();
        toast({
          title: "User has been added to the course",
          status: "success",
          duration: 5000,
        });
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

  const handleDeleteUser = async (courseId, username) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ username }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ scenario_id: scenarioId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await response.json();
        toast({
          title: `Scenario has been deleted`,
          status: "success",
          duration: 5000,
        });

        const updatedScenarios = scenarios.filter(
          (scenario) => scenario.scenario_id !== scenarioId
        );
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
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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

  const getUsersOfCourse = async (courseId) => {
    setModalCourseId(courseId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/users`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${courseId}/scenarios`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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
      (course) =>
        course.name &&
        course.name.toLowerCase() === name.toLowerCase() &&
        course.id !== id
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
          description:
            "Course name already exists. Please provide a different name.",
          status: "warning",
          duration: 5000,
        });
        return;
      } else {
        const createRes = await fetch(
          `${process.env.REACT_APP_DJANGO_HOST}/api/courses`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(newCourse),
          }
        );

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
    const res = await fetch(
      `${process.env.REACT_APP_DJANGO_HOST}/api/courses`,
      {
        method: "GET",
        credentials: "include",
      }
    );
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
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/courses/${course.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
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
  }, []);

  return (
    <Container maxW="container.xl">
      <Flex justifyContent="space-between" alignItems="center" mt={6} mb={4}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Courses</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button colorScheme="blue" onClick={handleOpenModal}>
          Create new
        </Button>
      </Flex>
      <Box p={4} bg="white" boxShadow="base" rounded="md">
        <Heading size="lg" mb={4}>
          Courses
        </Heading>
        {isLoading ? (
          <Spinner />
        ) : (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th color="gray.400">Id</Th>
                <Th color="gray.400">Name</Th>
                <Th color="gray.400"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course, index) => (
                <Tr key={index}>
                  <Td fontWeight="500">{course.id}</Td>
                  <Td fontWeight="500">{course.name}</Td>
                  <Td fontWeight="500" >
                    {currentUser?.admin && (
                    <div style = {{padding: "0 0 0 70%"}}>
                    <Menu >
                        <MenuButton
                          as={Button}
                          variant="ghost"
                          colorScheme="black"
                          rightIcon={<IoIosMenu style={{ fontSize: "18px"}} />}
                        ></MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => { setIsDeleteOpen(true); setSelectedCourse(course); }}>
                          Delete
                          </MenuItem>
                          <MenuItem onClick={() => handleOpenUserModal(course.id)}>
                          Manage Users
                          </MenuItem>
                          <MenuItem onClick={() => handleOpenScenarioModal(course.id)}>
                          Manage Scenarios
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
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
              Are you sure that you want to delete {selectedCourse.name}? You
              can't undo this action afterwards.
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
                <BsFillTrashFill/>
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
                  <Input
                    type="text"
                    name="name"
                    value={courseForm.name}
                    maxLength={255}
                    onChange={handleInputChange}
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
                          <BsFillTrashFill onClick={() =>
                            handleDeleteUser(modalCourseId, user.username)
                          }
                          onMouseOver={({target})=>target.style.opacity=0.5}
                          onMouseOut={({target})=>target.style.opacity=1}/>
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
            <Button colorScheme="green" ml={3} onClick={handleOpenAddUserModal} style ={{padding: "0% 11%", margin: "0 auto"}}>
             <BsPlusSquare/>
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
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() =>
                            handleDeleteScenario(modalCourseId, scenario.id)
                          }
                        >
                          Delete
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
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseScenarioModal}>
              Close
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
                  </Tr>
                </Thead>
                <Tbody>
                  {fetchedUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.username}</Td>
                      <Td>
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleAddUser(modalCourseId, user.id, user.username)
                          }
                        >
                          Add
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
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseAddUserModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CourseOverview;
