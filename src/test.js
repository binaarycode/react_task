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
          className="cta"
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