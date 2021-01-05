import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const url = "wss://abra-testing-node-server.herokuapp.com";
let socket = new WebSocket(url);

const current_session_id = new URLSearchParams(window.location.search).get("session_id") || undefined;

socket.og={};
socket.og_send = socket.send;
socket.send = (...a)=>{
  socket.og_send(...a);
  console.log(...a);
};

socket.onopen = function (e) {
  console.log("onopen");
};

const ping_interval = setInterval(()=>{
  socketSend(getKeepAliveAction())
},30*1000);

function socketSend(obj){
  obj.session_id = current_session_id;
  obj.time = new Date().getTime();
  obj.url = window.location.href;
  
  socket.send(JSON.stringify(obj));
}

socket.onclose = function (event) {
  if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log(`connection died at ${new Date().getTime()}`);
      alert('[close] Connection died');
  }
  clearInterval(ping_interval);
};

function App() {

  const [session_id,setVideoUrl] = useState(current_session_id);

  console.log({session_id})

  function play(){
    console.log({session_id})
    socket.send(JSON.stringify(getPlayAction(session_id)));
  }
  function pause(){
    console.log({session_id})
    socket.send(JSON.stringify(getPauseAction(session_id)));
  }

  return (
    <div className="App">
      {session_id||"session_id"}
      <input type="text" value={session_id} onChange={x=>{setVideoUrl(x.target.value)}}></input>
      <button onClick={pause}>pause</button>
      <button onClick={play}>play</button>
    </div>
  );
}

export default App;

function getPlayAction(session_id) {

  return {
      "videocontrol": true,
      "action": "play",
      session_id,
  }
}

function getPauseAction(session_id) {

  return {
      "videocontrol": true,
      "action": "pause",
      session_id,
  }
}

function getKeepAliveAction() {
  return {
      "videocontrol": false,
      "action": "keep_alive",
  }
}
