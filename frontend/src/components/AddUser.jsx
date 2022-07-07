import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button, useDisclosure, Box, Stack, Input, InputGroup, InputRightElement, Flex, Heading,
    Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody
} from '@chakra-ui/react';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineLogin, HiOutlineInformationCircle } from "react-icons/hi";
import React, { useState } from "react";

const AddUser = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [idInputValid, setIdInputValid] = useState(false)
    const [passwortInputValid, setPasswortInputValid] = useState(false)
    const [passwortRepeatInputValid, setPasswortRepeatInputValid] = useState(false)
    const [userID, setUserID] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [registerSuccess, setRegisterSuccess] = useState('none')

    // validate user ID input
    function useridInput(event) {
        setUserID(event.target.value)
        if (event.target.value !== '') {
            setIdInputValid(true)
        } else {
            setIdInputValid(false)
        }
    }

    // validate user password input
    function userPasswordInput(event) {
        setUserPassword(event.target.value)
        const numberRegex = new RegExp(/[0-9]/)
        if (event.target.value === '') {
            // password cannot be empty
            setPasswortInputValid(false)
        } else if (event.target.value.length <= 5) {
            // password must be at least 6 characters long
            setPasswortInputValid(false)
        } else if (event.target.value.search(numberRegex) < 0) {
            // password must contain at least one number
            setPasswortInputValid(false)
        } else {
            setPasswortInputValid(true)
        }
    }

    // validate user repeated password input
    function userRepeatPasswordInput(event) {
        if (event.target.value === userPassword) {
            setPasswortRepeatInputValid(true)
        } else {
            setPasswortRepeatInputValid(false)
        }
    }

    // Login API call
    async function register() {
        setRegisterSuccess('attempting')
        if (idInputValid && passwortInputValid && passwortRepeatInputValid) {
            try {
                const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "username": userID, "password": userPassword, "admin": false }),
                })
                const registerAttempt = await res
                if (registerAttempt.status === 201) {
                    setRegisterSuccess('none')
                    window.location.href = "/users"
                } else if (registerAttempt.status === 400) {
                    setRegisterSuccess('invalid')
                } else {
                    setRegisterSuccess('unknown')
                }
            } catch (err) {
                console.log('Error:', err)
            }
        } else {
            setRegisterSuccess('unknown')
        }
    }
    // invert show password status
    function showPasswordClicked() {
        setShowPassword(!showPassword)
    }

    // invert show password status
    function showPasswordRepeatClicked() {
        setShowRepeatPassword(!showRepeatPassword)
    }
    return (
        <>
            <Box align="center" justify="center" p='3'>
                <Button onClick={onOpen} align="center" justify="center" colorScheme='blue'>Add new User</Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Adding User</ModalHeader>
                        <Flex align="center" justify="center" p={5}>
                            <Flex w="10%"></Flex>
                            <Heading w="80%" as="h5" textAlign="center">Create New User</Heading>
                            <Popover w="10%">
                                <PopoverTrigger>
                                    <Button><HiOutlineInformationCircle /></Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader fontWeight="bold">Password Guideline</PopoverHeader>
                                    <PopoverBody>Password must be at least 6 characters strong and contain at least one number.</PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack spacing={5}>
                                <Input type="text" placeholder="User ID" size='lg' bg='#efefef' onChange={useridInput} />
                                <InputGroup>
                                    <Input type={showPassword ? "text" : "password"} placeholder="Password" size="lg"
                                        bg="#efefef" onChange={userPasswordInput} />
                                    {/* show password */}
                                    <InputRightElement h="full">
                                        <Button size='xl' onClick={showPasswordClicked}>
                                            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <InputGroup>
                                    <Input type={showRepeatPassword ? "text" : "password"} placeholder="Repeat Password" size="lg"
                                        bg="#efefef" onChange={userRepeatPasswordInput} />
                                    {/* show password */}
                                    <InputRightElement h="full">
                                        <Button size='xl' onClick={showPasswordRepeatClicked}>
                                            {showRepeatPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Stack>
                        </ModalBody>
                        <ModalFooter align="center" justifyContent="center" >
                            <Button rightIcon={<HiOutlineLogin />} isLoading={registerSuccess === 'attempting' ? true : false}
                                colorScheme={idInputValid && passwortInputValid && passwortRepeatInputValid ? 'blue' : 'blackAlpha'} size='lg'
                                onClick={register} isDisabled={!(idInputValid && passwortInputValid && passwortRepeatInputValid)}>
                                Register
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}

export default AddUser;