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
      hour12: true
    });
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="time-date-display">
      <div className="time-display">
        <span className="time-icon">🕒</span>
        <span className="time-text">{formatTime(currentTime)}</span>
      </div>
      <div className="date-display">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default TimeDateDisplay;