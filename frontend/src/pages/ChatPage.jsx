import React, { useState } from "react";
import axios from "axios";
import {
    FaSearch,
    FaPlus,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaPaperPlane,
} from "react-icons/fa";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const userMessage = { id: Date.now(), sender: "User", text: input };
        setMessages([...messages, userMessage]);

        setInput("");

        setIsTyping(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/chat/",
                { message: input },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                }
            );

            if (response.status === 200) {
                setTimeout(() => {
                    setIsTyping(false);
                    const aiMessage = {
                        id: Date.now() + 1,
                        sender: "AI",
                        text: response.data.reply,
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

    const getCsrfToken = () => {
        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
        return csrfToken ? csrfToken[1] : "";
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const openSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleLiveSearch = async (query) => {
        setSearchQuery(query);

        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            // Simulated search results for demonstration purposes
            const results = [
                { id: 1, text: `Result for "${query}" - Item 1` },
                { id: 2, text: `Result for "${query}" - Item 2` },
                { id: 3, text: `Result for "${query}" - Item 3` },
            ];
            setSearchResults(results);

            // Example of making a backend API call for live search
            /*
            const response = await axios.get(`http://localhost:8000/api/search/?query=${query}`);
            if (response.status === 200) {
              setSearchResults(response.data.results);
            }
            */
        } catch (error) {
            console.error("Error during live search:", error);
        }
    };

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? "w-64" : "w-0"
                    } bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
            >
                {/* Sidebar Header */}
                <div className="flex justify-between p-4">
                    <button
                        onClick={toggleSidebar}
                        className="text-white bg-gray-600 p-2 rounded-full"
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {sidebarOpen && (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={openSearchModal}
                                className="text-white bg-gray-600 p-2 rounded-full"
                            >
                                <FaSearch />
                            </button>
                            <button className="text-white bg-gray-600 p-2 rounded-full">
                                <FaPlus />
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat History */}
                {sidebarOpen && (
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Chat History</h3>
                        <div className="mt-4">
                            <div className="text-sm font-semibold">Today</div>
                            <div className="text-gray-400 text-sm mb-2">Chat with AI - 10:30 AM</div>

                            <div className="text-sm font-semibold">Yesterday</div>
                            <div className="text-gray-400 text-sm mb-2">Chat with AI - 9:00 PM</div>

                            <div className="text-sm font-semibold">Wise</div>
                            <div className="text-gray-400 text-sm">Chat with AI - 1 Jan 2025</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* Header */}
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                    {sidebarOpen ? (
                        <h2 className="text-2xl font-semibold">Chat with Dialogoza AI</h2>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className="text-white bg-gray-600 p-2 rounded-full"
                        >
                            <FaBars />
                        </button>
                    )}

                    {/* User Icon with Dropdown */}
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
                            className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`${msg.sender === "User" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                                    } p-4 rounded-xl max-w-lg shadow-md`}
                            >
                                <p className="text-sm font-semibold">{msg.sender}</p>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-300 text-gray-800 p-4 rounded-xl max-w-lg shadow-md">
                                <p>AI is typing...</p>
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

            {/* Search Modal */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
                        <form className="flex items-center mb-4 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleLiveSearch(e.target.value)}
                                placeholder="Type to search..."
                                className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            />
                            <button
                                onClick={closeSearchModal}
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            >
                                <FaTimes size={20} />
                            </button>
                        </form>
                        <div className="space-y-4">
                            {searchResults.map((result) => (
                                <div key={result.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                    {result.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatPage;
