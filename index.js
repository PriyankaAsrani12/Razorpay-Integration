//Importing all the dependencies
var express = require("express");
var Razorpay = require("razorpay");
var bodyParser = require('body-parser');
const dotenv=require("dotenv");
const ejs=require("ejs");
const sqlite=require("sqlite3").verbose();
var request = require('request');


//Creating instance of express
var app = express();

dotenv.config();
app.set("view engine","ejs");

//Creating instance of Razorpay
const instance=new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})

//middleware
app.use('/web', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let db=new sqlite.Database('payment_table.sqlite3',(err)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log("Connected to database")
        db.run('CREATE TABLE IF NOT EXISTS payment_table(order_id TEXT,payment_id TEXT,signature TEXT,isSuccess TEXT)')
        db.all('SELECT * FROM payment_table',(err,rows)=>{
            console.log(rows)
        })
        console.log('Table created')
    }
    // db.close((err)=>
    // {
    //     if(err){
    //         console.log(err.message)
    //     }
    // })
    // console.log("Connection closed")
})

//Routes
app.get("/",(req,res)=>{
    res.render("payment")
})

//Creating order
app.post("/api/payment/order",(req,res)=>{
    params=req.body;
    
    instance.orders.create(params).then((data) => {
        res.send({"sub":data,"status":"success"});
    }).catch((error) => {
        res.send({"sub":error,"status":"failed"});
    })
});

//Verifying signatures
app.post("/api/payment/verify",(req,res)=>{
    body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    
    var expectedSignature = crypto.createHmac('sha256', "GCUbOW1rWB7fTKmOv5KTJ9QT")
                                    .update(body.toString())
                                    .digest('hex');
    var response={}
    if(expectedSignature === req.body.razorpay_signature){
        response={"status":"success"}
        db.run('INSERT INTO payment_table(order_id,payment_id,signature,isSuccess) VALUES(?,?,?,?)',[req.body.razorpay_order_id,req.body.razorpay_payment_id,req.body.razorpay_signature,'Yes'],(err)=>{
            if(err){
                console.log("Error")
            }
            else{
                console.log("Inserted")
            }
        })
    }
    else{
        response={"status":"failure"}
        db.run('INSERT INTO payment_table(order_id,payment_id,signature,isSuccess) VALUES(?,?,?,?)',[req.body.razorpay_order_id,req.body.razorpay_payment_id,req.body.razorpay_signature,'No'],(err)=>{
            if(err){
                console.log("Error")
            }
            else{
                console.log("Inserted")
            }
        })

    }
    res.send(response);

});




app.listen("3000",()=>{
    console.log("Server running at port 3000");
})
