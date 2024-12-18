//IMPORTAMOS LOS ARCHIVOS QUE NECESITAMOS 
const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const pokemonRouter = require("./routes/pokemonRoutes")
const app = express();
const PORT = 3000;

app.set("port",PORT);
//MIDELWARES
app.use(express.json())

//routes
app.use("/api/pokemon",pokemonRouter)
//DB connection - CONECCION CON LA BASE DE DATOS
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connect to DB"))
.catch((err)=>console.error(err));

//port listening
app.listen(PORT,()=>{
    console.log(`Listening in port ${PORT}`)
})