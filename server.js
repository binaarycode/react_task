const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    
    user: "root",
    host: "localhost",
    password: "password",
    database: "restrauntbooking",
  });


//CREATE A BOOKING 
app.post('/create', (req, res) => {
    const customerSurname = req.body.customerSurname
    const customerMobileNumber = req.body.customerMobileNumber
    const bookingPartySize = req.body.bookingPartySize
    const dateOfBooking = req.body.dateOfBooking 

        //LOOK UP THE DATE OF BOOKING IN THE DATABASE AND RETRIEVE ALL BOOKING IDS 
       db.query("SELECT COUNT(idbookings) AS amount FROM bookings WHERE dateOfBooking = ? ",[dateOfBooking],(err,result) => {

            if ( result[0]['amount'] > 4){

                return res.send("No more tables available");

            }else{
                
            //IF BOOKINGS ARE <5 RUN THE FOLLOWING CODE   
            let tableNumber = result[0]['amount'] + 1;

                db.query(
                    "INSERT INTO bookings (customerSurname, customerMobileNumber, bookingPartySize, dateOfBooking, tableNumber) VALUES (?,?,?,?,?)",[customerSurname, customerMobileNumber, bookingPartySize, dateOfBooking, tableNumber],
                    (err, result) => {
                        if(err){
                            console.log(err)
                        }else{
                            return res.send('Your booking has been completed');
                        }
                    }
                );

                //return conformation of the booking 
            }
        });
    // IF THIS RUNS TELL THEM THEY GET A BOOKING
}) 


//GET ALL BOOKINGS
app.get('/bookings', (req, res) => {
    db.query("SELECT * FROM bookings", (err,result) => {

        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

//UPDATE THE CUSTOMERS NUMBER
app.put('/updateNumber', (req, res) => {

    const idbookings = req.body.idbookings;
    const customerMobileNumber = req.body.customerMobileNumber;

    db.query(
        "UPDATE bookings SET  customerMobileNumber = ? WHERE idbookings = ?",
        [customerMobileNumber,idbookings], 
        (err, result) =>{
            if (err){
                console.log(err);
            }else{
                res.send("result");
            }
        }
    );
});

//UPDATE THE PARTY SIZE
app.put('/updatePartySize', (req, res) => {

    const idbookings = req.body.idbookings;
    const bookingPartySize = req.body.bookingPartySize;

    console.log(idbookings);
    console.log(bookingPartySize);

    db.query(
        "UPDATE bookings SET  bookingPartySize = ? WHERE idbookings = ?",
        [bookingPartySize,idbookings], 
        (err, result) =>{
            if (err){
               
                console.log(err);
            }else{
                res.send(result);
            }

        }
    );
});

//DELETE THE BOOKING
app.delete('/delete/:idbookings', (req,res) => {
    const idbookings = req.params.idbookings;

    db.query(
        "DELETE FROM bookings WHERE idbookings = ?", idbookings,
        (err,result) => {
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        })
})

//GET TOTAL NUMBER OF CUSTOMERS FROM a DATE

app.post('/customerTotal', (req, res) => {

    const dateOfQuestion = req.body.dateOfQuestion 
    console.log(dateOfQuestion)

    db.query(
        "SELECT SUM(bookingPartySize) FROM restrauntbooking.bookings where dateOfBooking = ?",[dateOfQuestion],
        (err, result) =>{
            if(err){
                console.log(err)
            }else{
                console.log(result);
                res.send(result);
                
            }
        }
    )
});




//GET TOTAL NUMBER OF CUSTOMERS FROM TWO DATES

app.get('/periodCustomerTotal/periodStart=:dateOne&periodEnd=:dateTwo', (req,res) =>{

    const dateOne = req.params.dateOne;
    const dateTwo = req.params.dateTwo;

    console.log(dateOne)
    console.log(dateTwo)
    db.query(
        "SELECT dateOfBooking, sum(bookingPartySize) FROM restrauntbooking.bookings where dateOfBooking between ? and ? GROUP BY dateOfBooking ORDER BY dateOfBooking ASC",[dateOne,dateTwo],
        (err, result) =>{
            if(err){
                console.log(err)
            }else{
                console.log(result);
                res.send(result);

            }
        }
    )
    
})


//GET A BOOKING LIST FOR A SPECIFIED DAY
//INCLUDE TABLE LIST AND BOOKINGS
  //IF TABLE IS BOOKED GET CUSTOMER SURNAME + NUMBER
  //IF NULL A NULL VALUE CAN BE RETURNED
  app.get("/dailyInformation/find=:dateOfQuestion2", (req,res) =>{

    const dateOfQuestion2  = req.params.dateOfQuestion2;
    console.log(dateOfQuestion2)
   
    db.query(
        "SELECT * FROM restrauntbooking.bookings where dateOfBooking = ?",[dateOfQuestion2],
        (err, result) =>{
            if(err){
                console.log(err)
            }else{
                console.log(result);
                res.send(result);
                
            }
        }
    )

})


app.listen(3001,() => {
    console.log("Server is running");
})


