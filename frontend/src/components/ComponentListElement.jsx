import {Flex, Heading, HStack, Icon, Text, VStack} from "@chakra-ui/react";

const ComponentListElement = (props) => {
  return (
      <HStack backgroundColor="white" p={3} borderRadius="lg" transition="all 0.2s ease"
              _hover={{
                  background: "white",
                  color: "blue.600",
                  transform: "translateX(-8px)"
              }}
      >
          <Flex w={20} h={20} backgroundColor="gray.200" justifyContent="center" alignItems="center" borderRadius="xl">
              <Icon w={10} h={10} as={props.icon} color="gray.500" />
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