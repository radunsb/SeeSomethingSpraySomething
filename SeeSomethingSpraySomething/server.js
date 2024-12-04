import mongoose from 'mongoose'
import Controller from './models/Controller.js';
import express from 'express'
import cors from 'cors'
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect("mongodb+srv://radunsb:thisisabadpassword@cluster0.l3cihxm.mongodb.net/SpraySomething?retryWrites=true&w=majority");

app.get('/api/controllers', async (req, res) => {
    try {
        const controllers = await Controller.find();
        res.json(controllers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
