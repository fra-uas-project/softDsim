import {Flex, Heading, HStack, Icon, Text, Tooltip} from "@chakra-ui/react";
import React from "react";

const ValidationItem = (props) => {
    return (
        <HStack w="full" justifyContent="space-between" p={2}>
            <HStack w="50%">
                {/*<Flex minW={10} minH={10} backgroundColor="gray.200" justifyContent="center" alignItems="center"*/}
                {/*      borderRadius="xl">*/}
                {/*    <Icon as={props.componentIcon} w={5} h={5} color="gray.500"/>*/}
                {/*</Flex>*/}
                <Flex pl={1} flexDir="column">
                    <Heading size="xs">{props.title}</Heading>
                    <Text fontSize="xs" fontWeight="500" color="gray.400">{props.description}</Text>
                </Flex>
            </HStack>
            <HStack w="50%" justifyContent="end">
                <Tooltip label={props.tooltip} aria-label='A tooltip' placement="top">
                <HStack pl={2}
                        cursor="pointer"
                        _hover={{backgroundColor: `${props.buttonColor}.100`}}
                        borderRadius="full"
                        data-group transition="all 0.2s ease"
                        _active={{backgroundColor: `${props.buttonColor}.200`}}
                        onClick={props.onClick}
                >
                <Text fontSize="sm" fontWeight="500" color={`${props.buttonColor}.600`}>{props.buttonText ? props.buttonText : "Take action"}</Text>
                <Flex minW={6} minH={6} backgroundColor="gray.200" justifyContent="center" alignItems="center"
                      borderRadius="xl" _groupHover={{backgroundColor: `${props.buttonColor}.500`}}>
                    <Icon as={props.buttonIcon} w={3} h={3} color={`${props.buttonColor}.600`} _groupHover={{color: `${props.buttonColor}.100`}} transition="all 0.2s ease"/>
                </Flex>
                {/*    <Tag colorScheme={props.buttonColor}>{props.buttonText}</Tag>*/}
                </HStack>
                </Tooltip>
            </HStack>
        </HStack>
    )
}

export default ValidationItem;