import {Box, Flex, Heading, HStack, Icon, ListItem, Text, VStack} from "@chakra-ui/react";
import {MdDragIndicator} from "react-icons/md";
import {Draggable} from "react-beautiful-dnd";

const EditorBaseComponent = (props) => {

    return (
        <Draggable key={props.component.id} draggableId={props.component.id} index={props.index}>
            {(provided, snapshot) => (
                <ListItem
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <VStack py={3}>
                        <HStack
                            justifyContent="space-around" onMouseDown={props.onClick}
                            elementid={props.component.id}
                            backgroundColor="white" p={3}
                            boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
                            borderRadius="lg"

                        >
                            <Flex w={20} h={20} backgroundColor="gray.200" justifyContent="center" alignItems="center" borderRadius="xl">
                                <Icon w={10} h={10} as={props.component.icon} color="gray.500" />
                            </Flex>
                            <VStack w="200px"
                                    alignItems="flex-start"
                                    spacing={1}
                                    pl={3}
                            >
                                <Heading size="sm">{props.component.displayName}</Heading>
                                <Text fontSize="sm" fontWeight="500" color="gray.400">{props.component.title}</Text>
                            </VStack>
                            {/*<HStack>*/}
                            {/*    <VStack>*/}
                            {/*        <Text fontSize="sm" fontWeight="500" color="gray.400">Budget: {props.component.budget}</Text>*/}
                            {/*        <Text fontSize="sm" fontWeight="500" color="gray.400">Duration: {props.component.budget}</Text>*/}
                            {/*        <Text fontSize="sm" fontWeight="500" color="gray.400">Easy Tasks: {props.component.budget}</Text>*/}
                            {/*    </VStack>*/}
                            {/*</HStack>*/}
                            <Box {...provided.dragHandleProps}>
                                <Icon as={MdDragIndicator}
                                      fontSize={20}/>
                            </Box>
                        </HStack>
                        {/*<Droppable droppableId={props.id} type="question">*/}
                        {/*    {(provided, snapshot) => (*/}
                        {/*        <UnorderedList*/}
                        {/*            listStyleType="none"*/}
                        {/*            m="0 !important"*/}
                        {/*            py={snapshot.isDraggingOver ? 3 : 3}*/}
                        {/*            transition="all 0.2s ease"*/}
                        {/*            minH="1px"*/}
                        {/*            minW="full"*/}
                        {/*            {...provided.droppableProps}*/}
                        {/*            ref={provided.innerRef}*/}
                        {/*            backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}*/}
                        {/*            display="flex"*/}
                        {/*            flexDir="column"*/}
                        {/*            alignItems="center"*/}
                        {/*            borderRadius="2xl">*/}
                        {/*            {*/}
                        {/*                */}
                        {/*            }*/}
                        {/*            {provided.placeholder}*/}
                        {/*        </UnorderedList>*/}
                        {/*    )}*/}
                        {/*</Droppable>*/}
                    </VStack>
                </ListItem>
            )
            }
        </Draggable>
    )
}

export default EditorBaseComponent;