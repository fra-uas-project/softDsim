import {Box, HStack, Icon, ListItem, Text, UnorderedList, VStack} from "@chakra-ui/react";
import {MdDragIndicator} from "react-icons/md";
import {Draggable, Droppable} from "react-beautiful-dnd";
import EditorActionComponent from "./EditorActionComponent";

const EditorFragmentComponent = (props) => {

    return (
        <Draggable key={props.id} draggableId={props.id} index={props.index}>
            {(provided) => (
                <ListItem
                    mb={3}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >

                    <VStack>
                    <HStack w="200px" h="50px"
                            justifyContent="space-around" onMouseDown={props.onClick}
                            elementid={props.id}
                            backgroundColor={props.backgroundColor}
                            boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
                    >
                        <Text>{props.title}</Text>
                        <Box {...provided.dragHandleProps}>
                            <Icon as={MdDragIndicator}
                                  fontSize={20}/>
                        </Box>
                    </HStack>
                        <Droppable droppableId={props.id} type="action">
                            {(provided, snapshot) => (
                                <UnorderedList
                                    listStyleType="none"
                                    m={0}
                                    p={0}
                                    transition="background-color 0.2s ease"
                                    minH="1px"
                                    minW="200px"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}
                                    display="flex"
                                    flexDir="column"
                                    alignItems="center"
                                    borderRadius="2xl">
                                >
                                    {
                                        props.actions &&
                                        props.actions.map((action, index) => {
                                            return (
                                                <EditorActionComponent
                                                    key={action.id}
                                                    backgroundColor={snapshot.isDragging ? "blue.200" : "red.200"}
                                                    elementid={action.id}
                                                    onClick={props.onClick}
                                                    id={action.id}
                                                    index={index}
                                                    isSelected={props.selectedItem === action.id}
                                                />
                                            )
                                        })}
                                    }
                                    {provided.placeholder}
                                </UnorderedList>
                            )}
                        </Droppable>

                    </VStack>
                </ListItem>
            )
            }
        </Draggable>
    )
};
export default EditorFragmentComponent;