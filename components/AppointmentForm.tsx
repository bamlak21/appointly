"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Appointments } from "@/types/appointments";

type Props = {
  onAdd: (appointment: Appointments) => void;
  // onClose: () => void;
  initialDate?: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AddAppointmentForm = ({
  onAdd,
  // onClose,
  initialDate,
  setModalOpen,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!date) newErrors.date = "Date is required.";
    else if (new Date(date) < new Date()) newErrors.date = "Date must be in the future.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (phoneNumber && !/^\+?\d{10,15}$/.test(phoneNumber)) newErrors.phoneNumber = "Invalid phone number.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          title,
          description,
          date,
          start_time: startTime,
          end_time: endTime,
          phone_number: phoneNumber,
          color,
        },
      ])
      .select()
      .single();

    if (error) return console.error(error);
    if (data) {
      onAdd(data);
      // reset form
      setTitle("");
      setDescription("");
      setDate(initialDate || "");
      setStartTime("");
      setEndTime("");
      setPhoneNumber("");
      setColor("#4F46E5");
    }
  };

  return (
    <div className="w-full max-w-sm md:max-w-md lg:w-[700px] rounded-xl shadow-2xl overflow-hidden relative flex flex-col">
      {/* Header */}
      <div className="bg-amber-400 text-white p-4">
        <h2 className="text-2xl font-bold">Add Appointment</h2>
        {/* Close button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="bg-white p-8 flex flex-col gap-6">
        <div className="flex gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
           <input
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             required
             placeholder="Meeting with client"
             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
           />
           {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
           <input
             type="date"
             value={date}
             onChange={(e) => setDate(e.target.value)}
             required
             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
           />
           {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
           <input
             type="time"
             value={startTime}
             onChange={(e) => setStartTime(e.target.value)}
             required
             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
           />
           {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
           <input
             type="time"
             value={endTime}
             onChange={(e) => setEndTime(e.target.value)}
             required
             className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
           />
           {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
        </div>

        <div className="flex-1 flex flex-col items-start">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-14 h-14 border-none rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes about the appointment"
          className="p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          rows={3}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g., +1 234 567 8900"
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
      </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-2 bg-amber-400 text-white font-semibold py-3 rounded-lg hover:bg-amber-500 transition shadow-md"
        >
          Add Appointment
        </button>
      </div>
    </div>
  );
};

export default AddAppointmentForm;
