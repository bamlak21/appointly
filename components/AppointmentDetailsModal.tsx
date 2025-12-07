"use client";

import { X, Calendar, Clock, Phone, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Appointments } from "@/types/appointments";
import { formatTime } from "@/lib/utils";

interface AppointmentDetailsModalProps {
  appointment: Appointments;
  onClose: () => void;
}

export default function AppointmentDetailsModal({ appointment, onClose }: AppointmentDetailsModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-amber-400 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Appointment Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: appointment.color }}
            ></div>
            <h3 className="text-xl font-bold text-gray-800">{appointment.title}</h3>
          </div>

          {/* Date and Time */}
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar size={18} />
            <span>{appointment.date}</span>
            <Clock size={18} />
            <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            {getStatusIcon(appointment.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>

          {/* Phone */}
          {appointment.phone_number && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone size={18} />
              <span>{appointment.phone_number}</span>
            </div>
          )}

          {/* Description */}
          {appointment.description && (
            <div className="flex items-start space-x-3 text-gray-600">
              <FileText size={18} className="mt-1" />
              <p className="text-sm">{appointment.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-amber-400 text-white font-semibold py-2 rounded-lg hover:bg-amber-500 transition"
          >
            Close
          </button>
        </div>
    </div>
  );
}