const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });


/*
    requiere: 
    driver para mongodb
        npm install mongodb   
    variable entorno
        npm install dotenv


*/


const uri = "mongodb+srv://" + process.env.API_KEY + "@cluster0.tik81bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
 
async function run() {
  try {
    await client.connect();
    const db = client.db('test');
    

    // Find the first document in the collection
    //const entry = db.collection('entries');
    //const first = await entry.findOne.la();
    //console.log(first);


    // Find the last document in the collection
    /*
    const entry = await db.collection('entries')
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .toArray();

    if (entry.length === 0) {
    console.log('No entries found');
    } else {
    console.log('Last entry:', entry[0]);
    }
    */

    //f ultimas 24 horas

    const now = new Date();
    const yesterday = now - 24 * 60 * 60 * 1000;
    console.log(yesterday);

    const entries = await db.collection('entries')
    .find({ date: { $gte: yesterday } })
    .sort({ date: 1 })
    .toArray();

    

    if (entries.length === 0) {
        console.log('No entries found');
    }else{
        for (const entry of entries) {

            const fechaFormateada = formatHoraFecha(entry.date);
           
            console.log(fechaFormateada + '  ' + entry.sgv);
        }
    }

    console.log(entries.length);

  }catch (error) {  
    console.log("error");
    console.error(error.message); 
  }finally {
    // Close the database connection when finished or an error occurs
    
    await client.close();
  }
}

function formatHoraFecha(inputDate) {
    const date = new Date(inputDate);
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }


run().catch(console.error);