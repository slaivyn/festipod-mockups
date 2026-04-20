import { useEffect, useState, useCallback } from 'react';

type ToastVariant = 'success' | 'info' | 'error';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

type Listener = (toasts: ToastItem[]) => void;

let items: ToastItem[] = [];
let nextId = 1;
const listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach(l => l(items));
}

export function showToast(message: string, variant: ToastVariant = 'success') {
  const id = nextId++;
  items = [...items, { id, message, variant }];
  emit();
  setTimeout(() => {
    items = items.filter(t => t.id !== id);
    emit();
  }, 2600);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>(items);

  useEffect(() => {
    const listener: Listener = (next) => setToasts([...next]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const dismiss = useCallback((id: number) => {
    items = items.filter(t => t.id !== id);
    emit();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 78,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          style={{
            pointerEvents: 'auto',
            background: t.variant === 'error' ? '#7B2A1E' : t.variant === 'info' ? '#1F3A5F' : '#22543D',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            maxWidth: '80%',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            fontFamily: 'var(--font-app)',
            cursor: 'pointer',
            animation: 'toast-slide-up 0.25s ease',
          }}
        >
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes toast-slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
