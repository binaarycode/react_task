import "./App.css";
import { cloneElement, useState } from "react";
import Axios from "axios";
import * as yup from "yup";

import "bootstrap/dist/css/bootstrap.min.css";
import { date } from "yup/lib/locale";
function App() {
  var moment = require("moment"); //Used to change the date format frontend
  var moment2 = require("moment-timezone"); //used to change the time formation

  //Variables used for the Booking form
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState("");
  const [bookingPartySize, setBookingPartySize] = useState(0);
  const [dateOfBooking, setDateOfBooking] = useState(Date());

  //Variables used to update the mobile number and party size
  const [newCustomerMobileNumber, setNewCustomerMobileNumber] = useState("");
  const [newPartySize, setNewPartySize] = useState(0);

  //variable used to get all the bookings in the database
  const [getAllBookings, setGetallBookings] = useState([]);

  //variable used to store the response of the booking - booked or full
  const [bookingMessageResponse, setBookingMessageResponse] = useState("");

  //variables used to get the number of customers from a given date
  const [dateOfSearch, setDateOfSearch] = useState(Date());
  const [collectedNumber, setCollectedNumber] = useState(0);

  //variables used to get booking list for a specified day
  const [bookingListForSpecifiedDay, setBookingListForSpecifiedDay] = useState(
    Date()
  );
  const [collectedNumber2, setCollectedNumber2] = useState([]);

  //Variable used to store the response of the number of customers on a single date
  const [customersOverATimePeriod, setCustomersOverATimePeriod] = useState([]);

  //Variables used to store two dates to check # of customers between the two dates
  const [inputedDateOne, setInputedDateOne] = useState(Date());
  const [inputedDateTwo, setInputedDateTwo] = useState(Date());

  const callList = customersOverATimePeriod.map((name) => {
    return (
      <ul key={"sum(bookingPartySize)"}>
        Date of Booking :{" "}
        {moment(name.dateOfBooking).tz("Europe/London").format("LL")}
        &nbsp;&nbsp; | &nbsp;&nbsp;Total Customers:&nbsp;&nbsp;&nbsp;
        {name["sum(bookingPartySize)"]}
      </ul>
    );
  });

  // Variable to pad the array if less than 5 bookings
  const paddedCollectedNumber2 = collectedNumber2.concat(
    Array(5 - collectedNumber2.length).fill(undefined)
  );

  //inserts null into an array if there is room
  const callList2 = paddedCollectedNumber2.map((name) => {
    if (!name) {
      return <li>Null</li>;
    } else {
      return (
        <li>
          Surname : &nbsp;&nbsp; {name.customerSurname} | &nbsp;&nbsp; Number :{" "}
          {name.customerMobileNumber}
        </li>
      );
    }
  });

  //POST A BOOKING FOR A GIVEN DATE
  const addBooking = () => {
    const surnameRegex = /^[a-zA-Z]+$/;
    if (
      customerSurname.trim() === "" ||
      customerMobileNumber.trim() === "" ||
      bookingPartySize.trim() === "" ||
      dateOfBooking.trim() === ""
    ) {
      alert("No null values are allowed");
    } else if (bookingPartySize < 1 || bookingPartySize > 4) {
      alert("Only a max of 4 people per table");
    } else if (isNaN(customerMobileNumber)) {
      alert("Numbers can only be used");
    } else if (!customerSurname.match(surnameRegex)) {
      alert("Surname can only contain letters");
    } else {
      Axios.post("http://localhost:3001/create", {
        customerSurname: customerSurname,
        customerMobileNumber: customerMobileNumber,
        bookingPartySize: bookingPartySize,
        dateOfBooking: dateOfBooking,
      }).then((response) => {
        setBookingMessageResponse(response.data);

        if (response.data === "No more tables available")
          alert("No more tables available");
        else if (response.data === "Your booking has been completed") {
          alert(
            response.data +
              "\n" +
              "Surname : " +
              customerSurname +
              "\n" +
              "PartySize : " +
              bookingPartySize +
              "\n" +
              "Date : " +
              dateOfBooking
          );
        }
      });
    }
  };
  //GET ALL THE BOOKINGS MADE
  const getBookings = () => {
    Axios.get("http://localhost:3001/bookings").then((response) => {
      setGetallBookings(response.data);
    });
  };

  //UPDATE THE NUMBER OF THE CUSTOMER
  const updateBooking = (idbookings) => {
    if (newCustomerMobileNumber.trim() == "") {
      alert("No null values are allowed");
    } else if (isNaN(newCustomerMobileNumber)) {
      alert("Numbers can only be used");
    } else {
      Axios.put("http://localhost:3001/updateNumber", {
        customerMobileNumber: newCustomerMobileNumber,
        idbookings: idbookings,
      }).then((response) => {
        setGetallBookings(
          getAllBookings.map((val) => {
            return val.idbookings === idbookings
              ? {
                  idbookings: val.idbookings,
                  customerSurname: val.customerSurname,
                  customerMobileNumber: newCustomerMobileNumber,
                  bookingPartySize: val.bookingPartySize,
                  dateOfBooking: val.dateOfBooking,
                }
              : val;
          })
        );
      });
    }
  };

  //UPDATE THE PARTY NUMBER
  const updateParty = (idbookings) => {
    if (newPartySize < 1 || newPartySize > 4) {
      alert("Need to enter a new party size between 1 and");
    } else {
      Axios.put("http://localhost:3001/updatePartySize", {
        bookingPartySize: newPartySize,
        idbookings: idbookings,
      }).then((useEffect) => {});
    }

    console.log(newPartySize);
  };

  //DELETE THE BOOKING
  const deleteBooking = (idbookings) => {
    const result = window.confirm("Are you sure to delete?");

    if (result) {
      Axios.delete(`http://localhost:3001/delete/${idbookings}`).then(
        (response) => {
          setGetallBookings(
            getAllBookings.filter((val) => {
              return val.idbookings !== idbookings;
            })
          );
        }
      );
    }
  };

  //GET THE NUMBER OF CUSTOMERS ON A GIVEN DATE IN THE RESTAURANT
  const getDailyCustomers = () => {
    Axios.post("http://localhost:3001/customerTotal", {
      dateOfSearch: dateOfSearch,
    }).then((response) => {
      setCollectedNumber(response.data);
      alert(
        response.data[0]["SUM(bookingPartySize)"] + " people are booked in"
      );
    });
  };
  //GET THE TOTAL NUMBER OF CUSTOMERS  THAT HAVE VISITED.
  //LIST THEM DATE - TOTAL NUMBER OF CUSTOMERS FOR DATE

  const getMonthlyCustomers = () => {
    Axios.get(
      `http://localhost:3001/periodCustomerTotal/periodStart=${inputedDateOne}&periodEnd=${inputedDateTwo}`
    ).then((response) => {
      setCustomersOverATimePeriod(response.data);
      return (
        <ul>
          {customersOverATimePeriod.map((item) => {
            return <li key={item.idbookings}>{item.idbookings} </li>;
          })}
        </ul>
      );
    });
  };

  //GET A BOOKING LIST FOR A SPECIFIED DAY
  //INCLUDE TABLE LIST AND BOOKINGS
  //IF TABLE IS BOOKED GET CUSTOMER SURNAME + NUMBER
  //IF NULL A NULL VALUE CAN BE RETURNED

  const getdailyBookings = () => {
    Axios.get(
      `http://localhost:3001/dailyInformation/find=${bookingListForSpecifiedDay}`
    ).then((response) => {
      setCollectedNumber2(response.data);
    });
  };

  // APPLICATION
  return (
    <div className="App">
      <div className="container">
        <div className="form">
          <form>
            <h1>Booking Form</h1>
            <label>Customer Surname:</label>

            <input
              type="text"
              name="customerSurname"
              id="customerSurname"
              placeholder="Surname"
              onChange={(event) => {
                setCustomerSurname(event.target.value);
              }}
            />

            <label>Customer Contact Number:</label>
            <input
              type="text"
              name="customerMobileNumber"
              id="customerMobileNumber"
              placeholder="Mobile Number"
              onChange={(event) => {
                setCustomerMobileNumber(event.target.value);
              }}
            />
            <label>Party Size:</label>
            <input
              type="number"
              name="partySize"
              id="partySize"
              placeholder="Size of party"
              min="1"
              max="4"
              onChange={(event) => {
                setBookingPartySize(event.target.value);
              }}
            />
            <label>Date of Booking:</label>
            <input
              type="date"
              name="dateOfBooking"
              id="dateOfBooking"
              onChange={(event) => {
                setDateOfBooking(event.target.value);
              }}
            />

            <button className="cta" onClick={addBooking}>
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="container">
        <div className="searchGivenDate">
          <h4>Check how many are booked on a date</h4>
          <label>Search for a date:</label>
          <input
            type="date"
            onChange={(event) => {
              setDateOfSearch(event.target.value);
            }}
          />
          <button className="cta" onClick={getDailyCustomers}>
            Submit
          </button>
        </div>
      </div>

      <div className="container">
        <div className="twoDateSearch">
          <div className="dateOne">
            <h4>Check how many are booked over a time period</h4>
            <label>Enter date one:</label>
            <input
              type="date"
              onChange={(event) => {
                setInputedDateOne(event.target.value);
              }}
            />
          </div>
          <div className="dateTwo">
            <h4>Check how many are booked over a time period</h4>
            <label>Enter date one:</label>
            <input
              type="date"
              onChange={(event) => {
                setInputedDateTwo(event.target.value);
              }}
            />
            <button className="cta" onClick={getMonthlyCustomers}>
              Submit
            </button>
          </div>

          <div className="App">
            <h2>Booking Dates with total number of customers</h2>
            <ul>{callList}</ul>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="searchGivenDate searchGivenDate2">
          <h4>Get a booking list for specified day</h4>
          <label>Search for a date:</label>
          <input
            type="date"
            onChange={(event) => {
              setBookingListForSpecifiedDay(event.target.value);
            }}
          />
          <button className="cta" onClick={getdailyBookings}>
            Submit
          </button>

          <div className="App">
            <h2>Booking Dates with total number of customers</h2>
            <ul>{callList2}</ul>
          </div>
        </div>
      </div>

      <div className="button">
        <button
          className="cta bookingdataBtn"
          onClick={() => {
            getBookings();
          }}
        >
          Show Bookings
        </button>

        {getAllBookings.map((val, key) => {
          return (
            <div className="bookingData">
              <div className="info">
                <h3>Booking Information</h3>
                <h4>Surname:</h4> {val.customerSurname}
                <h4>Mobile Number:</h4> {val.customerMobileNumber}
                <h4>Party Size:</h4> {val.bookingPartySize}
                <h4>Date of Booking:</h4>
                {moment(val.dateOfBooking).format("MMM Do YYYY")}
              </div>
              <div className="updateInfo">
                <h3>Update</h3>
                <div className="customerTelephone">
                  <label>Customer Tele Number:</label>
                  <input
                    type="text"
                    placeholder="contact number"
                    onChange={(event) => {
                      setNewCustomerMobileNumber(event.target.value);
                    }}
                  />
                  <button
                    className="cta customerTel"
                    onClick={() => {
                      updateBooking(val.idbookings);
                    }}
                  >
                    Update
                  </button>
                </div>

                <div className="partySize">
                  <label>Customer Party Size:</label>
                  <input
                    type="text"
                    placeholder="Size of Party"
                    onChange={(event) => {
                      setNewPartySize(event.target.value);
                    }}
                  />
                  <button
                    className="cta"
                    onClick={() => {
                      updateParty(val.idbookings);
                    }}
                  >
                    Update
                  </button>
                </div>
                <button
                  className="cta deleteBtn"
                  onClick={() => {
                    deleteBooking(val.idbookings);
                  }}
                >
                  Delete Booking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
