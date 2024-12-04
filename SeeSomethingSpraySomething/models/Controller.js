import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const controllerSchema = new Schema({
  _id: Number,
  controller_name: String,
  doc_link: String,
},
{collection: 'Controllers'});

const Controller = model('Controller', controllerSchema);
export default Controller;