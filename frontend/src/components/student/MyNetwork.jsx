import React, { useEffect, useState, useRef } from 'react'
import { Users, Send } from 'lucide-react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import { MESSAGE_API_END_POINT } from '@/utils/constant'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const MyNetwork = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useSelector(store => store.auth);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${MESSAGE_API_END_POINT}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMessages();
        // Polling for new messages every 3 seconds
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await axios.post(`${MESSAGE_API_END_POINT}/send`, { content: newMessage }, {
                withCredentials: true
            });
            if (res.data.success) {
                setMessages([...messages, res.data.newMessage]);
                setNewMessage("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className='flex-1 max-w-5xl w-full mx-auto my-6 px-4 md:px-0 flex flex-col'>
                <div className='bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-[80vh]'>
                    
                    {/* Header */}
                    <div className='flex items-center gap-3 p-4 border-b border-gray-100'>
                        <div className='rounded-lg bg-[#F4EEFF] p-3 text-[#6A38C2]'>
                            <Users className='h-6 w-6' />
                        </div>
                        <div>
                            <h1 className='font-bold text-xl'>My Network Global Chat</h1>
                            <p className='text-sm text-gray-500'>Discuss company issues, network, and ask questions.</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50/50'>
                        {messages.length === 0 ? (
                            <div className='flex items-center justify-center h-full text-gray-500'>
                                No messages yet. Be the first to say hi!
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMyMessage = msg.sender?._id === user?._id;
                                return (
                                    <div key={msg._id} className={`flex gap-3 max-w-[80%] ${isMyMessage ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage src={msg.sender?.profile?.profilePhoto} />
                                            <AvatarFallback>{msg.sender?.fullname?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                            <span className='text-xs text-gray-500 mb-1'>{msg.sender?.fullname}</span>
                                            <div className={`p-3 rounded-2xl ${isMyMessage ? 'bg-[#6A38C2] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                                <p className='text-sm break-words'>{msg.content}</p>
                                            </div>
                                            <span className='text-[10px] text-gray-400 mt-1'>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className='p-4 border-t border-gray-100 bg-white rounded-b-xl'>
                        <form onSubmit={sendMessageHandler} className='flex gap-2'>
                            <Input 
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className='flex-1 rounded-full'
                            />
                            <Button type="submit" className='rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] p-3 h-auto'>
                                <Send className='h-5 w-5' />
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyNetwork
