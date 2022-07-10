import {Flex, GridItem, Heading, HStack, Icon, Text, Tooltip, VStack} from "@chakra-ui/react";

const ActionElement = (props) => {

    return (
        <GridItem my={2} _hover={{boxShadow: "rgb(112 144 176 / 12%) 0px 40px 58px -20px"}} borderRadius="xl" transition="all 0.2s ease" p={3}>
            <HStack justifyContent="space-between">
                <HStack>
                    <Flex w={20} h={20} backgroundColor="gray.200" justifyContent="center"
                          alignItems="center" borderRadius="xl">
                        <Icon w={10} h={10} as={props.icon} color="gray.500"/>
                    </Flex>
                    <VStack w="200px"
                            alignItems="flex-start"
                            spacing={1}
                            pl={3}
                    >
                        <Tooltip label={props.tooltip} aria-label='A tooltip' placement="top">
                            <Heading size="sm">{props.title}</Heading>
                        </Tooltip>
                        <Text fontSize="sm" fontWeight="500" color="gray.400">{props.secondaryText}</Text>
                            Hover me
                    </VStack>
                </HStack>
                {props.children}
            </HStack>
        </GridItem>
    )
}

export default ActionElement;