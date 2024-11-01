// DateFormat.js
import React from 'react';

function DateFormat({ date }) {
  if (!date) {
    return null; // Handle case when date is not provided or invalid
  }

  const formattedDate = new Date(date).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(",", "");

  return <span>{formattedDate}</span>;
}

export default DateFormat;
