import React, { useEffect, useRef } from "react";
import { DrawerButton } from "./components/DrawerButton";
import { Video } from "./components/Video";
import { DrawerSect } from "./components/DrawerSect";
import { RadioBrowserApi } from "radio-browser-api";
import { updateCurrentRadio, updateRadios } from "./modules/DrawerReducer";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations);
  const radio = useRef();

  useEffect(() => {
    const api = new RadioBrowserApi("RainWalk");
    api
      .searchStations({
        countryCode: locations[0].countryCode,
        limit: 20,
        offset: 0,
        tagList: ["pop", "rock"],
        hideBroken: true,
        order: "random",
      })
      .then((stations) => {
        dispatch(updateRadios(stations));
        dispatch(updateCurrentRadio(0));
      });
  }, [dispatch, locations]);

  return (
    <>
      <DrawerButton />
      <DrawerSect radioRef={radio} />
      <Video />
    </>
  );
};

export default App;
