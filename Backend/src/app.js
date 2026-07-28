const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())
app.use(cookieParser())


/**
 * - Routes required
 */
const authRouter = require('./routes/auth.routes')
const accountRouter =  require('./routes/account.routes')
const transactionRouter = require('./routes/transaction.routes')


//dummy route for testing
app.get("/",(req,res)=>{
  res.send("Welcome to Banking Ledger System API")
})


/**
 * - Use Routes
 */
app.use("/api/auth" ,authRouter)
app.use("/api/accounts" , accountRouter)
app.use("/api/transactions" , transactionRouter)


module.exports = app;