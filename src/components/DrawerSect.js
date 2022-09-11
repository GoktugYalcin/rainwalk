import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Drawer } from "antd";
import { updateIsDrawerOpen } from "../modules/DrawerReducer";
import LocationSelector from "./DrawerContents/LocationSelector";
import VideoVolume from "./DrawerContents/VideoVolume";
import LocationRadio from "./DrawerContents/LocationRadio";

export const DrawerSect = () => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state) => state.isDrawerOpen);

  return (
    <Drawer
      onClose={() => dispatch(updateIsDrawerOpen(false))}
      title={<b>☂ Rainwalk</b>}
      placement={"left"}
      width={500}
      open={isDrawerOpen}
    >
      <LocationSelector />
      <VideoVolume />
      <LocationRadio />
    </Drawer>
  );
};
