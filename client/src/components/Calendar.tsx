'use client'

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
    });

    useEffect(() => {
        axiosInstance.get('/api/events')
        .then(response => {
            setEvents(response.data);
        });
    }, []);

    // イベント追加
    const handleDateClick = (clickInfo) => {
        const title = prompt('予定のタイトルを入力してください:');
        if (title) {
            const newEvent = {
                title: title,
                start: clickInfo.dateStr,
                end: clickInfo.dateStr,
                allDay: true,
            };

            axiosInstance.post('/api/events', newEvent)
                .then(() => {
                    axiosInstance.get('/api/events')
                        .then(response => {
                            setEvents(response.data);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    // イベント修正
    const handleEventClick = (clickInfo) => {
        const newTitle = prompt('新しいイベントのタイトルを入力してください:', clickInfo.event.title);

        if (newTitle) {
            const eventId = clickInfo.event.id;
            const updatedEvent = {
                title: newTitle,
                start: clickInfo.event.startStr,
                end: clickInfo.event.endStr || clickInfo.event.startStr,
                allDay: clickInfo.event.allDay,
            };

            axiosInstance.patch(`/api/events/${eventId}`, updatedEvent)
                .then(() => {
                    clickInfo.event.setProp('title', newTitle);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                locale="ja"
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
            />
        </>
    );
}

export default MyCalendar
