import React, { useState, useEffect } from 'react';

const TimeDateDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="time-date-display">
      <div className="time-section">
        <div className="time-label">Current Time</div>
        <div className="time-value">{formatTime(currentTime)}</div>
      </div>
      <div className="date-section">
        <div className="date-label">Today's Date</div>
        <div className="date-value">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

export default TimeDateDisplay;