import React, {useState} from "react";
import YouTube from "react-youtube";
import places from "./places";
import './styles/App.css';
import 'antd/dist/antd.css';
import { Button, Drawer, Select, Divider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Option } = Select


const App = () => {

  const [video, setVideo] = useState(places[0].link);
  const [visible, setVisible] = useState(false);
  const [player, setPlayer] = useState(null);


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


  const handleOnChange = (value) => {
    console.log(value);
    setVideo(value);
    setVisible(false);
  }
  const onReadyHandler = (event) => {
    setPlayer(event.target)
    console.log(player)
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
      <Drawer title="☂RainWalk Menu" size={'large'} placement="right" onClose={onClose} visible={visible}>
        <Divider>Select the city</Divider>
          <Select defaultValue={getPlaceNameByLink(video)} style={{ "padding-left": "10px", width: 180 }} size={ "large" } onChange={(e) => handleOnChange(e)}>
            {places.map((value, index) => {
              return(<Option key={index} value={value.link}> {value.place} </Option>)
            })}
          </Select>
        {/* <Divider orientation="right">Change the volume</Divider> */}
      </Drawer>
      </div>
        <YouTube videoId={video} opts={opts} onReady={(t) => {onReadyHandler(t)}} />
      </div>
    </>
  )
}

export default App;