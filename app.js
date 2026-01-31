const express=require('express');
const connect=require('./database/connect.js');
const APIRouter=require('./backend/router.js');
const dotenv=require('dotenv');
const cors=require('cors');
const path = require('path')
const bodyparser=require('body-parser');
const app=express();


dotenv.config();

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.use(bodyparser.urlencoded({ extended: false }));

connect();

const serveFrontend = (request, response) => {
    response.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'), {
      headers: {
        'Content-Type': 'text/html',
      }
    })
}
  
app.get('/', serveFrontend)
app.get('/courses', serveFrontend)
app.get('/profs', serveFrontend)
app.get('/about', serveFrontend)


app.use('/api', APIRouter);

const PORT = parseInt(process.env.PORT, 10);
const portToUse = (!isNaN(PORT) && PORT > 0 && PORT < 65536) ? PORT : 3000;

if (require.main === module) {
  app.listen(portToUse, () => {
    console.log(`Server running on port ${portToUse}`);
  });
}

module.exports = app;
