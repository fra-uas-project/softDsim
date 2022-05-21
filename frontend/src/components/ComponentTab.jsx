import {Text, UnorderedList, VStack} from "@chakra-ui/react";
import {Droppable} from "react-beautiful-dnd";
import ComponentTabItem from "./ComponentTabItem";

const ComponentTab = (props) => {
  return (
          <VStack alignItems="flex-start" pt={2}>
              <Text color="gray.400" fontWeight="semibold">All Components</Text>
              <Droppable droppableId="componentList" isDropDisabled={true}
                         type="component">
                  {(provided) => (
                      <UnorderedList
                          listStyleType="none"
                          ref={provided.innerRef}
                      >
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