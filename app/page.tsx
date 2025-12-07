"use client";

import Appointment from "@/components/Appointment";
import Calendar from "@/components/Calendar";
import AppointmentForm from "@/components/AppointmentForm";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { Appointments } from "@/types/appointments";
import { useEffect, useState } from "react";

import CallModal from "@/components/CallModal";
import Modal from "@/components/Modal";
import AppointmentDetailsModal from "@/components/AppointmentDetailsModal";

export default function Home() {
  const [appointments, setAppointment] = useState<Appointments[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [callAppointment, setCallAppointment] = useState<Appointments | null>(null);
  const [detailsAppointment, setDetailsAppointment] = useState<Appointments | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("appointments").select("*");

      if (error) {
        console.error(error);
        setError("Failed to load appointments. Please try again.");
      } else {
        setAppointment(data || []);
        setError(null);
      }
    };

    fetchData();
  }, []);

  const retryFetch = () => {
    setError(null);
    // Re-run the effect by triggering a re-mount or manual fetch
    const fetchData = async () => {
      const { data, error } = await supabase.from("appointments").select("*");

      if (error) {
        console.error(error);
        setError("Failed to load appointments. Please try again.");
      } else {
        setAppointment(data || []);
        setError(null);
      }
    };

    fetchData();
  };


  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Navbar />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={retryFetch} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Retry
            </button>
          </div>
        )}
        <div className="flex flex-col lg:flex-row">
          <Appointment
            setModalOpen={setModalOpen}
            setCallAppointment={setCallAppointment}
            setDetailsAppointment={setDetailsAppointment}
            appointments={appointments || []}
          />
          <Calendar
            appointments={appointments || []}
            setSelectedDate={setSelectedDate}
            setModalOpen={setModalOpen}
            onSelectAppointment={setDetailsAppointment}
          />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <AppointmentForm
          setModalOpen={setModalOpen}
          initialDate={selectedDate || ""}
          onAdd={(newAppointment) => {
            setAppointment((prev) => [...prev, newAppointment]);
            setModalOpen(false);
          }}
        />
      </Modal>



      {callAppointment && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          <CallModal
            appointment={callAppointment}
            onClose={() => setCallAppointment(null)}
            onUpdate={(updated) => {
              setAppointment((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
              );
              setCallAppointment(null);
            }}
          />
        </>
      )}

      <Modal isOpen={!!detailsAppointment} onClose={() => setDetailsAppointment(null)}>
        {detailsAppointment && (
          <AppointmentDetailsModal
            appointment={detailsAppointment}
            onClose={() => setDetailsAppointment(null)}
          />
        )}
      </Modal>
    </>
  );
}
