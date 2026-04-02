import React, { useState, useEffect } from 'react';
import { useLeaves } from '../../hooks/useLeaves';
import LeaveCard from '../../components/common/LeaveCard';

const TeamCalendar = () => {
  const { leaves, fetchLeaves } = useLeaves();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Helper to map mock events
  const getEventsForDay = (day) => {
    return leaves.filter(l => {
      const start = new Date(l.start);
      const end = new Date(l.end);
      const curr = new Date(year, month, day);
      return curr >= start && curr <= end;
    });
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

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
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {dayEvents.map(ev => (
            <div key={`${ev.id}-${day}`} className={`cal-event ${ev.status}`}>
              {ev.employee.split(' ')[0]} - {ev.type}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="page">
      <div className="pg-head">
        <div>
          <div className="pg-title">Team Calendar</div>
          <div className="pg-desc">NIF calendar for team leaves</div>
        </div>
        <div className="pg-actions">
          <button className="btn btn-ghost btn-sm" onClick={prevMonth}>← Prev</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(new Date())}>Today</button>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>Next →</button>
        </div>
      </div>

      <div className="table-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--nepal-blue)', fontFamily: "'Playfair Display', serif" }}>
            {monthNames[month]} {year}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '4px' }}></span>Leave Event</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#dbeafe', borderRadius: '4px', border: '1px solid var(--nepal-blue)' }}></span>Today</span>
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

    </div>
  );
};

export default TeamCalendar;
