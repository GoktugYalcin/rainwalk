import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Drawer, Group, Slider} from "@mantine/core";
import { RadioBrowserApi } from 'radio-browser-api'
import {updateVolume} from "../modules/VideoReducer";
import {
    updateCurrentRadio,
    updateIsDrawerOpen,
    updateRadios,
    updateSelected
} from "../modules/DrawerReducer";

export const DrawerSect = ({radioRef}) => {
    const dispatch = useDispatch()
    const isDrawerOpen = useSelector(state => state.isDrawerOpen)
    const locations = useSelector(state => state.locations)
    const isFetching = useSelector(state => state.isFetching)
    const selectedIndex = useSelector(state => state.selectedIndex)
    const volume = useSelector(state => state.volume)
    const radioChannels = useSelector(state => state.radioChannels)
    const currentRadio = useSelector(state => state.currentRadio)

    useEffect(() => {
        if(radioRef.current) {
            radioRef.current.muted = true
            const playPromise = radioRef.current.play();
            console.log(radioRef.current.readyState)
        }
    }, [radioRef.current])

    return <Drawer
        opened={isDrawerOpen}
        transition="rotate-right"
        transitionDuration={250}
        transitionTimingFunction="ease-in-out"
        onClose={() => dispatch(updateIsDrawerOpen(false))}
        title={<b>☂ Rainwalk</b>}
        padding="xl"
        size="xl"
    >
        <Group position="left">
            <h3>Select the location</h3>
        </Group>
        <div className={isFetching ? "rainwalk__city-select-disabled" : "rainwalk__city-select"}>
            {locations.map((location, index) => {
                return <div className={
                    !isFetching && index === selectedIndex
                        ? "rainwalk__city-select_location-selected"
                        : "rainwalk__city-select_location"}
                            key={index}
                        onClick={() => {
                            dispatch(updateSelected(index))
                            dispatch(updateRadios([]))
                            const api = new RadioBrowserApi('RainWalk')
                            api.searchStations({
                                countryCode: locations[index].countryCode,
                                limit: 20,
                                offset: 0
                            }).then((stations) => {
                                dispatch(updateRadios(stations))
                                dispatch(updateCurrentRadio(stations[0]))
                            })
                        }
                    }
                >
                    {location.label}
                </div>
            })}
        </div>
        <Group position="left" style={{marginTop: '20px'}}>
            <h3>Slide the volume of walk</h3>
        </Group>
        <Slider
            color="teal"
            size="xl"
            radius="xl"
            disabled={isFetching}
            value={(volume.video * 100).toFixed(0)}
            marks={[
                { value: 20, label: '20%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },
            ]}
            onChange={(num) => dispatch(updateVolume({...volume, video: num / 100}))}
        />
        <Group position="left" style={{marginTop: '20px'}}>
            <h3>Slide the volume of walk</h3>
        </Group>
        {radioRef ? <div className="rainwalk__radio">
            <div className="rainwalk__radio-elements">

            </div>
            <div className="rainwalk__radio-volume">

            </div>
        </div> : <></>}
    </Drawer>
}