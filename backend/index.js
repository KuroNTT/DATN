const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

// middle ware 

app.use(express.json());
app.use(cors());

// Router

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
    .on('error', (err) => {
        console.error(`Error starting server on port ${process.env.PORT}, error: ${err}`);
    })