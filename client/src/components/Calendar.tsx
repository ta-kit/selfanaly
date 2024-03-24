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
    const [eventTitle, setEventTitle] = useState('');
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);

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

    // イベント追加ダイアログの表示
    const handleDateClick = (clickInfo) => {
        setStartDate(new Date(clickInfo.dateStr));
        setEndDate(new Date(clickInfo.dateStr));
        setIsAddingEvent(true);
    };

    // 日時データをバックエンドが受け入れる形式に変換する関数
    function formatDateTimeForBackend(date) {
        return new Intl.DateTimeFormat('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date(date));
    }

    // イベント追加処理
    const addEvent = () => {
        if (eventTitle) {
            const startFormatted = formatDateTimeForBackend(startDate);
            const endFormatted = formatDateTimeForBackend(endDate);
            const newEvent = {
                title: eventTitle,
                start: startFormatted,
                end: endFormatted,
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
            setIsAddingEvent(false);
            setEventTitle('');
        }
    };

    // イベント修正処理
    const handleEventClick = (clickInfo) => {
        setIsEditingEvent(true);
        setCurrentEventId(clickInfo.event.id);
        setEventTitle(clickInfo.event.title);
        setStartDate(new Date(clickInfo.event.start));
        setEndDate(new Date(clickInfo.event.end || clickInfo.event.start));
    };

    // イベント修正
    const saveEventEdits = () => {
        if (eventTitle && startDate && endDate && currentEventId) {
            const startFormatted = formatDateTimeForBackend(startDate);
            const endFormatted= formatDateTimeForBackend(endDate);
            const updatedEvent = {
                title: eventTitle,
                start: startFormatted,
                end: endFormatted,
                allDay: true,
            };

            axiosInstance.patch(`/api/events/${currentEventId}`, updatedEvent)
                .then(() => {
                    fetchEvents();
                    closeEditModal();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    // イベントリストを更新する関数
    function fetchEvents() {
        axiosInstance.get('/api/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => console.error(error));
    }

    // 編集モーダルを閉じて状態をリセットする関数
    function closeEditModal() {
        setIsEditingEvent(false);
        setEventTitle('');
        setStartDate(new Date());
        setEndDate(new Date());
        setCurrentEventId(null);
    }

    return (
        <>
            {isAddingEvent && (
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="予定のタイトル"
                        value={eventTitle}
                        onChange={e => setEventTitle(e.target.value)}
                    />
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <button onClick={addEvent}>イベント追加</button>
                </div>
            )}
            {isEditingEvent && (
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="予定のタイトル"
                        value={eventTitle}
                        onChange={e => setEventTitle(e.target.value)}
                    />
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <button onClick={saveEventEdits}>イベントを保存</button>
                    <button onClick={closeEditModal}>キャンセル</button>
                </div>
            )}
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
