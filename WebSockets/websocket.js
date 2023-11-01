const ws = require('ws');

const db=require("../Models")

const wss = new ws.Server({
    port: 5001,
}, () => console.log(`Server started on 5001`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        ws.id=message.user_id
        console.log("it did work")
        switch (message.method) {
            case 'message':
                handleClientMessage(message)
                console.log(message)
                break;
            case 'chat-connection':
                getUserChat(message)
                break;
        }
    })
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

async function  getUserChat({user_id, conversation_id}){  
    const messages= await db.message.findAll({
        where:{
            conversation_id:conversation_id
        }
    }
    )
    wss.clients.forEach(client => {
        if(client.id===user_id){
        client.send(JSON.stringify({method:"chat-connection",messageData:messages}))
    }
    })  
}

function handleClientMessage(message){ 
    wss.clients.forEach((client)=>{
        client.send(JSON.stringify(message.message))
    })

}


module.exports=wss