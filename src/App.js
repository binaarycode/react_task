import "./App.css";
import { useState } from "react";
import Axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  var moment = require("moment"); // require
  var moment2 = require("moment-timezone");

  const [customerSurname, setCustomerSurname] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState("");
  const [bookingPartySize, setBookingPartySize] = useState(0);
  const [dateOfBooking, setDateOfBooking] = useState(Date());

  const [newNumber, setNewNumber] = useState("");
  const [newPartySize, setNewPartySize] = useState(0);

  const [bookingList, setBookingList] = useState([]);

  const [message, setNewMessage] = useState("");

  const [dateOfQuestion, setDateOfQuestion] = useState(Date());
  const [dateOfQuestion2, setDateOfQuestion2] = useState(Date());

  const [collectedNumber, setCollectedNumber] = useState(0);
  const [collectedNumber2, setCollectedNumber2] = useState([]);

  const [timePeriod, setTimePeriod] = useState([]);

  const [dateOne, setDateOne] = useState(Date());
  const [dateTwo, setDateTwo] = useState(Date());

  const callList = timePeriod.map((name) => {
    return (
      <ul key={"sum(bookingPartySize)"}>
        Date of Booking :{" "}
        {moment(name.dateOfBooking).tz("Europe/London").format("LL")}
        &nbsp;&nbsp; | &nbsp;&nbsp;Total Customers:&nbsp;&nbsp;&nbsp;
        {name["sum(bookingPartySize)"]}
      </ul>
    );
  });

  const callList2 = collectedNumber2.map((name) => {
    // copies the original length over
    const len = collectedNumber2.length;

    // expands capacity up to 5
    collectedNumber2.length = 5;

    collectedNumber2.fill(undefined, len, 5);

    if (!name) {
      return <li>Null</li>;
    } else {
      console.log(collectedNumber.length);
      return <li>Booking</li>;
    }
  });

  //POST A BOOKING FOR A GIVEN DATE
  const addBooking = () => {
    Axios.post("http://localhost:3001/create", {
      customerSurname: customerSurname,
      customerMobileNumber: customerMobileNumber,
      bookingPartySize: bookingPartySize,
      dateOfBooking: dateOfBooking,
    }).then((response) => {
      setNewMessage(response.data);

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
  };
  //GET ALL THE BOOKINGS MADE
  const getBookings = () => {
    Axios.get("http://localhost:3001/bookings").then((response) => {
      setBookingList(response.data);
    });
  };

  //UPDATE THE NUMBER OF THE CUSTOMER
  const updateBooking = (idbookings) => {
    Axios.put("http://localhost:3001/updateNumber", {
      customerMobileNumber: newNumber,
      idbookings: idbookings,
    }).then((response) => {
      setBookingList(
        bookingList.map((val) => {
          return val.idbookings === idbookings
            ? {
                idbookings: val.idbookings,
                customerSurname: val.customerSurname,
                customerMobileNumber: newNumber,
                bookingPartySize: val.bookingPartySize,
                dateOfBooking: val.dateOfBooking,
              }
            : val;
        })
      );
    });
  };

  //UPDATE THE PARTY NUMBER
  const updateParty = (idbookings) => {
    Axios.put("http://localhost:3001/updatePartySize", {
      bookingPartySize: newPartySize,
      idbookings: idbookings,
    }).then((useEffect) => {});
  };

  //DELETE THE BOOKING
  const deleteBooking = (idbookings) => {
    Axios.delete(`http://localhost:3001/delete/${idbookings}`).then(
      (response) => {
        setBookingList(
          bookingList.filter((val) => {
            return val.idbookings !== idbookings;
          })
        );
      }
    );
  };

  //GET THE NUMBER OF CUSTOMERS ON A
  const getDailyCustomers = () => {
    Axios.post("http://localhost:3001/customerTotal", {
      dateOfQuestion: dateOfQuestion,
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
      `http://localhost:3001/periodCustomerTotal/periodStart=${dateOne}&periodEnd=${dateTwo}`
    ).then((response) => {
      setTimePeriod(response.data);

      return (
        <ul>
          {timePeriod.map((item) => {
            return <li>{item.idbookings} </li>;
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
      `http://localhost:3001/dailyInformation/find=${dateOfQuestion2}`
    ).then((response) => {
      setCollectedNumber2(response.data);

      // return (
      //   <ul>
      //     {collectedNumber2.map((item) => {
      //       return <li>{item.idbookings}</li>;
      //     })}
      //   </ul>
      // );
    });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="information">
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
        </div>
      </div>

      {/* <div className="container">
        <div className="searchGivenDate">
          <h4>Check how many are booked on a date</h4>
          <label>Search for a date:</label>
          <input
            type="date"
            onChange={(event) => {
              setDateOfQuestion(event.target.value);
            }}
          />
          <button className="cta" onClick={getDailyCustomers}>
            Submit
          </button>
        </div>
      </div> */}

      <div className="container">
        <div className="twoDateSearch">
          <div className="dateOne">
            <h4>Check how many are booked over a time period</h4>
            <label>Enter date one:</label>
            <input
              type="date"
              onChange={(event) => {
                setDateOne(event.target.value);
              }}
            />
          </div>
          <div className="dateTwo">
            <h4>Check how many are booked over a time period</h4>
            <label>Enter date one:</label>
            <input
              type="date"
              onChange={(event) => {
                setDateTwo(event.target.value);
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
              setDateOfQuestion2(event.target.value);
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
          className="cta"
          onClick={() => {
            getBookings();
          }}
        >
          Show Bookings
        </button>

        {bookingList.map((val, key) => {
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
                      setNewNumber(event.target.value);
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
