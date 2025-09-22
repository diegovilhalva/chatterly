import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
const app = express()

const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get("/",(req,res) => {
    return res.send("OK")
})


app.listen(PORT,() => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})