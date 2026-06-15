export function showConfirm(message, onConfirm) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("show-confirm", { detail: { message, onConfirm } })
  );
}
