import {Fragment} from "react";
import {ListItem} from "@chakra-ui/react";
import ComponentListElement from "./ComponentListElement";
import {Draggable} from "react-beautiful-dnd";
import styled from "@emotion/styled";

const Clone = styled(ListItem)`
  margin-bottom: 12px;

  + li {
    display: none !important;
    background-color: blueviolet;
  }
`;

const ComponentTabItem = (props) => {

    return (
        <Draggable
            key={props.id}
            draggableId={props.id}
            index={props.index}>
            {(provided, snapshot) => (
                <Fragment>
                    <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        mb={3}
                    >
                        <ComponentListElement title={props.title}
                                              content={props.content}
                                              icon={props.icon}/>
                    </ListItem>
                    {snapshot.isDragging &&
                        <Clone>
                            <ComponentListElement title={props.title}
                                                  content={props.content}
                                                  icon={props.icon}/>
                        </Clone>}
                </Fragment>
            )}
        </Draggable>
    )
}

export default ComponentTabItem;