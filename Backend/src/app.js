const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express()
app.disable("etag");

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174"],
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
const dashboardRoutes = require('./routes/dashboard.routes')


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
app.use("/api/dashboard", dashboardRoutes);

app.use(errorMiddleware);


module.exports = app;