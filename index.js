// Import necessary modules
const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');


// Create an instance of the Express application
const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

const port = 7777;

app.use(cors({
    origin: '*'
}));

// Define a simple API endpoint
app.get('/api/v1/jira/board/:boardNumber', async (req, res) => {
    try {
        const boardId = req.params.boardNumber;
        const auth = basicAuth(req);
        if (!auth || (auth && (!auth.name || !auth.pass))) {
            res.status(401).json({ message: "Authorized" })
            return;
        }
        const response = await axios.get(`https://neotechnologies.atlassian.net/rest/agile/1.0/board/${boardId}/issue`,
            {
                auth: {
                    username: auth.name,
                    password: auth.pass
                }
            }
        )
        res.json({ status: response.data });
    } catch (exception) {
        console.log(exception);
        if (exception.response) {
            res.status(401).json({ exception: exception.response.data });
            return;
        } else {
            res.status(exception.status).json({ exception: exception.response });
        }
    }
    //   res.json({ message: 'Hello, World!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app
