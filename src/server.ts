import app from "./app";
import { connectReddis } from "./cache";

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Our App is listening on ${PORT}`);
})

