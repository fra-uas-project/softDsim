import { Flex, Heading, Text, Grid, GridItem } from "@chakra-ui/react"
import React from "react";

const Imprint = () => {

    return (
        <Flex flexDir="column" flexGrow={1}>
            <Heading pl='5' pt='5'>Imprint</Heading>
            <Grid
                h='100%'
                gap={5}
                color='gray.600'
                p='5'
            >
                <GridItem rowSpan={2} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <Text>
                        <b>Angaben gemäß § 5 TMG</b>
                        <br />
                        <br />
                        Frankfurt University of Applied Sciences
                        <br />
                        Nibelungenplatz 1
                        <br />
                        60318 Frankfurt
                        <br />
                        <br />
                        <Text fontWeight="bold">Vertreten durch:</Text>
                        Michael Hefter
                        <br />
                        <br />
                        <Text fontWeight="bold">Kontakt:</Text>
                        Telefon: +49 69 1533-2727
                        <br />
                        <Flex flexFlow="row">
                            E-Mail: <Text color="blue" ml="1"><a href="mailto:hefter@fb2.fra-uas.de">hefter@fb2.fra-uas.de</a></Text>
                        </Flex>
                    </Text>
                </GridItem>
                <GridItem rowSpan={2} colSpan={1} p='5' boxShadow='md' rounded='md' bg='gray.200'>
                    <b>Urheberrecht</b>
                    <br />
                    <br />
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </GridItem>
            </Grid>

        </Flex>
    )
}

export default Imprint;