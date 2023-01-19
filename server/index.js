const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const mongoose = require("mongoose")


dotenv.config()
const {Schema}=mongoose

 const userSchema = new Schema(
    {   img:{type:String,required:true},
        field:{type:String,required:true},
        comment:{type:String,required:true}
    },
    {timestamps:true}
 )

 const Users = mongoose.model("users",userSchema)

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.send("<h1>Admin Panel</h1>")
})

//GET all users 

app.get("/users",(req,res)=>{
    Users.find({},(err,docs)=>{
        if(!err){
            res.send(docs)
        }
        else{
            res.status(404).json({message:err})
        }
    })
})

//with id

app.get("/users:id",(req,res)=>{
    const {id}= req.params
    Users.findById(id,(req,res)=>{
        if(!err){
            if(doc){
                res.send(doc)
            }
            else{
                res.status(404).json({message:"NOT FOUND"})
            }
        }
        else{
            res.status(500).json({message:err})
        }
    })
})


//delete

app.delete("/users/:id",(req,res)=>{

    const {id}=req.params
    Users.findByIdAndDelete(id,(err)=>{
        if(!err){
            res.send("Deleted data")
            
        }else{
            res.status(404).json({message:err})
        }
    })
})

//add
app.post("/users",(req,res)=>{
    const user=new Users({
        img:req.body.img,
        field:req.body.field,
        comment:req.body.comment,
       
    })
    user.save()
    res.send({message:"User Created"})
})

const PORT = process.env.PORT


const url=process.env.CONNECTION_URL.replace("<password>",process.env.PASSWORD)

mongoose.set('strictQuery', true);

mongoose.connect(url,(err)=>{
    if(!err){
    console.log("DB connect");
        app.listen(PORT,()=>{
            console.log("Server start");
        })
    }else{
        console.log("Disconnect");
    }
})
 