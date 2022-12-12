require("dotenv").config();
const express = require("express");
const OurApp = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser")
OurApp.use(cors());
//importing schemas
const Member = require("./schema/memberSchema");
OurApp.use(
    bodyparser.urlencoded({
      extended: true,
    })
  );
OurApp.use(bodyparser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection established!"))
  .catch((err) => {
    console.log(err);
  });

OurApp.get("/", (request, response) => {
  response.json({ message: "link working" });
});

function CompletePayment(){
    return true;
}

OurApp.post("/member/new", async (req, res) => {
    try {
      const {name, phone, age, email, batch, gender, paymentInfo }  = req.body;
      if(age < 18 || age > 65){
        return res.status(400).json({"error" : "Age should be between 18 and 65"});
      }
      // CompletePayment() function is currently returning true
      const result = CompletePayment(paymentInfo);
      if(!result){
        return res.status(400).json({"error": "there is some problem completing the payment."})
      }
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const d = new Date();
      const m = d.getMonth();
      const year = d.getFullYear();
      const currentMonth = months[m] + year;
      
      const userData = new Member({
        name: name,
        phone: phone,
        age: age,
        email: email,
        batch: batch,
        gender : gender,
        lastPaymentMonth : currentMonth
      });
      await userData.save();
      return res.json({message: "success"});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  OurApp.post("/member/payment", async (req, res) => {
    try {
      const { email, batch, paymentInfo }  = req.body;
      await Member
      .findOne({email : email})
      .then((user)=> {
        if(user){
            // CompletePayment is currently returning true
            const result = CompletePayment(paymentInfo);
            if(!result){
                return res.status(400).json({"error": "there is some problem completing the payment."})
            }
            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            const d = new Date();
            const m = d.getMonth();
            const year = d.getFullYear();
            const currentMonth = months[m] + year;
            Member.updateOne({email : email}, {$set : {batch : batch, lastPaymentMonth : currentMonth}})
            .catch((err)=> {
                console.log(err);
            })
        }
        else{
            return res.status(400).json({"error": "User not found. Please Enter existing Email id"});
        }
      })
      .catch((err) => {
        console.log(err);
      });
      return resjson({message: "success"});
    } catch (error) {
      return res.json({ error: error.message });
    }
  });



  OurApp.listen(5000, () => {
    console.log("Server is Up and Running");
  });
  