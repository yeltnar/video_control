import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const url = "wss://Node-WSS.yeltnar.repl.co";
let socket = new WebSocket(url);

socket.og={};
socket.og_send = socket.send;
socket.send = (...a)=>{
  socket.og_send(...a);
  console.log(...a);
};

socket.onopen = function (e) {
  console.log("onopen")
};

function App() {

  const [video_url,setVideoUrl] = useState("");

  console.log({video_url})

  function play(){
    console.log({video_url})
    socket.send(JSON.stringify(getPlayAction(video_url)));
  }
  function pause(){
    console.log({video_url})
    socket.send(JSON.stringify(getPauseAction(video_url)));
  }

  return (
    <div className="App">
      {video_url||"video_url"}
      <input type="text" value={video_url} onChange={x=>{setVideoUrl(x.target.value)}}></input>
      <button onClick={pause}>pause</button>
      <button onClick={play}>play</button>
    </div>
  );
}

export default App;

function getPlayAction(url) {

  return {
      "videocontrol": true,
      "action": "play",
      url,
  }
}

function getPauseAction(url) {

  return {
      "videocontrol": true,
      "action": "pause",
      url,
  }
}