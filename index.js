const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const params = require('params');
const { isBuffer } = require('util');


const app = express();

const connection =  mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'crud'
});

connection.connect(function(error){
    if(!!error){
        console.log(error);
    }
    else{
        console.log('database connected');
    }
});
//set view files
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res)=>{
    let sql  = 'SELECT * FROM users';
    let query = connection.query(sql,(error,rows)=>{
        if(error) throw error;
        res.render('user_index',{
            title : 'Crud',
            user : rows

        });

    });
});
app.get('/add',(req,res)=>{
    res.render('user_add',{
        title : 'Add User',
    });
}); 

app.post('/save',(req,res) =>{
    let data ={name: req.body.name, email: req.body.email, phone_nu: req.body.phone_nu};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(error,results) => {
        if(error) throw error;
        res.redirect('/');
    });
});

app.get('/edit/:userId', (req,res) => {
    const userId = req.params.userId;
    let sql = `SELECT * FROM users WHERE id = ${userId}`;
    let query = connection.query(sql,(error,result) =>{
        if(error) throw error;
        res.render('user_edit',{
            title: 'Crud',
            user : result[0]     
        });
    });
});

app.post('/update', (req,res) =>{
    const userId = req.body.id;
    let sql = "UPDATE users SET name = '"+req.body.name+"', email='"+req.body.email+"', phone_nu='"+req.body.phone_nu+"' WHERE id="+userId;
    let query = connection.query(sql,(error,results) => {
        if(error) throw error;
        res.redirect('/');
    });
});

app.get('/delete/:userId', (req,res) => {
    const userId = req.params.userId;
    let sql = `DELETE FROM users WHERE id = ${userId}`;
    let query = connection.query(sql,(error,result) =>{
        if(error) throw error;
        res.redirect('/');
    });
});



 
app.listen(5003,() => {
    console.log("App started at port 5003");
});