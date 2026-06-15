const STORAGE_KEY = "appointments_extra";

export function getExtraData() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.error("Failed to read appointment extra data:", error);
    return {};
  }
}

export function saveExtraData(appointmentId, preferredTime, notes) {
  if (typeof window === "undefined" || !appointmentId) {
    return;
  }

  const currentData = getExtraData();

  currentData[String(appointmentId)] = {
    preferred_time: preferredTime || "",
    notes: notes || "",
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  window.dispatchEvent(new Event("appointment-extra-updated"));
}

export function removeExtraData(appointmentId) {
  if (typeof window === "undefined" || !appointmentId) {
    return;
  }

  const currentData = getExtraData();
  delete currentData[String(appointmentId)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  window.dispatchEvent(new Event("appointment-extra-updated"));
}

export function mergeAppointmentsWithExtraData(appointments) {
  const extraData = getExtraData();

  return appointments.map((appointment) => {
    const appointmentId = String(appointment.appointment_id);
    const extra = extraData[appointmentId] || {};

    return {
      ...appointment,
      preferred_time:
        extra.preferred_time || appointment.preferred_time || appointment.appointment_time || "",
      notes: extra.notes || appointment.notes || "",
    };
  });
}
