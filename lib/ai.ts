import { supabase } from "./supabase";
import { Appointments } from "@/types/appointments";

const OPENROUTER_API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  (() => {
    throw new Error("OpenRouter key missing");
  });

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function getAIResponse(messages: Message[]): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function simulateCall(
  appointment: Appointments
): Promise<{ action: string; updates?: Partial<Appointments> }> {
  const systemPrompt = `You are a polite call center assistant confirming an appointment. Respond naturally and briefly. Ask to confirm, reschedule, or cancel. Based on user response: If they say confirm or yes, respond with exactly "CONFIRMED". If they say cancel or no, respond with exactly "CANCELLED". If they want to reschedule, extract new date/time and respond with exactly "RESCHEDULED to YYYY-MM-DD at HH:MM". Do not add extra text. End conversation after action.`;

  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    {
      role: "assistant",
      content: `Hello, calling to confirm your appointment for ${appointment.title} on ${appointment.date} at ${appointment.start_time}. Confirm, reschedule, or cancel?`,
    },
  ];

  // For testing, simulate user response (in real use, this would be from UI input)
  const userResponse = "Confirm"; // Placeholder
  messages.push({ role: "user", content: userResponse });

  const aiReply = await getAIResponse(messages);

  if (aiReply.includes("CONFIRMED")) {
    return { action: "confirm" };
  } else if (aiReply.includes("CANCELLED")) {
    return { action: "cancel" };
  } else if (aiReply.includes("RESCHEDULED")) {
    // Parse new date/time (simple regex)
    const match = aiReply.match(
      /RESCHEDULED to (\d{4}-\d{2}-\d{2}) at (\d{2}:\d{2})/
    );
    if (match) {
      return {
        action: "reschedule",
        updates: { date: match[1], start_time: match[2] },
      };
    }
  }

  return { action: "none" };
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointments>
) {
  const { error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
