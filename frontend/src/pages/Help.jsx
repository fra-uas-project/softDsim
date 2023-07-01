import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink, Container,
  Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Heading,
} from "@chakra-ui/react"
import React from "react";
import {HiChevronRight} from "react-icons/hi";

const Help = () => {

window.value = 10;

    return (
        <>
            <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
            <Heading>Help and FAQ</Heading>
            <Box  h={5}></Box>
            <Box backgroundColor="white" borderRadius="2xl" minH="60vh">
            <Tabs isFitted variant="enclosed">
  <TabList>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Introduction</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Registration/Login</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Scenarios</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Scenario Studio</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Profile</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Additional</Tab>
    <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Contact</Tab>
  </TabList>
  
                <Container maxW='4xl' pt={10}>

  
  
                  
                        <Accordion defaultIndex={[1]} allowMultiple='true' allowToggle='true'>
       <TabPanels>  
           <TabPanel>            
  <AccordionItem>
  
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Wise Words
        </Box >
        <AccordionIcon />
      </AccordionButton>
    </h2>

    <AccordionPanel pb={4}>
    
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
      
    </AccordionPanel>
    
    
  </AccordionItem>
  <AccordionItem>
  
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          First Steps
        </Box >
        <AccordionIcon />
      </AccordionButton>
    </h2>

    <AccordionPanel pb={4}>
    
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
      
    </AccordionPanel>
    
    
  </AccordionItem>
  <AccordionItem>
  
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          RTFM!
        </Box >
        <AccordionIcon />
      </AccordionButton>
    </h2>

    <AccordionPanel pb={4}>
    
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
      
    </AccordionPanel>
    
    
  </AccordionItem>
  
  </TabPanel> 
 
    <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Registration/Login
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  </TabPanel>

        <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Scenarios
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Overview
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  </TabPanel>
  
        <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Scenario Studio
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          How to Use
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Nice to know
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
  </TabPanel>
  <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Profile
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem></TabPanel>
  <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Additional
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
    
  </AccordionItem></TabPanel>
  <TabPanel>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Contact
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
    
  </AccordionItem>
 
  </TabPanel>
  </TabPanels> 
</Accordion>


                </Container>
                </Tabs>
            </Box>
        </Flex>
        </>
    )
}

export default Help;
