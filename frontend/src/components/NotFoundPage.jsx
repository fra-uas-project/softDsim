import React from 'react';
import { Link, } from 'react-router-dom';
import {Button,Box,Flex, Stack, Heading,} from "@chakra-ui/react";
import PageNotFound from '../images/notfoundpage.png';

class NotFoundPage extends React.Component{
    render(){
        return <div>
          <Box >
                <Flex  p="10"  flexFlow="column">
                <img src={PageNotFound} />
                <p style={{textAlign:"center"}}>
            <Button colorScheme='blue'><Link to="/">Take me back</Link></Button></p>
                    
                   

                  
                </Flex>
            </Box>
          
            
            
            
            
            
          </div>;

          
    }
}
export default NotFoundPage;