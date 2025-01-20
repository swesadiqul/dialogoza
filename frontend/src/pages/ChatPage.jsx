import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaBars, FaTimes, FaUserCircle, FaPaperPlane } from "react-icons/fa";


const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            window.location.href = "/login";
        }
        setUserToken(token);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const userMessage = { id: Date.now(), sender: "User", text: input };
        setMessages([...messages, userMessage]);

        setInput("");
        setIsTyping(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/chat/",
                { content: input },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${userToken}`, // Pass token in Authorization header
                    },
                }
            );

            if (response.status === 201) {
                setTimeout(() => {
                    setIsTyping(false);
                    const aiMessage = {
                        id: Date.now() + 1,
                        sender: "AI",
                        text: response.data.content,
                    };
                    setMessages((prevMessages) => [...prevMessages, aiMessage]);
                }, 1000);
            } else {
                console.error("Error:", response.data.error);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setIsTyping(false);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? "w-64" : "w-0"
                } bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
            >
                {/* Sidebar Header */}
                <div className="flex justify-between p-4">
                    <button onClick={toggleSidebar} className="text-white bg-gray-600 p-2 rounded-full">
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                {/* Chat History */}
                {sidebarOpen && (
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Chat History</h3>
                        <div className="mt-4">
                            <div className="text-sm font-semibold">Today</div>
                            <div className="text-gray-400 text-sm mb-2">Chat with AI - 10:30 AM</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                    <button onClick={toggleSidebar} className="text-white bg-gray-600 p-2 rounded-full">
                        <FaBars />
                    </button>
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-white bg-gray-600 p-2 rounded-full flex items-center"
                        >
                            <FaUserCircle size={24} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                                <ul className="p-2">
                                    <li className="hover:bg-gray-200 p-2 rounded">Profile</li>
                                    <li className="hover:bg-gray-200 p-2 rounded">Settings</li>
                                    <li className="hover:bg-gray-200 p-2 rounded">Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat messages area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.sender === "User" ? "justify-end" : "justify-start"
                            } items-center`}
                        >
                            {msg.sender === "AI" && (
                                <div className="mr-3">
                                    <FaUserCircle size={24} className="text-gray-600" />
                                </div>
                            )}
                            <div
                                className={`${
                                    msg.sender === "User"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-gray-800"
                                } p-4 rounded-xl max-w-lg shadow-md`}
                            >
                                <p>{msg.text}</p>
                            </div>
                            {msg.sender === "User" && (
                                <div className="ml-3">
                                    <FaUserCircle size={24} className="text-blue-500" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start items-center">
                            <div className="mr-3">
                                <FaUserCircle size={24} className="text-gray-600" />
                            </div>
                            <div className="bg-gray-300 text-gray-800 p-4 rounded-xl max-w-lg shadow-md">
                                <div className="flex items-center">
                                    <div className="dot w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></div>
                                    <div className="dot w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></div>
                                    <div className="dot w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input box with icon */}
                <form onSubmit={sendMessage} className="bg-white p-4 border-t flex items-center shadow-md relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                        type="submit"
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                    >
                        <FaPaperPlane size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
