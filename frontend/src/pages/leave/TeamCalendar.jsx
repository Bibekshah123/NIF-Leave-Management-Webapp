import React, { useState, useEffect } from 'react';
import { useLeaves } from '../../hooks/useLeaves';
import LeaveCard from '../../components/common/LeaveCard';

const TeamCalendar = () => {
  const { leaves, fetchLeaves } = useLeaves();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Helper to map events
  const getEventsForDay = (day) => {
    return leaves.filter(l => {
      const start = new Date(l.start);
      const end = new Date(l.end);
      const curr = new Date(year, month, day);
      return curr >= start && curr <= end;
    });
  };

  const handleMonthChange = (e) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  // Generate blank spaces before first day
  const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`blank-${i}`} className="cal-day empty"></div>
  ));

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const dayEvents = getEventsForDay(day);

    return (
      <div key={`day-${day}`} className={`cal-day ${isToday ? 'today' : ''}`}>
        <span className="cal-date">{day}</span>
        <div className="cal-events">
          {dayEvents.slice(0, 3).map(ev => (
            <div key={`${ev.id}-${day}`} className={`cal-event ${ev.status}`} onClick={() => setSelectedEvent(ev)}>
              {ev.employee.split(' ')[0]} - {ev.type}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="cal-more">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">Team Calendar</div>
          <div className="pg-desc">View team leave schedules and plan accordingly</div>
        </div>
        <div className="pg-actions">
          <select value={month} onChange={handleMonthChange} className="btn btn-ghost btn-sm">
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            className="btn btn-ghost btn-sm"
            style={{ width: '80px' }}
            min="2020"
            max="2030"
          />
          <button className="btn btn-ghost btn-sm" onClick={goToToday}>Today</button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-title">
            {monthNames[month]} {year}
          </div>
          <div className="calendar-legend">
            <span className="legend-item">
              <span className="legend-color pending"></span> Pending
            </span>
            <span className="legend-item">
              <span className="legend-color approved"></span> Approved
            </span>
            <span className="legend-item">
              <span className="legend-color today"></span> Today
            </span>
          </div>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(h => (
            <div key={h} className="cal-day header">{h}</div>
          ))}
          {blanks}
          {days}
        </div>
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Details</h3>
            <LeaveCard leave={selectedEvent} />
            <button className="btn btn-primary" onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
