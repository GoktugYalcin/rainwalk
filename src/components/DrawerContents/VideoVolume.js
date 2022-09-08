import { Group, Slider } from "@mantine/core";
import { updateVolume } from "../../modules/VideoReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VideoVolume = () => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state) => state.isFetching);
  const volume = useSelector((state) => state.volume);
  return (
    <>
      <Group position="left" style={{ marginTop: "40px" }}>
        <h3>Slide the volume of walk</h3>
      </Group>
      <Slider
        color="teal"
        size="xl"
        radius="xl"
        disabled={isFetching}
        value={(volume.video * 100).toFixed(0)}
        marks={[
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
        onChange={(num) =>
          dispatch(updateVolume({ ...volume, video: num / 100 }))
        }
      />
    </>
  );
};

export default VideoVolume;
