'use client'

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios';

const MyCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
        .then(response => {
            setEvents(response.data);
        });
    }, []);

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
}

export default MyCalendar
