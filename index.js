const app = require("express")();
const server = require("http").createServer(app);
const cors = require('cors');

// io server side instance
const io = require("socket.io")(server, {
    cors : {
        origin : "*", //allow access from all origin
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

//first route
app.get("/", (req, res)=> {
    res.send("Server is running")
})

io.on('connection', (socket)=>{
    socket.emit('me',socket.id); //will give us our id.
    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended")
    });
    socket.on("calluser",({ userToCall, signalData, from, name })=>{
        io.to(userToCall).emit("calluser", { signal : signalData, from, name })
    });
    socket.on("answercall", (data)=>{
        io.to(data.to).emit("callaccepted", data.signal)
    })
})

server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));