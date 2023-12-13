// App.js

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isDayBooked = (date) => {
    return bookedSlots.some(
      (slot) => slot.date.toDateString() === date.toDateString()
    );
  };

  const isSlotBooked = (hour) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour);

    return bookedSlots.some(
      (slot) =>
        slot.date.toISOString() === selectedDateTime.toISOString() && slot.hour === hour
    );
  };

  const canBookSlot = (hour) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour);

    // Check if the selected time has already passed
    return selectedDateTime > new Date();
  };

  const calculateBookedPercentage = (date) => {
    const totalSlots = 9; // Number of available slots in a day
    const bookedSlotsCount = bookedSlots.filter(
      (slot) => slot.date.toDateString() === date.toDateString()
    ).length;

    if (bookedSlotsCount === totalSlots) {
      return 'full'; // Whole day is booked
    } else if (bookedSlotsCount > 0) {
      return 'half'; // At least one hour is booked
    }

    return 'empty'; // No slots are booked
  };

  const handleBookSlot = (hour) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour);

    if (!isSlotBooked(hour) && canBookSlot(hour)) {
      setBookedSlots([...bookedSlots, { date: selectedDateTime, hour }]);
      toast.success(`Slot booked for ${hour}:00 - ${hour + 1}:00 on ${selectedDateTime.toDateString()}`);
    } else if (isSlotBooked(hour)) {
      toast.error(`Slot is already booked for ${hour}:00 on ${selectedDateTime.toDateString()}`);
    } else {
      toast.error(`Cannot book a time that has passed.`);
    }
  };

  const handleCancelBooking = (hour) => {
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour);

    const updatedBookedSlots = bookedSlots.filter(
      (slot) =>
        !(slot.date.toISOString() === selectedDateTime.toISOString() && slot.hour === hour)
    );

    setBookedSlots(updatedBookedSlots);
    toast.info(`Booking canceled for ${hour}:00 - ${hour + 1}:00 on ${selectedDateTime.toDateString()}`);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const bookingStatus = calculateBookedPercentage(date);
      if (bookingStatus === 'half') {
        return <div className="calendar-day-highlight yellow-bg"></div>;
      } else if (bookingStatus === 'full') {
        return <div className="calendar-day-highlight red-bg"></div>;
      }
    }
    return null;
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Time Booking Calendar</h1>
        {isLoggedIn ? (
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        ) : (
          <div className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              onClick={() => setLoggedIn(true)}
              className={isDayBooked(selectedDate) ? 'booked-day' : ''}
            >
              {isDayBooked(selectedDate) ? 'Booked' : 'Login'}
            </button>
          </div>
        )}
      </header>
      {isLoggedIn && (
        <>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={renderTileContent}
            />
          </div>
          <div className="time-slots-container">
            <p>Selected Date: {selectedDate.toDateString()}</p>
            <h2>Time Slots</h2>
            <ul>
              {[15, 16, 17, 18, 19, 20, 21, 22, 23].map((hour) => (
                <li
                  key={hour}
                  className={isSlotBooked(hour) ? 'booked-slot' : ''}
                >
                  {hour}:00 - {hour + 1}:00
                  {isSlotBooked(hour) ? (
                    <>
                      <button
                        onClick={() => handleCancelBooking(hour)}
                        className="cancel-booking-button"
                      >
                        Cancel Booking
                      </button>
                      <span className="booked-text">(Booked)</span>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBookSlot(hour)}
                      className="book-slot-button"
                      disabled={!canBookSlot(hour)}
                    >
                      {canBookSlot(hour) ? 'Book Slot' : 'Time Passed'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;