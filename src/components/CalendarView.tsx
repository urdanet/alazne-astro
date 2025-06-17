import { useEffect, useRef } from 'preact/hooks';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';


export default function Calendar() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    // Inicializa FullCalendar
    const calendar = new FullCalendar(calendarRef.current, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      events: [
        // Ejemplo de eventos hardcodeados
        { title: 'Cita 1', start: '2025-06-16T10:00:00' },
        { title: 'Cita 2', start: '2025-06-17T14:00:00' }
      ]
    });

    calendar.render();

    // Cleanup al desmontar
    return () => calendar.destroy();
  }, []);

  return <div ref={calendarRef} />;
}
