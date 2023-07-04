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
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Input,
  Divider,
  HStack,Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
} from "@chakra-ui/react";
import { HiOutlineCheck, HiOutlineTrash, HiOutlineX } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { getCookie, role } from "../utils/utils";
import AddUser from "../components/AddUser";
import { Link } from "react-router-dom";
import {FaAlignJustify} from "react-icons/fa";


const UserOverview = () => {
  const { isOpen: isRoleOpen, onOpen: onRoleOpen, onClose: onRoleClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();

  window.value = 10;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [roleToChange, setRoleToChange] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/user?q=${searchQuery}`, {
      method: "GET",
      credentials: "include",
    });
    const fetchedUsers = await res.json();
    setUsers(fetchedUsers);
  };

  const navigateToUser = () => {};

  const deleteUser = async (username) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/user/${username}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      await res.json();
      fetchUsers();
      toast({
        title: `${username} has been deleted`,
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: `Could not delete ${username}`,
        status: "error",
        duration: 5000,
      });
      console.log(e);
    }
  };

  const toggleRole = async (username) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/user/${username}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [roleToChange.role]: !roleToChange.value,
          [role.CREATOR]: !roleToChange.value, // Update CREATOR role along with STAFF
        }),
      });
      await res.json();
      fetchUsers();
    } catch (e) {
      toast({
        title: `Could not change role ${roleToChange.role}`,
        status: "error",
        duration: 5000,
      });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  useEffect(() => {
    console.log(roleToChange);
  }, [roleToChange]);

  return (
    <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
      <Flex alignItems="center">
        <Button ref={btnRef} colorScheme="blue" onClick={onOpen} mr={4}>
          <FaAlignJustify/>
        </Button>
        <Heading as="h2" size="lg">
          Users
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
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '-2rem',
                        paddingLeft: '0.5rem',
                    }}>
                        <Link
                            to="/users"
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
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgb(51, 120, 212)';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'grey';
                                e.target.style.color = 'white';
                            }}
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
                            width: '108%',
                        }}
                        activeStyle={{ color: 'blue' }}
                            onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgb(51, 120, 212)';
                            e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                            }}
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
                            width: '108%',
                        }}
                        activeStyle={{ color: 'blue' }}
                            onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgb(51, 120, 212)';
                            e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'black';
                            }}
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
            <Flex align="center">
              <Link to={{ pathname: "/addusers" }}>
                <Button colorScheme="blue">Add multiple Users</Button>
              </Link>
              <AddUser />
            </Flex>
          </HStack>
              <TableContainer overflowY="auto" h="400px">
            <Table variant="simple" size="lg">
              <Thead>
                <Tr>
                  <Th color="gray.400">User Name</Th>
                  <Th color="gray.400">Admin</Th>
                  <Th color="gray.400">Staff</Th>
                  <Th color="gray.400">Creator</Th>
                  <Th color="gray.400">Student</Th>
                  <Th color="gray.400">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users
                  .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((user, index) => {
                    return (
                      <Tr key={index}>
                        <Td fontWeight="500">
                          <Button
                            variant="link"
                            color="black"
                            onClick={() => {
                              navigateToUser(user.id);
                            }}
                          >{`${user.username[0].toUpperCase() + user.username.slice(1)}`}</Button>
                        </Td>
                        <Td fontWeight="500">
                          <IconButton
                            variant="ghost"
                            colorScheme="black"
                            aria-label="Toggle admin role"
                            fontSize="20px"
                            icon={user.admin ? <HiOutlineCheck /> : <HiOutlineX />}
                            onClick={() => {
                              setSelectedUser(user.username);
                              onRoleOpen();
                              setRoleToChange({
                                role: role.ADMIN,
                                value: user.admin,
                              });
                            }}
                          />
                        </Td>
                        <Td fontWeight="500">
                          <IconButton
                            variant="ghost"
                            colorScheme="black"
                            aria-label="Toggle admin role"
                            fontSize="20px"
                            icon={user.staff ? <HiOutlineCheck /> : <HiOutlineX />}
                            onClick={() => {
                              setSelectedUser(user.username);
                              onRoleOpen();
                              setRoleToChange({
                                role: role.STAFF,
                                value: user.staff,
                              });
                            }}
                          />
                        </Td>
                        <Td fontWeight="500">
                          <IconButton
                            variant="ghost"
                            colorScheme="black"
                            aria-label="Toggle admin role"
                            fontSize="20px"
                            icon={user.creator ? <HiOutlineCheck /> : <HiOutlineX />}
                            onClick={() => {
                              setSelectedUser(user.username);
                              onRoleOpen();
                              setRoleToChange({
                                role: role.CREATOR,
                                value: user.creator,
                              });
                            }}
                          />
                        </Td>
                        <Td fontWeight="500">
                          <IconButton
                            disabled
                            variant="ghost"
                            colorScheme="black"
                            aria-label="Toggle admin role"
                            fontSize="20px"
                            icon={user.student ? <HiOutlineCheck /> : <HiOutlineX />}
                          />
                        </Td>
                        <Td fontWeight="500">
                          <IconButton
                            variant="ghost"
                            colorScheme="black"
                            aria-label="Delete user"
                            fontSize="20px"
                            icon={<HiOutlineTrash />}
                            onClick={() => {
                              onDeleteOpen();
                              setSelectedUser(user.username);
                            }}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/*Delete user alert pop up*/}
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
              Delete user
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure that you want to delete {selectedUser}? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteUser(selectedUser);
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

      {/*Change role alert pop up*/}
      <AlertDialog
        isOpen={isRoleOpen}
        leastDestructiveRef={cancelRef}
        onClose={onRoleClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change role
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure that you want to change role {roleToChange.role} of {selectedUser}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onRoleClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  toggleRole(selectedUser);
                  onRoleClose();
                }}
                ml={3}
              >
                Change
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default UserOverview;
