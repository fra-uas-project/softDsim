import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, Flex, Grid, Heading, Input, Text, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { useState } from "react"
import { HiChevronRight } from "react-icons/hi"


const AddMultipleUsers = () => {

    // prefix state
    const [prefix, setPreFix] = useState('')

    // user count state
    const [userCount, setUserCount] = useState(1)

    // password length
    const [passwordLength, setPasswordLength] = useState(5)

    // starting index
    const [startingIndex, setStartingIndex] = useState(0)

    // button state
    const [usersGenerated, setUsersGenerated] = useState(false)

    // generated user csv
    const [userCsv, setUserCsv] = useState('')

    // error state
    const [errorState, setErrorState] = useState('none')

    // save entered prefix
    function prefixInput(input) {
        setPreFix(input.target.value)
    }

    // save entered user count
    function handleCountChange(input) {
        setUserCount(parseInt(input))
    }

    // save password length
    function handlePasswordLength(input) {
        setPasswordLength(parseInt(input))
    }

    // handle starting index input
    function handleIndexInput(input) {
        setStartingIndex(parseInt(input))
    }

    // create users in backend
    async function createUsers() {
        try {
            // create users api call
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/user/create-many`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ "prefix": prefix, "count": userCount, "pw-length": passwordLength, "start-index": startingIndex }),
                headers: {
                    "Content-Type": "application/json"
                },
            })

            // get user data
            const userData = await res.json()

            if (res.status === 201) {
                // table head
                var tempUsers = 'ID; Password;\r'
                // generate userlist
                for (const user of userData.data) {
                    tempUsers = tempUsers + `${user.username};${user.password};\r`
                }
                setUserCsv(tempUsers)
                setUsersGenerated(true)
                setErrorState('success')
            } else {
                setErrorState('error')
                console.log('nope')
            }
        } catch (error) {
            console.log(error)
            setErrorState('error')
        }
    }

    return (
        <>
            <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
                <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='users'>Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='addusers'>Add Users</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Heading>Add Users</Heading>
                <Box h={5}></Box>
                <Flex align="center" justify="center" flexGrow="1" w="full">
                    <Box backgroundColor="white" borderRadius="2xl" w="full">
                        <Container maxW='6xl' pt={10} h="full" w="full" pb={10} minH="70vh" maxH="70vh" >
                            <Grid templateColumns='repeat(2, 1fr)' gap={5}>
                                <Grid>
                                    {/* prefix input */}
                                    <Text fontWeight="bold">Prefix</Text>
                                    <Input type="text" placeholder="Prefix (e.g. SoSe22)" size='lg' bg='#efefef' onChange={prefixInput} />
                                </Grid>
                                <Grid>
                                    {/* count input */}
                                    <Text fontWeight="bold">User count</Text>
                                    <NumberInput min={1} defaultValue={1} size='lg' onChange={handleCountChange}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                                <Grid>
                                    {/* password length */}
                                    <Text fontWeight="bold">Password Length</Text>
                                    <NumberInput min={5} defaultValue={5} size='lg' onChange={handlePasswordLength}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                                <Grid>
                                    {/* starting index */}
                                    <Text fontWeight="bold">Starting Index</Text>
                                    <NumberInput min={0} defaultValue={0} size='lg' onChange={handleIndexInput}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                            </Grid>
                            {/* error or success messages */}
                            <Flex align="center" justify="center" my={5}>
                                {
                                    errorState === 'success' ?
                                        <>
                                            <Text color="green" fontSize='xl' fontWeight="bold">
                                                Users created successfully
                                            </Text>
                                        </> :
                                        errorState === 'error' ?
                                            <>
                                                <Text color="red" fontSize='xl' fontWeight="bold">
                                                    Users were not created successfully
                                                </Text>
                                            </> :
                                            <></>
                                }
                                <Text></Text>
                            </Flex>
                            {/* buttons */}
                            <Flex align="center" justify="center" my={5}>
                                {usersGenerated ?
                                    <>
                                        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(userCsv)}`} download="userList.csv">
                                            <Button colorScheme="blue" size="lg">
                                                Download
                                            </Button>
                                        </a>
                                    </>
                                    :
                                    <>
                                        <Button onClick={() => { createUsers() }} colorScheme={prefix !== '' ? 'blue' : 'blackAlpha'} isDisabled={!(prefix !== '')}>
                                            Create Users
                                        </Button>
                                    </>
                                }
                            </Flex>
                        </Container>
                    </Box>
                </Flex>
            </Flex>
        </>

    )
}

export default AddMultipleUsers