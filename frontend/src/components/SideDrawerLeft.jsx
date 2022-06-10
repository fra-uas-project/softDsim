import {
  Box, Text, Heading, Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton, useDisclosure, Button, SkeletonCircle, SkeletonText, Divider, Flex,
} from "@chakra-ui/react"
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
      <Flex size='lg' fontWeight='bold' mb='2' color='black' align='center' flexFlow="column">
        <Heading size='md' fontWeight='bold' p="5">Additional Information<hr></hr></Heading>
        <Text>It is possible to get all information about the scenario with a click on the button below.</Text>
        <Box h={3}></Box>
        <Button ref={btnRef} colorScheme='blue' onClick={onOpen}>
          Open Information
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
            <DrawerHeader>Scenario Information</DrawerHeader>

            <DrawerBody>
              <Heading size='md' fontWeight='bold' p="2">Story<Divider /></Heading>
              <Box padding='6' boxShadow='lg' bg='white'>
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={4} spacing='4' />
              </Box>
              <Heading size='md' fontWeight='bold' p="2">Goals<Divider /></Heading>
              <Box padding='6' boxShadow='lg' bg='white'>
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={8} spacing='4' />
              </Box>
              <Heading size='md' fontWeight='bold' p="2">More...<Divider /></Heading>
              <Box padding='6' boxShadow='lg' bg='white'>
                <SkeletonCircle size='10' />
                <SkeletonText mt='4' noOfLines={20} spacing='4' />
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Close
              </Button>

            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  )
}

export default SideDrawerLeft