const express = require('express');
const nodemailer = require('nodemailer')
const router= express.Router();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:"travelsplitter@gmail.com",
      pass: "hkmvtnyenlpauamt"
    }
  });

  router.post("/sendmail",(req, res) =>{
    text = String(req.body.text)
    let mailOptions = {
      from: "travelsplitter@gmail.com",
      to: req.body.email,
      subject: "donotreply@travelsplitter",
      text: text,
    };
   
    transporter.sendMail(mailOptions,  (err, data) => {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
        res.json({ status: "Email sent" });
      }
    });
   });

   module.exports = router;