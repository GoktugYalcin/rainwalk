import React, {useState, useEffect} from "react";
import ReactPlayer from 'react-player/youtube'
import places from "./places";
import './styles/App.css';
import 'antd/dist/antd.css';
import { Button, Drawer, Select, Divider, Slider, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Option } = Select
var player = {}

const App = () => {

  const [video, setVideo] = useState(places[0].link);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [player, setPlayer] = useState(null)


  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };



  const getPlaceNameByLink = (link) => {
    for(var i in places){
      if(places[i].link === link){
        return places[i].place;
      }
    }
  }

  const _onReady = (event) => {
    // player.ply = event.target;

    // player.ply.playVideo()
    // player.ply.seekTo(0)
    console.log()
  }


  const handleOnChange = (value) => {
    console.log(value);
    setVideo(value);
    setVisible(false);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      rel: 0,
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      showinfo: 0,
      autohide: 1,
      loop: 1
    }
  };

  return(
    <>
      <div className="video-background">
      <div className="tooltip">
      <Button type="primary" style={{"background-color": "#C9A690", "border": "0"}} icon={<MenuOutlined />} size={'large'} onClick={showDrawer} />
      <Drawer title="☂RainWalk Menu" size={"large"} placement="right" onClose={onClose} visible={visible}>
        <Divider>Select the city</Divider>
          <Select defaultValue={getPlaceNameByLink(video)} style={{ "margin-left": "30%", "margin-bottom": "10%", width: 180 }} size={ "large" } onChange={(e) => handleOnChange(e)}>
            {places.map((value, index) => {
              return(<Option key={index} value={value.link}> {value.place} </Option>)
            })}
          </Select>
        <Divider>Change the volume</Divider>
        <Slider defaultValue={50} onChange={(value) => {setVolume(value/100)}} />
      </Drawer>
      </div>
      <ReactPlayer url={video} 
      volume={volume}
      playing={true}
      config={{
        youtube: {
          playerVars: {
            rel: 0,
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            showinfo: 0,
            autohide: 1,
            loop: 1
          }
        }
      }} 
      />
      </div>
    </>
  )
}

export default App;