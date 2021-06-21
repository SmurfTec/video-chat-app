const express=require('express')
const app=express()
const server=require("http").createServer(app);

const cors=require('cors');

const { Socket } = require('dgram');

//  socket.io   used for real-time data transmession data can be ( messages , audio , video)
const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

app.use(cors())


const PORT=process.env.PORT || 5002

app.get('/',(req,res)=>{
    res.send(" server running ")
})

io.on('connection',(socket)=>{
    
    // emit myslef
    socket.emit('me',socket.id)

    // endCall 
    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended")
    })

    //  get-date from frontend and giveto this 
    //  Id-of-user,user-data,from,name
    socket.on("calluser",({userToCall,signalData,from,name})=>{
        // sending data to frontend
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})

    })

    //  in this we recieve the data and pass the signal 
    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    })
      
})

server.listen(PORT,()=>{
    console.log(` server is running on post ${PORT}`)
})