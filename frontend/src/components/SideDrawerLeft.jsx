import { 
    Box,Text, Heading,Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,useDisclosure, Button, Input,} from "@chakra-ui/react"
import React, { useState } from "react";

const SideDrawerLeft = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Motivation Overview"
        }
    )
    const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

    return (
        <>
            <Text size='lg' fontWeight='bold' mb='2' color='black'>
                <Heading size='md' fontWeight='bold'  p="5">Additional Information</Heading>
                <Text>
                It is possible to get all information about the scenario with a click on the button below. The information will open on the right.</Text>
                <Box h={3}></Box>
                <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Scenario Story</DrawerHeader>

          <DrawerBody>
          <Text size='lg' as='i' m='2' color='black'>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, 
          no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Text>
          <Box h={5}></Box>
          <Text size='lg' as='i' m='2' color='black'>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, 
          no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</Text>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
            </Text>
        </>
    )
}

export default SideDrawerLeft