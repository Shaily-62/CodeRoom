import './App.css'
import React from 'react'
import { Editor } from '@monaco-editor/react'

function App() {
    return (
        <main className="h-screen w-full bg-gray-950 flex gap-4 p-3">
            <aside className="h-full w-1/4 bg-gray-900 rounded-lg"></aside>
            <section className="h-full w-3/4 bg-gray-800 rounded-lg overflow-hidden">
                <Editor height="100%" defaultLanguage="javascript" defaultValue="// some comment" theme="vs-dark" />
            </section>
        </main>
    )
}

export default App;