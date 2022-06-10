import { Slider, Grid, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Box } from "@chakra-ui/react"
import React, { useState } from "react";

const ActionSlider = (props) => {

    const [sliderValue, setSliderValue] = useState(0)

    return (
        <>
            <Grid>
                <Box p='3' mt='2'>
                    <Slider defaultValue='0' min={props.lower_limit} max={props.upper_limit} onChange={(val) => setSliderValue(val)}>
                        <SliderMark value={props.lower_limit}>
                            {props.lower_limit}
                        </SliderMark>
                        <SliderMark value={props.upper_limit}>
                            {props.upper_limit}
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