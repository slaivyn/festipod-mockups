import React from "react";
import {
  Button,
  Title,
  Text,
  Card,
  NavBar,
  Badge,
} from "../../../shared/components/sketchy";
import { useFestipodData } from "../../../shared/context/FestipodDataContext";
import type { ScreenProps } from "../../../screens";

function EventCard({
  title,
  date,
  location,
  distance,
  attendees,
  onClick,
}: {
  title: string;
  date: string;
  location: string;
  distance: number;
  attendees: number;
  onClick: () => void;
}) {
  return (
    <Card onClick={onClick} style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <Text
            className="user-content"
            style={{ margin: 0, fontWeight: "bold" }}
          >
            {title}
          </Text>
          <Text
            className="user-content"
            style={{ margin: "4px 0 0 0", fontSize: 14 }}
          >
            {date}
          </Text>
          <Text style={{ margin: "2px 0 0 0", fontSize: 14 }}>
            📍 <span className="user-content">{location}</span>
            {distance != null && (
              <span style={{ color: "var(--sketch-gray)" }}>
                {" "}
                · {distance} km
              </span>
            )}
          </Text>
        </div>
        <Badge>{attendees} inscrits</Badge>
      </div>
    </Card>
  );
}

export function HomeScreen({ navigate }: ScreenProps) {
  const { getUserEvents, currentUserId, setSelectedEventId } =
    useFestipodData();

  const myEvents = getUserEvents(currentUserId);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    navigate("event-detail");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "2px solid var(--sketch-black)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title style={{ margin: 0 }}>Festipod</Title>
          <span
            onClick={() => navigate("profile")}
            style={{ cursor: "pointer", fontSize: 24 }}
          >
            ☺
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, overflow: "auto" }}>
        {/* Helper text */}
        <div
          style={{
            background: "var(--sketch-light-gray)",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--sketch-gray)",
              lineHeight: 1.5,
            }}
          >
            Voici les événements auxquels vous participez. Retrouvez les infos
            pratiques et les autres participants.
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ margin: 0, fontWeight: "bold" }}>
            Mes événements à venir
          </Text>
          <Text
            style={{ margin: 0, fontSize: 14, cursor: "pointer" }}
            onClick={() => navigate("events")}
          >
            Voir tout →
          </Text>
        </div>

        {myEvents.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            distance={event.distance ?? 0}
            attendees={event.participantCount}
            onClick={() => handleEventClick(event.id)}
          />
        ))}

        <div style={{ marginTop: 24 }}>
          <Button
            variant="primary"
            onClick={() => navigate("create-event")}
            style={{ width: "100%" }}
          >
            + Relayer un événement
          </Button>
        </div>
      </div>

      {/* Bottom Nav */}
      <NavBar
        items={[
          { icon: "⌂", label: "Accueil", active: true },
          { icon: "◎", label: "Découvrir", onClick: () => navigate("events") },
          {
            icon: "+",
            label: "Relayer",
            onClick: () => navigate("create-event"),
          },
          { icon: "☺", label: "Profil", onClick: () => navigate("profile") },
        ]}
      />
    </div>
  );
}
