import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, Flex, Grid, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react"
import { useState } from "react"
import { HiChevronRight } from "react-icons/hi"


const AddMultipleUsers = () => {

    // prefix state
    const [prefix, setPreFix] = useState('')

    // user count state
    const [userCount, setUserCount] = useState(1)

    // button state
    const [usersGenerated, setUsersGenerated] = useState(false)

    // generated user csv
    const [userCsv, setUserCsv] = useState('')

    // save entered prefix
    function prefixInput(input) {
        setPreFix(input.target.value)
    }

    // save entered user count
    function handleCountChange(input) {
        setUserCount(input)
    }

    // create users in backend
    function createUsers() {
        console.log(prefix, userCount)
        setUserCsv('ID; Password;\n 123; Test1234;\n 123; Test1234;\n 123; Test1234;\n 123; Test1234')
        setUsersGenerated(true)
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
                                {/* prefix input */}
                                <Input type="text" placeholder="Prefix (e.g. SoSe22)" size='lg' bg='#efefef' onChange={prefixInput} />
                                {/* count input */}
                                <NumberInput min={1} defaultValue={1} size='lg' onChange={handleCountChange}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Grid>
                            {/* buttons */}
                            <Flex align="center" justify="center" my={5}>
                                {usersGenerated ?
                                    <>
                                        <a href={`data:text/csv;charset=utf-8,${userCsv}`} download="userList.csv">
                                            <Button colorScheme="blue">
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