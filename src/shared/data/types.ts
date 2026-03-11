/**
 * App-level data types used by screens.
 * These are plain TypeScript types (not RDF-bound).
 * The data layer maps to/from NextGraph shapes internally.
 */

export interface FpEventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  distance?: number;
  participantCount: number;
  coverImage?: string;
  hostName?: string;
  hostInitials?: string;
  themes?: string[];
}

export interface FpUserData {
  id: string;
  name: string;
  initials: string;
  username: string;
  role?: string;
  isPublic?: boolean;
  bio?: string;
  city?: string;
  eventsCount?: number;
  friendsCount?: number;
  participationsCount?: number;
}

export interface FpParticipationData {
  id: string;
  eventId: string;
  userId: string;
  isConfirmed: boolean;
}

export interface FpMeetingPointData {
  id: string;
  eventId: string;
  location: string;
  time: string;
  hostName: string;
  hostInitials: string;
}

export interface FpFriendshipData {
  id: string;
  userId: string;
  friendId: string;
}
