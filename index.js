const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const connectDB=require('./database')
const User = require('./schema')

const app = express();
const port = 3010;
const db_url=process.env.MONGO_URI;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  connectDB(db_url)
});

app.use(express.json());

app.post('/api/users',async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    if (!name | !email | !password){
      return res.status(400).json({message:"Fields cannot bet empty"})
    }
    const userData=req.body
    const newUser=new User(userData)
    await newUser.save();
    
    return res.status(201).json({message:"Record Created Successfully."})
  }catch(err){
    if (err.code===11000){
      res.status(400).json({message:"Validation Error: Email Already Exists"})
    }
  }
  
})