import mongoose from "mongoose";

const modelschema=mongoose.Schema({
    id:Number,
    title:String,
    description:String
}
)

const Note=mongoose.model("Note",modelschema)
export default Note;