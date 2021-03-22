import React from 'react';
import axios from 'axios';
import socket from '../socket';

export default function JoinBlock({toJoin}) {

    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    const onEnter = async () => {
        setLoading(true)
        if(!roomId || !userName) {
            return alert('Invalid parameters')
        }
        await axios.post('/rooms', { roomId, userName });
        toJoin({roomId, userName});
    }

    return (
        <div className="join-block">
            <input type="text" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
            <input type="text" placeholder="Your name" value={userName} onChange={e => setUserName(e.target.value)} />
            <button disabled={isLoading} onClick={onEnter} className="btn btn-success">{ isLoading ? 'JOIN...': 'JOIN'}</button>
        </div>
    )
}
