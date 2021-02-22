import express from 'express';
import bodyParser from 'body-parser';
import MongoClient from "mongodb";
import path from 'path';

const url = "mongodb+srv://Irrintxi12:Irrintxi12@cluster0.6t245.mongodb.net/articles?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());


const withDB = async (operations, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db("articles");
        await operations(db);
        client.close();
    }
    catch (error) {
        res.status(500).json({ message: "Error connecting to db", error: error})
    }
}


app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;
    withDB(async (db)=>{
        const articleInfo = await db.collection('article').findOne({name: articleName});
        res.status(200).json(articleInfo);
    }, res)
});


app.post('/api/articles/:name/upvote', async(req, res) => {
    const articleName = req.params.name;
    withDB(async (db) => {
        const articleInfo = await db.collection('article').findOne({name: articleName});
        await db.collection('article').updateOne({name: articleName}, {
            '$set':{
                upvotes: articleInfo.upvotes +1
            },
        })
        const updatedArticleInfo = await db.collection('article').findOne({name: articleName});
        res.status(200).json(updatedArticleInfo);
    }, res)
})


app.post('/api/articles/:name/add-comment', async (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;
    withDB(async (db) => {
        const articleInfo = await db.collection('article').findOne({name: articleName});
        await db.collection('article').updateOne({name: articleName}, {
            '$set':{
                comments: articleInfo.comments.concat({username, text})
            },
        })
        const updatedArticleInfo = await db.collection('article').findOne({name: articleName});
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(8000, ()=> console.log("The app is listening on port 8000"))