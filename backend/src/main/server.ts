import app from "./app";
import {connectDB} from "../infrastructure/database/mongoConnection";

connectDB();

app.listen(5000, () => {
    console.log("server running on port 5000");
})