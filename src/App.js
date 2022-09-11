import React, { useEffect } from "react";
import { DrawerButton } from "./components/DrawerButton";
import { Video } from "./components/Video";
import { DrawerSect } from "./components/DrawerSect";
import { updateCurrentRadio, updateRadios } from "./modules/DrawerReducer";
import { useDispatch, useSelector } from "react-redux";
import { fetchStations } from "./modules/IsFetchingReducer";

const App = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations);
  const selectedIndex = useSelector((state) => state.selectedIndex);

  useEffect(() => {
    dispatch(
      fetchStations(selectedIndex, (radios) => {
        dispatch(updateRadios(radios));
        dispatch(updateCurrentRadio(0));
      })
    );
  }, [dispatch, locations, selectedIndex]);

  return (
    <>
      <DrawerButton />
      <DrawerSect />
      <Video />
    </>
  );
};

export default App;
