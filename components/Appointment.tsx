"use client";

import { Phone, Plus } from "lucide-react";
import { Appointments } from "@/types/appointments";
import { formatTime } from "@/lib/utils";

type Prop = {
  appointments: Appointments[];
  setModalOpen: (open: boolean) => void;
  setCallAppointment: (a: Appointments) => void;
  setDetailsAppointment: (a: Appointments) => void;
};

const Appointment = ({ appointments, setModalOpen, setCallAppointment, setDetailsAppointment }: Prop) => {

  return (
    <div className="flex flex-col flex-1 mt-3 p-4.5 ">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Upcoming Appointments</h2>
            <p className="text-sm text-gray-500">
              Don&apos;t miss scheduled appointments
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-md transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <section className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2 mt-3">
        {appointments?.map((a) => {
          return (
            <div key={a.id} className="bg-white p-5 mt-3 rounded-2xl cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200 border border-gray-200" onClick={() => setDetailsAppointment(a)}>
              <div className="flex items-center px-1.5 mb-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full mr-2"
                  style={{ backgroundColor: a.color }}
                ></span>
                <p>
                  {formatTime(a.start_time)} - {formatTime(a.end_time)}
                </p>
                <span
                  className={`text-xs px-2 py-1 mx-3 rounded ${
                    a.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : a.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {a.status}
                </span>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     setCallAppointment(a);
                   }}
                   className="ml-auto text-green-500 hover:text-green-700"
                 >
                   <Phone size={16} />
                 </button>
              </div>
              <div className="px-1.5">
                <h3 className="font-semibold">{a.title}</h3>
                <h5 className="text-gray-600">{a.description}</h5>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Appointment;
