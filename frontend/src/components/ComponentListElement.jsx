import {Flex, Heading, HStack, Icon, Text, VStack} from "@chakra-ui/react";

const ComponentListElement = (props) => {
    return (
        <HStack
            transition="all 0.2s ease"
            justifyContent="space-around" onMouseDown={props.onClick}
            elementid={props.id}
            backgroundColor="white" p={3} borderRadius="lg"
            boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
            _hover={{
                background: "white",
                color: "blue.600",
                transform: "translateX(-8px)"
            }}
        >
            <Flex w={14} h={14} backgroundColor="gray.200" justifyContent="center" alignItems="center"
                  borderRadius="xl">
                <Icon w={6} h={6} as={props.icon} color="gray.500"/>
            </Flex>
            <VStack w="200px"
                    alignItems="flex-start"
                    spacing={1}
                    pl={3}
            >
                <Heading size="sm">{props.title}</Heading>
                <Text fontSize="sm" fontWeight="500" color="gray.400">{props.content}</Text>
            </VStack>
        </HStack>
    )
};

export default ComponentListElement;