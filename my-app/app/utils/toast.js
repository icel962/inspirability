export function showToast(message, type = "info", title = null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("show-toast", { detail: { message, type, title } })
  );
}
