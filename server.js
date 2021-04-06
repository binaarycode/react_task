const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const e = require("express");

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
   
    const surnameRegex = /^[a-zA-Z]+$/;
    
    if (customerSurname === "" || customerMobileNumber === "" || bookingPartySize === "" || dateOfBooking ===""){
        return res.send("No null values are allowed");
    }else if(bookingPartySize < 1 || bookingPartySize > 4){
        return res.send("Only a max of 4 people per table");
    } else if (!customerSurname.match(surnameRegex)) {
        return res.send("Numbers can only be used");
    }else if(!customerSurname.match(surnameRegex)){
        return res.send("Surname can only contain letters");
    }else{
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

              
            }
        });

    }
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

    if(customerMobileNumber == ""){
        res.send("Field can't be empty")
    }else if(isNaN(newCustomerMobileNumber)) {
        res.send("Numbers can only be used");
    }else{
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
    }

});

//UPDATE THE PARTY SIZE
app.put('/updatePartySize', (req, res) => {

    const idbookings = req.body.idbookings;
    const bookingPartySize = req.body.bookingPartySize;

    if (newPartySize < 1 || newPartySize > 4) {
        alert("Need to enter a new party size between 1 and 4");
      } else {
        db.query(
            "UPDATE bookings SET  bookingPartySize = ? WHERE idbookings = ?",
            [bookingPartySize,idbookings], 
            (err, result) =>{
                if (err){
                    console.log(err);
                }else{
                    res.status(400).json({status: 400, message:""});
                }
            }
        );
      }
   
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

    const dateOfSearch = req.body.dateOfSearch 
    console.log(dateOfSearch)

    db.query(
        "SELECT SUM(bookingPartySize) FROM restrauntbooking.bookings where dateOfBooking = ?",[dateOfSearch],
        (err, result) =>{
            if(err){
                res.status(400).json({status: 400, message:""});
            }else{
                res.send(result);
                
            }
        }
    )
});




//GET TOTAL NUMBER OF CUSTOMERS FROM TWO DATES

app.get('/periodCustomerTotal/periodStart=:inputedDateOne&periodEnd=:inputedDateTwo', (req,res) =>{

    const inputedDateOne = req.params.inputedDateOne;
    const inputedDateTwo = req.params.inputedDateTwo;

    console.log(inputedDateOne)
    console.log(inputedDateTwo)
    db.query(
        "SELECT dateOfBooking, sum(bookingPartySize) FROM restrauntbooking.bookings where dateOfBooking between ? and ? GROUP BY dateOfBooking ORDER BY dateOfBooking ASC",[inputedDateOne,inputedDateTwo],
        (err, result) =>{
            if(err){
                res.status(400).json({status: 400, message:""});
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
  app.get("/dailyInformation/find=:bookingListForSpecifiedDay", (req,res) =>{

    const bookingListForSpecifiedDay  = req.params.bookingListForSpecifiedDay;
    console.log(bookingListForSpecifiedDay)
   
    db.query(
        "SELECT * FROM restrauntbooking.bookings where dateOfBooking = ?",[bookingListForSpecifiedDay],
        (err, result) =>{
            if(err){
                res.status(400).json({status: 400, message:""});
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


