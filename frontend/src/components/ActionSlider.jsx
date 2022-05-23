import { Text, Slider, Grid, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Box } from "@chakra-ui/react"
import React, { useState } from "react";

const ActionSlider = () => {

    const [testValues, setTestValues] = useState(
        {
            text: "Anzahl Meetings",
            lower: 0,
            upper: 40
        }
    )

    const [sliderValue, setSliderValue] = useState(0)

    return (
        <>
            <Grid _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3'>
                <Text size='lg' fontWeight='bold' mb='2'>
                    {testValues.text}
                </Text>
                <Box p='3' mt='2'>
                    <Slider defaultValue='0' min={testValues.lower} max={testValues.upper} onChange={(val) => setSliderValue(val)}>
                        <SliderMark value={testValues.lower}>
                            {testValues.lower}
                        </SliderMark>
                        <SliderMark value={testValues.upper}>
                            {testValues.upper}
                        </SliderMark>
                        <SliderMark
                            value={sliderValue}
                            textAlign='center'
                            bg='blue.500'
                            color='white'
                            mt='-10'
                            ml='-5'
                            w='12'
                            rounded='md'

                        >
                            {sliderValue}
                        </SliderMark>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Box>
            </Grid>
        </>
    )
}

export default ActionSlider