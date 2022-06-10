import {Box, Flex, Heading, HStack, Icon, ListItem, Text, VStack} from "@chakra-ui/react";
import {MdDragIndicator} from "react-icons/md";
import {Draggable} from "react-beautiful-dnd";

const EditorSubListComponent = (props) => {

    return (
        <Draggable key={props.id} draggableId={props.id} index={props.index}>
            {(provided) => (
                <ListItem
                    mb={3}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <HStack
                        justifyContent="space-around" onMouseDown={props.onClick}
                        elementid={props.id}
                        backgroundColor="white" p={3} borderRadius="lg"
                        boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
                    >
                        <Flex w={14} h={14} backgroundColor="gray.200" justifyContent="center" alignItems="center" borderRadius="xl">
                            <Icon w={6} h={6} as={props.question.icon} color="gray.500" />
                        </Flex>
                        <VStack w="200px"
                                alignItems="flex-start"
                                spacing={1}
                                pl={3}
                        >
                            <Heading size="sm">{props.question.text ? props.question.text : props.question.displayName}</Heading>
                            <Text fontSize="sm" fontWeight="500" color="gray.400">{props.question.title}</Text>
                        </VStack>
                        <Box {...provided.dragHandleProps}>
                            <Icon as={MdDragIndicator}
                                  fontSize={20}/>
                        </Box>
                    </HStack>
                </ListItem>
            )
            }
        </Draggable>
    )
}

export default EditorSubListComponent;