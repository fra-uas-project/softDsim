import {Box, Flex, Heading, HStack, Icon, IconButton, ListItem, Text, UnorderedList, VStack} from "@chakra-ui/react";
import {MdDragIndicator} from "react-icons/md";
import {Draggable, Droppable} from "react-beautiful-dnd";
import EditorSubListComponent from "./EditorSubListComponent";
import {HiOutlineChevronDown, HiOutlineChevronLeft} from "react-icons/hi";
import {useState} from "react";
import {scrollToMarginTopValue} from "../scenarioStudioData";

const EditorListComponent = (props) => {

    const [actionListExpanded, setActionListExpanded] = useState(true);

    const toggleActionList = () => {
        setActionListExpanded(!actionListExpanded)
    }

    return (
        <Draggable key={props.id} draggableId={props.id} index={props.index}>
            {(provided) => (
                <ListItem
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <VStack>
                        <HStack
                            justifyContent="space-around" onMouseDown={props.onClick}
                            elementid={props.id}
                            backgroundColor="white" p={3}
                            boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
                            borderRadius="lg"
                            scrollMarginTop={scrollToMarginTopValue}
                        >
                            <Flex w={20} h={20} backgroundColor="gray.200" justifyContent="center" alignItems="center"
                                  borderRadius="xl">
                                <Icon w={10} h={10} as={props.component.icon} color="gray.500"/>
                            </Flex>
                            <VStack w="200px"
                                    alignItems="flex-start"
                                    spacing={1}
                                    pl={3}
                            >
                                <Heading size="sm">{props.component.displayName}</Heading>
                                <HStack>
                                    <Text fontSize="sm" fontWeight="500" color="gray.400">{props.component.title}</Text>
                                    <IconButton aria-label="Expand and collapse actions"
                                                icon={actionListExpanded ? <HiOutlineChevronDown/> :
                                                    <HiOutlineChevronLeft/>}
                                                variant="ghost"
                                                size="xs"
                                                onClick={toggleActionList}
                                    />
                                </HStack>
                            </VStack>
                            <Box {...provided.dragHandleProps}>
                                <Icon as={MdDragIndicator}
                                      fontSize={20}/>
                            </Box>
                        </HStack>
                        <Droppable droppableId={props.id} type={props.droppableType}>
                            {(provided, snapshot) => (
                                <UnorderedList
                                    listStyleType="none"
                                    transition="all 0.2s ease"
                                    minH="1px"
                                    minW="full"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}
                                    display="flex"
                                    flexDir="column"
                                    alignItems="center"
                                    borderRadius="2xl">
                                    {
                                        (props.actions && actionListExpanded) &&
                                        props.actions.map((action, index) => {
                                            return (
                                                <EditorSubListComponent
                                                    key={action.id}
                                                    elementid={action.id}
                                                    onClick={props.onClick}
                                                    id={action.id}
                                                    question={action}
                                                    index={index}
                                                    isSelected={props.selectedItem ? props.selectedItem === action.id : false}
                                                />
                                            )
                                        })}
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
export default EditorListComponent;