import React from 'react';
import {Link,} from 'react-router-dom';
import {Button, Flex, Image,} from "@chakra-ui/react";
import PageNotFound from '../images/notfoundpage.png';

class NotFoundPage extends React.Component {
    render() {
        return (
                <Flex p="10" flexDir="column" alignItems="center" flexGrow={1}>
                    <Image src={PageNotFound} w="30%"/>
                    <Button colorScheme='blue' as={Link} to="/">Take me back</Button>
                </Flex>
        )
    }
}

export default NotFoundPage;