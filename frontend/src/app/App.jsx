import './App.css'
import React from 'react'
import { useRef, useMemo } from 'react'
import Editor from '@monaco-editor/react'     // Import the Editor component from the @monaco-editor/react package to use the Monaco Editor in the React application
import { MonacoBinding } from "y-monaco"     // Import the MonacoBinding class from the y-monaco package to bind the Monaco Editor to a Yjs document for real-time collaboration
import * as Y from 'yjs'                     // Import the Yjs library to create and manage shared documents for real-time collaboration
import { SocketIOProvider } from "y-socket.io"  // Import the SocketIOProvider class from the y-socket.io package to connect the Yjs document to a Socket.IO server for real-time communication and synchronization between clients 


function App() {
    const editorRef = useRef(null); // Create a reference to the Monaco Editor instance, initialized to null. This reference will be used to access the editor instance after it has been mounted and initialized.

    const ydoc = useMemo(() => new Y.Doc(), []);  //this is a data structure that will hold the shared state of the editor across multiple clients. It is created using the Y.Doc constructor from the Yjs library. The useMemo hook is used to ensure that the Y.Doc instance is only created once and is memoized for performance optimization.

    const yText = useMemo(() => ydoc.getText('monaco'), [ydoc]); // This creates a Y.Text instance from the Y.Doc using the getText method. The Y.Text instance will be used to represent the shared text content of the Monaco Editor. The useMemo hook is used to ensure that the Y.Text instance is only created once and is memoized for performance optimization.


    const handleMount = (editor) => {
        editorRef.current = editor;
        const provider = new SocketIOProvider('http://localhost:3000', 'monaco', ydoc, { autoConnect: true }); // Create a new SocketIOProvider instance to connect to the Socket.IO server at the specified URL and room name, and pass the Y.Doc instance for synchronization. This provider will handle the communication between the client and the server for real-time collaboration.

        const monacoBinding = new MonacoBinding(
            yText,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            provider.awareness
        )
    }   // this establish the frontend and the server connection and binds the Monaco Editor to the Y.Text instance for real-time collaboration. The MonacoBinding constructor takes the Y.Text instance, the Monaco Editor model, a set of editor instances (in this case, just one), and the awareness property from the provider to manage the collaborative editing state across multiple clients.


    return (
        <main className="h-screen w-full bg-gray-950 flex gap-4 p-3">
            <aside className="h-full w-1/4 bg-gray-900 rounded-lg"></aside>
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
