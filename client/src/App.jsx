import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io('http://localhost:4000');


export default function App() {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        const newMsg = {
            body: message,
            from: "Me"
        }
        socket.emit('message', newMsg);
        setMessages([newMsg, ...messages]);
        setMessage('');
    }

    const receiveMessage = message => {
        setMessages([message, ...messages]);
    }

    useEffect(() => {
        socket.on('message', receiveMessage);
        return ()=> {
            socket.off('message', receiveMessage);
        }
    }, [messages])
    
    return (
        <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
            <form className="bg-zinc-900 p-10" onSubmit={handleSubmit}>
                <h1 className="text-2x1 font-bold my-2">Chat ReactJS SocketIO</h1>
                <ul className="h-85 overflow-y-auto">
                    {messages.map(v => (
                        <li key={v.from} className={`table p-2 my-2 text-sm rounded-md ${v.from === "Me" ? "bg-sky-700 ml-auto": "bg-black"}`}>
                            <p>{v.from}: {v.body}</p>
                        </li>
                    ))}
                </ul>
                <input 
                    type="text" value={message} 
                    onChange={({ target }) => setMessage(target.value)} 
                    className="border-2 border-zinc-500 p-2 mt-5 text-black w-full"
                />
            </form>
        </div>
    )
}