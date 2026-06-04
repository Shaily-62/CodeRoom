import express from 'express'                       // Import the Express framework to create a web server and handle routing
import { createServer } from 'http'                      // Import the createServer function from the http module to create an HTTP server
import { Server } from "socket.io"                     // Import the Server class from Socket.IO to create a Socket.IO server
import { YSocketIO } from 'y-socket.io/dist/server'    // Import YSocketIO for real-time collaboration
import cors from 'cors'

const app = express();       
const port = 3000;
app.use(cors());

const httpServer = createServer(app); // Create an HTTP server using the Express app
const io = new Server(httpServer, {    // Create a Socket.IO server and attach it to the HTTP server
    cors: {
        origin: "*",                     // Allow all origins (you can specify your frontend URL here)
        methods: ["GET", "POST"]         // Allow GET and POST methods
    }
});


const ySocketIO = new YSocketIO(io); // Create a YSocketIO instance using the Socket.IO server 
ySocketIO.initialize()       // Initialize the YSocketIO instance to set up the necessary event listeners and handlers for real-time collaboration


//health check route
app.get('/',(req,res)=>{
    res.status(200).json({message:'hello world', success:true})
})

app.get('/health',(req,res)=>{
    res.status(200).json({message:'Server is healthy', success:true})
})


//server setup
httpServer.listen(port, () => {     
    console.log(`Server is running on port ${port}`);
});
