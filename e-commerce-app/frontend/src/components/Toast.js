import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`af-toast ${type}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", color: "inherit", marginLeft: 12, cursor: "pointer", fontSize: "1rem" }}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
