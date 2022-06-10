import { Flex, Heading, Box, Button, Stack } from "@chakra-ui/react"
import React from "react";
import { Link } from "react-router-dom";
import landing_bg from "../images/landing_bg.svg"

const Landing = () => {

    return (
        <Flex align="center" justify="center" flexGrow="1" backgroundImage={landing_bg} backgroundPosition="center" backgroundSize="cover" backgroundRepeat="no-repeat">
            <Box bg='white' rounded="2xl" shadow="md">
                <Flex justify="center" p="10" w="100vw" maxW="900px" flexFlow="column">
                    <Stack spacing={5}>
                        <Heading as="h3" textAlign="center">Simplify - A Project Simulation for everyone.</Heading>
                    </Stack>
                    <Flex align="center" justify="center" h="40px">
                    </Flex>
                    <Flex w="full">
                        <Flex w="50%" align="center" justify="center">
                            <Button w="60%" as={Link} to="/login" colorScheme="blue">
                                Login
                            </Button>
                        </Flex>
                        <Flex w="50%" align="center" justify="center">
                            <Button w="60%" as={Link} to="/register" colorScheme="blue">
                                Register
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Landing;