import React from 'react';

// Realistic illustrations from Unsplash mapped per event id.
// These are stable URLs with fixed dimensions.
const EVENT_PHOTOS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1529119513315-c7c361862fc7?auto=format&fit=crop&w=800&q=70',
  '2': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=70',
  '3': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70',
  '4': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=70',
  default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=70',
};

interface EventCoverProps {
  eventId?: string | number;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EventCover({ eventId = 'default', height = 140, borderRadius = 12, style, children }: EventCoverProps) {
  const url = EVENT_PHOTOS[String(eventId)] ?? EVENT_PHOTOS.default;
  return (
    <div
      style={{
        height,
        borderRadius,
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function getEventPhotoUrl(eventId: string | number) {
  return EVENT_PHOTOS[String(eventId)] ?? EVENT_PHOTOS.default;
}
