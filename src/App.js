import React, {useEffect, useRef} from "react";
import {DrawerButton} from "./components/DrawerButton";
import {Video} from "./components/Video";
import {DrawerSect} from "./components/DrawerSect";
import {RadioBrowserApi} from "radio-browser-api";
import {updateCurrentRadio, updateRadios} from "./modules/DrawerReducer";
import {useDispatch, useSelector} from "react-redux";

const App = () => {
    const dispatch = useDispatch()
    const locations = useSelector(state => state.locations)
    const radioChannels = useSelector(state => state.radioChannels)
    const currentRadio = useSelector(state => state.currentRadio)
    const radio = useRef()

    useEffect(() => {
        const api = new RadioBrowserApi('RainWalk')
        api.searchStations({
            countryCode: locations[0].countryCode,
            limit: 20,
            offset: 0
        }).then((stations) => {
            dispatch(updateRadios(stations))
            dispatch(updateCurrentRadio(0))
        })
    }, []);

  return(
    <>
        <DrawerButton />
        <DrawerSect radioRef={radio} />
        <Video />
        {radioChannels.length ?
            <audio autoPlay={true} controls={false} ref={radio} muted={"muted"} playsInline={true} src={radioChannels[currentRadio] ? radioChannels[currentRadio].urlResolved : null} />
            : <></>
        }
    </>
  )
}

export default App;