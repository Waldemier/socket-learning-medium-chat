import React from 'react';
import socket from '../socket';

function Chat({state, setMessageHandlerIntoStateReduce}) {
    const [messageValue, setMessageValue] = React.useState('');
    const {roomId, userName, users, messages} = state;
    const messageRef = React.useRef(null);

    const addMessageHandler = () => { //into client state and server data 
        socket.emit('ROOM:NEW_MESSAGE', { roomId, text: messageValue, userName }); //send into server for all users
        setMessageHandlerIntoStateReduce({ text: messageValue, userName }); //send for himself
        setMessageValue('');
    };

    React.useEffect(() => {
        messageRef.current.scrollTo(0, 99999); //scroll into the bottom if messages exit beyond
    }, [messages]);

    //styles in index.css
    return (
        <div className="chat">
        <div className="chat-users">
            Room: <b>{roomId}</b>
            <hr />
            <b>Online ({users.length}):</b>
            <ul>
                {users.map((user, index) => <li key={index}>{user}</li>)}
            </ul>
        </div>
        <div className="chat-messages">
            <div ref={messageRef} className="messages">
                {
                    messages.map((message, index) => (
                        <div key={message + index} className="message">
                            <p>{message.text}</p>
                            <div>
                                <span>{message.userName}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            <form>
                <textarea className="form-control" onChange={e => setMessageValue(e.target.value)} rows="3" value={messageValue} >
                </textarea>
                <button onClick={addMessageHandler} type="button" className="btn btn-primary">
                    Send
                </button>
            </form>
        </div>
        </div>
    );
}

export default Chat;