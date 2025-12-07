import { Calendar as Rbc, dateFnsLocalizer, Event, NavigateAction, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Appointments } from "@/types/appointments";
import { Dispatch, SetStateAction } from "react";

interface CustomEvent extends Event {
  id: string;
}

const locales = { "en-us": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = ({ label, onNavigate, onView }: { label: string; onNavigate: (action: NavigateAction) => void; onView: (view: View) => void }) => (
  <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-md">
    {/* Left: Today / Prev / Next */}
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow"
        onClick={() => onNavigate("TODAY")}
      >
        Today
      </button>
      <button
        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        onClick={() => onNavigate("PREV")}
      >
        ‹ Prev
      </button>
      <button
        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        onClick={() => onNavigate("NEXT")}
      >
        Next ›
      </button>
    </div>

    {/* Center: Current Month/Year */}
    <h2 className="text-2xl font-bold text-gray-800">{label}</h2>

    {/* Right: Month / Week / Day */}
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        onClick={() => onView("month")}
      >
        Month
      </button>
      <button
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        onClick={() => onView("week")}
      >
        Week
      </button>
      <button
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        onClick={() => onView("day")}
      >
        Day
      </button>
    </div>
  </div>
);

type Prop = {
  appointments: Appointments[];
  setSelectedDate: Dispatch<SetStateAction<string | null>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSelectAppointment?: (appointment: Appointments) => void;
};

const Calendar = ({ appointments, setSelectedDate, setModalOpen, onSelectAppointment }: Prop) => {
  const events: CustomEvent[] = appointments.map((a) => ({
    id: a.id,
    title: a.title,
    start: new Date(`${a.date}T${a.start_time}`),
    end: new Date(`${a.date}T${a.end_time}`),
    resource: a,
  }));

  const handleSelectEvent = (event: CustomEvent) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment && onSelectAppointment) {
      onSelectAppointment(appointment);
    }
  };

  return (
    <div className="flex-2 mt-3 p-4 overflow-auto max-w-full">
      <Rbc
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="h-64 md:h-80 lg:h-screen"
        components={{ toolbar: CustomToolbar }}
        onSelectSlot={(slotInfo) => {
          const date = slotInfo.start;
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
          const dd = String(date.getDate()).padStart(2, "0");

          setSelectedDate(`${yyyy}-${mm}-${dd}`);
          setModalOpen(true);
        }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.resource.color,
            color: "#fff",
            borderRadius: "8px",
            padding: "2px 5px",
          },
        })}
      />
    </div>
  );
};

export default Calendar;
