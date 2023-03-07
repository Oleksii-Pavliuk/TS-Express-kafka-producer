import express, { Express, Request, Response } from 'express';
import {Kafka} from "kafkajs";
import bodyParser from 'body-parser';

// Initialize app and set up templates
const app: Express = express();
const port = 5000;
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.set('views', './templates');

// Initialize kafka client
const kafka = new Kafka({
    clientId: 'express-server',
    brokers: [':9092'],
  })
const producer = kafka.producer()




// Render index page
try{
    app.get('/', (req: Request, res: Response) => {
    res.render('index');
    });
  }catch(err){
    console.log(err)
  }
  

// Recive data from form and try to send message to kafka topic
    app.post('/produce', async function(req, res) {
      try{
        const message = req.body.message
        console.log('Received message:', message);
        await producer.connect()
        await producer.send({
          topic: 'messages',
          messages: [
            { value: message },
          ],
        })
        await producer.disconnect()
        console.log('ok')
      }catch(err){
        console.log(err)
        return res.send(err);
      }
      res.send('ok');
    });


app.listen(port,() => {
  console.log(`App listening on http://localhost:${port}`)
});

