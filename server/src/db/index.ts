import { connect } from "mongoose";

const uri = "mongodb://localhost:27017/smart-market"

connect(uri).then(() => {
    console.log("bd connected successfully")
}).catch(err => {
    console.log("db connection error:", err.message);
});