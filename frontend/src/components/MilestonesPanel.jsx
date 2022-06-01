import { 
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,Text, Heading, } from "@chakra-ui/react"
import React, { useState } from "react";

const MilestonesPanel = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Milestones Overview"
        }
    )

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'>Milestones</Heading>
                <UnorderedList p="2">
  <ListItem>Lorem ipsum dolor sit amet</ListItem>
  <ListItem>Consectetur adipiscing elit</ListItem>
  <ListItem>Integer molestie lorem at massa</ListItem>
  <ListItem>Facilisis in pretium nisl aliquet</ListItem>
</UnorderedList>
                
            </Text>
        </>
    )
}

export default MilestonesPanel