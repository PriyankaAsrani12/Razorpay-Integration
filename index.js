//Importing all the dependencies
var express = require("express");
var Razorpay = require("razorpay");
var bodyParser = require('body-parser');
const dotenv=require("dotenv");
const ejs=require("ejs");

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
    console.log(req.body)
    body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    
    var expectedSignature = crypto.createHmac('sha256', "GCUbOW1rWB7fTKmOv5KTJ9QT")
                                    .update(body.toString())
                                    .digest('hex');
    var response = {"status":"failure"}
    if(expectedSignature === req.body.razorpay_signature)
        response={"status":"success"}
    res.send(response);
    
});


app.listen("3000",()=>{
    console.log("Server running at port 3000");
})
