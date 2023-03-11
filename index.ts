import express from 'express';
const app = express();

app.use(express.json());


app.get(`/`, (req, res) => {
    res.status(200).json({hello: 'me'});
});

// port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port: ${port}`));