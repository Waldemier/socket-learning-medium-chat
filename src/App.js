import React from 'react';
import Chat from './components/Chat';
import JoinBlock from './components/joinBlock';
import reducer from './reducer'
import socket from './socket';
import axios from 'axios'

function App() {

  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  })

  const toJoin = async ({roomId, userName}) => {
    const obj = {
      roomId,
      userName,
    };
    dispatch({type: 'JOINING', payload: obj});
    socket.emit('ROOM:JOIN', obj);
    const {data} = await axios.get(`/rooms/${roomId}`);
    dispatch({type: 'SET_USERS', payload: data})
    socket.emit('ROOM:SET_USERS', { roomId, data })
  }

  const setMessageHandlerIntoStateReduce = messageData => {
    dispatch({type: 'SET_MESSAGE', payload: messageData})
  }

  React.useEffect(() => {
    socket.on('CLIENT:SET_USERS', users => {
      dispatch({type: 'SET_USERS', payload: users});
    })
    socket.on('CLIENT:SET_MESSAGE', setMessageHandlerIntoStateReduce);
  },[])

  window.socket = socket;

  return (
    <div className="wrapper">
      { !state.joined ? <JoinBlock toJoin={toJoin} /> : <Chat state={state} setMessageHandlerIntoStateReduce={setMessageHandlerIntoStateReduce} />}
    </div>
  );
}

export default App;
