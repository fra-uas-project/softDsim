import { Button, Checkbox, Flex, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineLogin } from "react-icons/hi";
import React, { useContext, useState } from "react";
import { getCookie } from "../utils/utils"
import { AuthContext } from "../context/AuthProvider";
import { Link } from 'react-router-dom'
import landing_bg from "../images/landing_bg.svg"

const Login = () => {
    const { setCurrentUser } = useContext(AuthContext);

    // initialize states
    const [idInputValid, setIdInputValid] = useState(false)
    const [passwortInputValid, setPasswortInputValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [logInSuccess, setLogInSuccess] = useState('none')
    const [userID, setUserID] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)

    // handle login click
    async function handleLogin() {

        if (!privacyPolicyAccepted) {
            return;
        }

        setLogInSuccess('attempting')
        const csrftoken = getCookie('csrftoken')
        if (csrftoken === undefined) {
            // get new unauthed token
            await getCRSF()
        }
        // attempt login
        let loginAttempt = await login()
        if (loginAttempt.status === 403) {
            // wrong/invalid crsf token
            await getCRSF()
            loginAttempt = await login()
        }
        if (loginAttempt.status === 400) {
            // wrong user credentials
            setLogInSuccess('wrongCredentials')
        } else if (loginAttempt.status === 200) {
            // login successful
            setLogInSuccess('success')
            const resBody = await loginAttempt.json()
            setCurrentUser(resBody.user)
        } else {
            // unknown/unhandled error
            console.log('unknown error - please try again')
            setLogInSuccess('unknown')
        }
    }

    // Login API call
    async function login() {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/login`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "username": userID, "password": userPassword }),
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })
            return await res
        } catch (err) {
            console.log('Error:', err)
        }
    }

    // get new CRSF token
    // old one gets deleted/replaced
    async function getCRSF() {
        // get new unauthed token
        try {
            await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
            })
        } catch (err) {
            console.log(err)
        }
    }

    // validate user ID input
    function useridInput(event) {
        setUserID(event.target.value)
        if (event.target.value !== "") {
            setIdInputValid(true)
        } else {
            setIdInputValid(false)
        }
    }

    // validate user password input
    function userPasswordInput(event) {
        setUserPassword(event.target.value)
        if (event.target.value !== "") {
            setPasswortInputValid(true)
        } else {
            setPasswortInputValid(false)
        }
    }

    // invert show password status
    function showPasswordClicked() {
        setShowPassword(!showPassword)
    }

    // handle event of user clicking privacy policy checkbox
    function handlePrivacyClicked(event) {
        setPrivacyPolicyAccepted(event.target.checked)
    }

    return (
        <>
            <Flex align="center" justify="center" flexGrow="1" backgroundImage={landing_bg} backgroundPosition="center" backgroundSize="cover" backgroundRepeat="no-repeat">
                <Flex justify="center" p="10" w="40vw" maxW="400px" bg='white' rounded="2xl" flexFlow="column"
                    shadow="xl">
                    {/* input fields */}
                    <Stack spacing={5}>
                        <Heading as="h3" textAlign="center">Simplify</Heading>
                        <Input type="text" placeholder="User ID" size='lg' bg='#efefef' onChange={useridInput} />
                        <InputGroup>
                            <Input type={showPassword ? "text" : "password"} placeholder="Password" size="lg" onKeyPress={e => { if (e.key === 'Enter') { handleLogin() } }}
                                bg="#efefef" onChange={userPasswordInput} />
                            {/* show password */}
                            <InputRightElement h="full">
                                <Button size='xl' onClick={showPasswordClicked}>
                                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Stack>
                    {/* Reset Link */}
                    <Flex>
                        <Text w="full" color="blue.400" cursor="pointer" fontWeight="normal" _hover={{ fontWeight: 'semibold' }} onClick={() => { }}>
                            <Link to={{ pathname: "/reset-password" }} >Forgot password?</Link>
                        </Text>
                    </Flex>
                    {/* Failed login message */}
                    <Flex align="center" justify="center" h={logInSuccess !== 'none' ? "40px" : "0px"}>
                        {logInSuccess === 'wrongCredentials' ?
                            <Text textColor="red.500">Incorrect user credentials!</Text> : <></>}
                        {logInSuccess === 'unknown' ?
                            <Text textColor="red.500">Unknown Error - Please try again!</Text> : <></>}
                    </Flex>
                    {/* Privacy Policy checkbox */}
                    <Flex align="center" justify="center" my={5}>
                        <Checkbox
  onChange={(event) => handlePrivacyClicked(event)}
  isChecked={privacyPolicyAccepted} // Add isChecked prop
>
  <Flex gap={2}>
    <Text>I accept the </Text>
    <Text color="blue">
      <Link to={{ pathname: "/gdpr" }}>Privacy Policy</Link>
    </Text>
  </Flex>
</Checkbox>
                    </Flex>
                    {/* login button */}
                    <Button rightIcon={<HiOutlineLogin />} isLoading={logInSuccess === 'attempting' ? true : false}
                        colorScheme={idInputValid && passwortInputValid && privacyPolicyAccepted ? 'blue' : 'blackAlpha'} size='lg'
                        onClick={handleLogin} isDisabled={!(idInputValid && passwortInputValid && privacyPolicyAccepted)}>
                        Login
                    </Button>
                    {/* Register Link */}
                    {/* <Flex mt={5}>
                        <Text w="full" align="center" justify="center" cursor="pointer" fontWeight="semibold" _hover={{ fontWeight: 'bold' }} onClick={() => { }}>
                            <Link to={{ pathname: "/register" }} >Not registered?</Link>
                        </Text>
                    </Flex> */}
                </Flex>
            </Flex>
        </>

    )
}

export default Login;