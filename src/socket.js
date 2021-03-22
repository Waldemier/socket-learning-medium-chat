import io from 'socket.io-client';
const socket = io(); //set a proxy at package.json
                    //proxy availables to fetch requests in another port (proxing 3000 on 5000)

export default socket;