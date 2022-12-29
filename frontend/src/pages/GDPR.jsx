import {
    Flex,
    Heading,
    Grid,
    GridItem,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Box,
    Container
} from "@chakra-ui/react"
import React from "react";
import {HiChevronRight} from "react-icons/hi";

const GDPR = () => {

    return (
        <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
            <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href=''>Privacy Policy</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Heading>Privacy Policy</Heading>
            <Box h={5}></Box>
            <Box backgroundColor="white" borderRadius="2xl">
                <Container maxW='6xl' pt={10} h="full" pb={10} >

        {/*<Flex flexDir="column" flexGrow={1}>*/}
        {/*    <Heading pl='5'>Privacy Policy</Heading>*/}
            <Grid
                gap={5}
                color='gray.600'
                p='5'
            >
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <p >
                        Data protection is of a particularly high priority for the management of Simplify. The use of Simplify is only possible with a valid Simplify Account. In order to get an account the responsible lecturer will create one.
                        The processing of personal data, such as the e-mail address of a data subject shall always be in line with the General Data Protection Regulation (GDPR), and in accordance with the country-specific data protection regulations applicable to Simplify. By means of this data protection declaration, Simplify would like to inform the general public of the nature, scope, and purpose of the personal data we collect, use and process. Furthermore, data subjects are informed, by means of this data protection declaration, of the rights to which they are entitled.
                        As the controller, Simplify has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, Internet-based data transmissions may in principle have security gaps, so absolute protection may not be guaranteed.

                    </p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>1. Name and Address of the controller</b></h4>
                    <p>Controller for the purposes of the General Data Protection Regulation (GDPR), other data protection laws applicable in Member states of the European Union and other provisions related to data protection is:

                    </p>

                    <p>Simplify</p>
                    <p>Nibelungenplatz 1</p>
                    <p>60318 Frankfurt</p>
                    <p>Germany</p>
                    <p>Phone: +49 69 1533-2727 </p>
                    <p>Email: hefter@fb2.fra-uas.de</p>
                    <p>Website: https://www.frankfurt-university.de/</p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>2. Name and Address of the Data Protection Officer</b></h4>
                    <p>The Data Protection Officer of the controller is:</p>
                    <p>Simplify</p>
                    <p>Nibelungenplatz 1</p>
                    <p>60318 Frankfurt</p>
                    <p>Germany</p>
                    <p>Phone: +49 69 1533-2727 </p>
                    <p>Email: hefter@fb2.fra-uas.dee</p>
                    <p>Website: https://www.frankfurt-university.de/</p>
                    <p>Any data subject may, at any time, contact our Data Protection Officer directly with all questions and suggestions concerning data protection.</p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>3. Legal basis for the processing </b></h4>
                    <p>Art. 6(1) lit. a GDPR serves as the legal basis for processing operations for which we obtain consent for a specific processing purpose. Consent of the data subject is required before every login. Therefore the data subject needs to check a box in order to express the confirmation.</p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>4. Cookies</b></h4>
                    <p>
                        The Internet pages of Simplify use cookies. Cookies are text files that are stored in a computer system via an Internet browser. Our application stores session cookies for each user. These store necessary information to identify a specific session. Through the use of cookies, Simplify can provide the applications core functionalities.
                        The data subject may, at any time, prevent the setting of cookies through our website by means of a corresponding setting of the Internet browser used, and may thus permanently deny the setting of cookies. Furthermore, already set cookies may be deleted at any time via an Internet browser or other software programs. This is possible in all popular Internet browsers. If the data subject deactivates the setting of cookies in the Internet browser used, not all functions of our website may be entirely usable.
                    </p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>5. Collection of general data and information</b></h4>
                    <p>
                        The website of Simplify collects a series of general data and information when a data subject or automated system calls up the website. This general data and information are stored in the server log files. Collected may be authentication data required for login, email addresses, input data that every user makes when using the simulation
                        When using Simplify these general data and information may be used to distribute extra points during  the grading process.
                    </p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>6. Registration on our website</b></h4>
                    <p>
                        Only the admin or controller can register users on the website. This is mainly necessary to register students that want to achieve extra points during the grading process. The personal data entered by the controller is collected and stored exclusively for internal use by the controller, and for his own purposes.
                        By logging in, the user accepts the processing of their personal data such as listed under chapter 5.
                        The data controller shall, at any time, provide information upon request to each data subject as to what personal data are stored about the data subject. In addition, the data controller shall correct or erase personal data at the request or indication of the data subject, insofar as there are no statutory storage obligations. The entirety of the controller’s employees are available to the data subject in this respect as contact persons.

                    </p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>7. Routine erasure and blocking of personal data</b></h4>
                    <p>
                        The data controller shall process and store the personal data of the data subject only for the period necessary to achieve the purpose of storage, or as far as this is granted by the European legislator or other legislators in laws or regulations to which the controller is subject to.
                        If the storage purpose is not applicable, or if a storage period prescribed by the European legislator or another competent legislator expires, the personal data are routinely stored in historical databases in accordance with legal requirements.
                    </p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <h4><b>8. Rights of the data subject</b></h4>
                    <br />
                    <p>
                        According to the data subject rights of the GDPR the following actions can be carried out or referred to by the data subject.
                    </p>
                    <br />
                    <ul ml='5'>
                        <li>Transparent information, communication and modalities for the exercise of the rights of the data subject (Art. 12 GDPR)</li>
                        <li>Information to be provided where personal data are collected from the data subject (Art. 13 GDPR)</li>
                        <li>Information to be provided where personal data have not been obtained from the data subject (Art. 14 GDPR)</li>
                        <li>Right of access by the data subject (Art. 15 GDPR)</li>
                        <li>Right to rectification (Art. 16 GDPR)</li>
                        <li>Right to erasure (Art. 17 GDPR)</li>
                        <li>Right to restriction of processing (Art. 18 GDPR)</li>
                        <li>Notification obligation regarding rectification or erasure of personal data or restriction of processing (Art. 19 GDPR)</li>
                        <li>Right to data portability (Art. 20 GDPR)</li>
                        <li>Right to object (Art. 21 GDPR)</li>
                        <li>Automated individual decision-making, including profiling (Art. 22 GDPR)</li>
                        <li>Restrictions (Art. 23 GDPR)</li>
                    </ul>
                </GridItem>
            </Grid>
                </Container>
            </Box>

        </Flex >
    )
}

export default GDPR;