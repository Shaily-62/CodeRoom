import './App.css'
import React from 'react'
import { useRef, useMemo, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'     // Import the Editor component from the @monaco-editor/react package to use the Monaco Editor in the React application
import { MonacoBinding } from "y-monaco"     // Import the MonacoBinding class from the y-monaco package to bind the Monaco Editor to a Yjs document for real-time collaboration
import * as Y from 'yjs'                     // Import the Yjs library to create and manage shared documents for real-time collaboration
import { SocketIOProvider } from "y-socket.io"  // Import the SocketIOProvider class from the y-socket.io package to connect the Yjs document to a Socket.IO server for real-time communication and synchronization between clients 


function App() {
    const editorRef = useRef(null); // Create a reference to the Monaco Editor instance, initialized to null. This reference will be used to access the editor instance after it has been mounted and initialized.

    const [userName, setUserName] = useState(() => {
        return new URLSearchParams(window.location.search).get("username") || "";
    });

    const [users, setUsers] = useState([]); //this is used to create a list to sow all the users

    const ydoc = useMemo(() => new Y.Doc(), []);  //this is a data structure that will hold the shared state of the editor across multiple clients. It is created using the Y.Doc constructor from the Yjs library. The useMemo hook is used to ensure that the Y.Doc instance is only created once and is memoized for performance optimization.

    const yText = useMemo(() => ydoc.getText('monaco'), [ydoc]); // This creates a Y.Text instance from the Y.Doc using the getText method. The Y.Text instance will be used to represent the shared text content of the Monaco Editor. The useMemo hook is used to ensure that the Y.Text instance is only created once and is memoized for performance optimization.


    const handleMount = (editor) => {

        editorRef.current = editor;// This function is called when the Monaco Editor is mounted and initialized. It takes the editor instance as an argument and assigns it to the editorRef.current property, allowing us to access the editor instance later for setting up the real-time collaboration bindings. 
        const monacoBinding = new MonacoBinding(
            yText,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            // provider.awareness
        )

    }

    const handleJoin = (e) => {
        e.preventDefault();
        setUserName(e.target.username.value);
        //reload huaa toh data gone thatswhy we use
        window.history.pushState({}, "", "?username=" + e.target.username.value);
    };


    useEffect(() => {
        if (userName) {
            const provider = new SocketIOProvider('/', 'monaco', ydoc, { autoConnect: true }); // Create a new SocketIOProvider instance to connect to the Socket.IO server at the specified URL and room name, and pass the Y.Doc instance for synchronization. This provider will handle the communication between the client and the server for real-time collaboration.

            provider.awareness.setLocalStateField("user", { userName });

            provider.awareness.on("change", () => {
                const states = Array.from(provider.awareness.getStates().values());
                setUsers(
                    states
                        .filter(state => state.user && state.user.userName)
                        .map(state => state.user)
                );
            })

            function handleBeforeUnload() {
                provider.awareness.setLocalStateField("user", null);
            }

            window.addEventListener("beforeunload", handleBeforeUnload);

            return () => {
                provider.disconnect();
                window.removeEventListener("beforeunload", handleBeforeUnload);
            }

        }
    }, [userName])


    if (!userName) {
        return (
            <main className="h-screen w-full bg-gray-950 flex items-center justify-center p-3 flex-col gap-4 text-white">
                <form
                    onSubmit={handleJoin}
                    className="flex flex-col gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="username"
                    />

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    // onClick={ }
                    >
                        Join
                    </button>
                </form>

            </main>
        )
    }


    return (
        <main className="h-screen w-full bg-gray-950 flex gap-4 p-3">
            <aside className="h-full w-1/4 bg-gray-900 rounded-lg">
                <h2 className="text-xl font-bold text-white p-4 border-b border-gray-700">Users</h2>
                <ul className="p-4 flex flex-col gap-2">
                    {users.map((user, index) => (
                        <li key={index} className="text-white bg-gray-800 rounded px-3 py-2">
                            {user.userName}
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="h-full w-3/4 bg-gray-800 rounded-lg overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    defaultValue="// some comment"
                    theme="vs-dark"
                    onMount={handleMount}
                />  // Render the Monaco Editor component with the specified height, default language, default value, theme, and onMount handler. The onMount handler is called when the editor is mounted and initialized, allowing us to set up the real-time collaboration bindings at that point.
            </section>
        </main>
    )
}

export default App;
