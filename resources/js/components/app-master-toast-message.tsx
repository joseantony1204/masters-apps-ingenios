import { useEffect, useState } from 'react';

interface ToastMessagesProps {
  success?: string;
  info?: string;
  warning?: string;
  error?: string;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

export default function AppMasterToastMessages({ success, info, warning, error }: ToastMessagesProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  // Agrega nuevos mensajes
  useEffect(() => {
    const newMessages: ToastMessage[] = [];

    if (success) {
      newMessages.push({ id: Date.now(), type: 'success', text: success });
    }

    if (info) {
      newMessages.push({ id: Date.now() + 1, type: 'info', text: info });
    }

    if (warning) {
      newMessages.push({ id: Date.now() + 1, type: 'warning', text: warning });
    }

    if (error) {
      newMessages.push({ id: Date.now() + 1, type: 'error', text: error });
    }

    if (newMessages.length > 0) {
      setMessages((prev) => {
        const existingTexts = new Set(prev.map((m) => m.text));
        const filteredNew = newMessages.filter((m) => !existingTexts.has(m.text));
        return [...prev, ...filteredNew];
      });
    }
  }, [success, info, warning, error]);

  // Auto-remover después de 4s
  useEffect(() => {
    const timers = messages.map((msg) =>
      setTimeout(() => removeMessage(msg.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  // Eliminar mensaje por id
  const removeMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

const getStyles = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#d1e7dd', color: '#0f5132' };
      case 'info':
        return { backgroundColor: '#cff4fc', color: '#055160' };
      case 'warning':
        return { backgroundColor: '#fff3cd', color: '#664d03' };
      case 'error':
      default:
        return { backgroundColor: '#f8d7da', color: '#842029' };
    }
};

  return (
    <div className="toast-container position-fixed top-0 end-0 p-2" style={{ zIndex: 1050 }}>
      {messages.map((msg) => {
        const styles = getStyles(msg.type);
        return (
          <div
            key={msg.id}
            className="toast show mb-2"
            role="alert"
            style={{
              ...styles,
              border: '1px solid transparent',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              minWidth: '250px',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>{msg.text}</div>
              <button
                type="button"
                onClick={() => removeMessage(msg.id)}
                aria-label="Cerrar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: styles.color,
                  fontSize: '1.2rem',
                  marginLeft: '12px',
                  cursor: 'pointer',
                  lineHeight: '1',
                }}
              >
              ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}