import React, {useEffect} from "react";
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/Navbar";
import {Flex} from "@chakra-ui/react";
import Footer from "./components/Footer";
import Routing from "./Routing";
import {AuthProvider} from "./context/AuthProvider";
import ScrollToTop from "./components/ScrollToTop";
import LogoutTimer from "./components/LogoutTimer";

function App() {

    useEffect(() => {
        document.body.style.backgroundColor = "#EDF2F7";
    }, []);

    return (
        <Flex h="full" flexDir="column">
            <BrowserRouter>
                <AuthProvider>
                    <ScrollToTop>
                        <Navbar/>
                        <Routing/>
                        <Footer/>
                        <LogoutTimer />
                    </ScrollToTop>
                </AuthProvider>
            </BrowserRouter>
        </Flex>
    );
}

export default App;
