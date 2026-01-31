//ignore file for local testing

const getdocs=require('./backend/mongoretrieve.js')

getdocs.getAllCourses().then(value=>{
    console.log(value);
});