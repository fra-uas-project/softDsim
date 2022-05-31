import { Flex, Heading, Box, Text, Button, Stack } from "@chakra-ui/react"
import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {

    return (
        <Flex align="center" justify="center" flexGrow="1" bgGradient={[
            'linear(to-tr, blue.300, gray.400)',
            'linear(to-t, blue.200, white.500)',
            'linear(to-b, gray.100, blue.300)',
        ]}>
            <Box >
                <Flex justify="center" p="10" w="100vw" maxW="900px" flexFlow="column">

                    <Stack spacing={5}>
                        <Heading as="h3" textAlign="center">Simplify - A Project Simulation for everyone.</Heading>

                    </Stack>

                    <Flex align="center" justify="center" h="40px">
                    </Flex>

                    <Button as={Link} to="/Login">
                        Login / Register
                    </Button>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Landing;