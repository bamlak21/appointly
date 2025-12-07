"use client";

import { useState } from "react";
import { updateAppointment } from "@/lib/ai";
import { Appointments } from "@/types/appointments";
import { PhoneOff, Phone } from "lucide-react";
import { formatTime } from "@/lib/utils";
interface CallModalProps {
  appointment: Appointments;
  onClose: () => void;
  onUpdate: (updated: Appointments) => void;
}

export default function CallModal({
  appointment,
  onClose,
  onUpdate,
}: CallModalProps) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi, confirming your appointment: ${appointment.title} on ${appointment.date} at ${formatTime(appointment.start_time)}. Reply 'confirm', 'cancel', or 'reschedule' (then select date/time below).` },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showRescheduleInputs, setShowRescheduleInputs] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDate || !rescheduleTime) return;

    setLoading(true);
    try {
      await updateAppointment(appointment.id, { date: rescheduleDate, start_time: rescheduleTime });
      onUpdate({ ...appointment, date: rescheduleDate, start_time: rescheduleTime });
      setMessages([...messages, { role: "assistant", content: `Appointment rescheduled to ${rescheduleDate} at ${formatTime(rescheduleTime)}. Thank you!` }]);
      setShowRescheduleInputs(false);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (error) {
      setMessages([...messages, { role: "assistant", content: `Error: ${(error as Error).message}` }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      // Parse user input for intent
      const input = userInput.toLowerCase();
      let action = "none";
      let updates: Partial<Appointments> | undefined;

      if (input.includes("confirm") || input.includes("yes")) {
        action = "confirm";
      } else if (input.includes("cancel") || input.includes("no")) {
        action = "cancel";
      } else if (input.includes("reschedule") || input.includes("change")) {
        // Simple parsing for reschedule, e.g., "reschedule to 2025-12-09 at 11:00"
        const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/);
        const timeMatch = input.match(/(\d{2}:\d{2})/);
        if (dateMatch && timeMatch) {
          action = "reschedule";
          updates = { date: dateMatch[1], start_time: timeMatch[1] };
        } else {
          // Show inputs for user to select
          setShowRescheduleInputs(true);
          setMessages([...newMessages, { role: "assistant", content: "Please select a new date and time below." }]);
          setLoading(false);
          return;
        }
      }

      let aiResponse = "Thank you for your response.";
      if (action === "confirm") {
        aiResponse = "Appointment confirmed. Thank you!";
        await updateAppointment(appointment.id, { status: "confirmed" });
        onUpdate({ ...appointment, status: "confirmed" });
      } else if (action === "cancel") {
        aiResponse = "Appointment cancelled. Thank you!";
        await updateAppointment(appointment.id, { status: "cancelled" });
        onUpdate({ ...appointment, status: "cancelled" });
      } else if (action === "reschedule" && updates) {
        aiResponse = `Appointment rescheduled to ${updates.date} at ${updates.start_time}. Thank you!`;
        await updateAppointment(appointment.id, updates);
        onUpdate({ ...appointment, ...updates });
      } else {
        aiResponse = "Sorry, I didn't understand. Please reply 'confirm', 'cancel', or 'reschedule to [date] at [time]'.";
      }

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `Error: ${(error as Error).message}` },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setClosing(true)}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md h-[70vh] md:h-[80vh] flex flex-col will-change-transform will-change-opacity ${
        closing ? "animate-modal-close" : "animate-modal-open"
      }`} onClick={(e) => e.stopPropagation()} onAnimationEnd={() => {
        if (closing) {
          onClose();
        }
      }}>
        {/* Header */}
        <div className="bg-amber-400 text-white p-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center"><Phone size={20} className="mr-2" /> Mock Call</h2>
          <p className="text-sm opacity-90">{appointment.title} - {appointment.date} at {formatTime(appointment.start_time)}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.role === "assistant"
                    ? "bg-gray-100 text-gray-800 rounded-bl-none"
                    : "bg-blue-500 text-white rounded-br-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reschedule Inputs */}
        {showRescheduleInputs && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2 mb-2">
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                onClick={handleRescheduleSubmit}
                disabled={loading || !rescheduleDate || !rescheduleTime}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
              >
                Reschedule
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your response..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !userInput.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-colors"
            >
              ➤
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setClosing(true)}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              <PhoneOff size={16} />
              <span>End Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
