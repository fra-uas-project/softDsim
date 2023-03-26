import {Text, UnorderedList, VStack} from "@chakra-ui/react";
import {Droppable} from "react-beautiful-dnd";
import ComponentTabItem from "./ComponentTabItem";

const ComponentTab = (props) => {
  return (
          <VStack alignItems="flex-start" height="full">
              <Droppable droppableId="componentList" isDropDisabled={true}
                         type="component">
                  {(provided) => (
                      <UnorderedList
                          height="full"
                          minW="full"
                          m={0}
                          overflowY="auto"
                          listStyleType="none"
                          ref={provided.innerRef}
                      >
                          <Text color="gray.400" fontWeight="semibold" pt={2}>All Components</Text>
                          {props.finalComponentList.map(({id, title, content, icon}, index) => {
                                  return (
                                      <ComponentTabItem
                                          key={id}
                                          id={id}
                                          title={title}
                                          content={content}
                                          icon={icon}
                                          index={index}
                                      />
                                  )
                              }
                          )
                          }
                          {provided.placeholder}
                      </UnorderedList>
                  )}
              </Droppable>
          </VStack>
  )
}
export default ComponentTab;