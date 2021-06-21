const express=require('express')
const app=express()
const server=require("http").createServer(app);
const cors=require('cors');
const { Socket } = require('dgram');

const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

app.use(cors())

const PORT=process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send(" server running ")
})

io.on('connection',(socket)=>{
    socket.emit('me',socket.id)

    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended")
    })

    socket.on("calluser",({usertoCall,signalData,from,name})=>{
        io.to(usertoCall).emit("calluser",{signal:signalData,from,name})
    })

    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    })
    
})

server.listen(PORT,()=>{
    console.log(` server is running on post ${PORT}`)
})