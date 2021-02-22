import MongoClient from "mongodb";

async function run(url) {
    const client = new MongoClient(url);
    const dbName = "articles";
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);
         // Use the collection "people"
         const col = db.collection("article");
         // Find one document
         const myDoc = await col.find();
         // Print to the console
         console.log(myDoc);
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}



export default run;