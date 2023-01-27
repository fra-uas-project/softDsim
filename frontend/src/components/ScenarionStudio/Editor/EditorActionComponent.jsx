import {Draggable} from "react-beautiful-dnd";
import {Box, HStack, Icon, ListItem, Text} from "@chakra-ui/react";
import {MdDragIndicator} from "react-icons/md";
import {scrollToMarginTopValue} from "../scenarioStudioData";

const EditorActionComponent = (props) => {
  return (
      <Draggable key={props.id} draggableId={props.id} index={props.index}>
          {(provided) => (
              <ListItem
                  mb={3}
                  {...provided.draggableProps}
                  ref={provided.innerRef}
              >
                  <HStack w="200px" h="50px"
                          justifyContent="space-around" onMouseDown={props.onClick}
                          elementid={props.id}
                          backgroundColor={props.backgroundColor}
                          boxShadow={props.isSelected ? "0 0 0 3px rgba(66, 153, 225, 0.6)" : ""}
                          scrollMarginTop={scrollToMarginTopValue}
                  >
                      <Text>{props.id}</Text>
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
};

export default EditorActionComponent;