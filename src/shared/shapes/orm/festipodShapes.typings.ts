export type IRI = string;

/**
 * =============================================================================
 * Typescript Typings for festipodShapes
 * =============================================================================
 */

/**
 * Event Type
 */
export interface FpEvent {
  /**
   * The graph IRI.
   */
  readonly "@graph": IRI;
  /**
   * The subject IRI.
   */
  readonly "@id": IRI;
  /**
   * Original IRI: http://www.w3.org/1999/02/22-rdf-syntax-ns#type
   */
  "@type": "http://festipod.org/Event";
  /**
   * The title of the event
   *
   * Original IRI: http://festipod.org/title
   */
  title: string;
  /**
   * A description of the event
   *
   * Original IRI: http://festipod.org/description
   */
  description?: string;
  /**
   * The display date of the event (e.g. 'Lun. 16 - Ven. 20 fév.')
   *
   * Original IRI: http://festipod.org/date
   */
  date: string;
  /**
   * The location of the event
   *
   * Original IRI: http://festipod.org/location
   */
  location: string;
  /**
   * Distance in km from the user
   *
   * Original IRI: http://festipod.org/distance
   */
  distance?: number;
  /**
   * Number of participants
   *
   * Original IRI: http://festipod.org/participantCount
   */
  participantCount: number;
  /**
   * URL of the cover image
   *
   * Original IRI: http://festipod.org/coverImage
   */
  coverImage?: string;
  /**
   * Name of the event host or relay
   *
   * Original IRI: http://festipod.org/hostName
   */
  hostName?: string;
  /**
   * Initials of the event host
   *
   * Original IRI: http://festipod.org/hostInitials
   */
  hostInitials?: string;
}

/**
 * UserProfile Type
 */
export interface FpUserProfile {
  /**
   * The graph IRI.
   */
  readonly "@graph": IRI;
  /**
   * The subject IRI.
   */
  readonly "@id": IRI;
  /**
   * Original IRI: http://www.w3.org/1999/02/22-rdf-syntax-ns#type
   */
  "@type": "http://festipod.org/UserProfile";
  /**
   * Full name of the user
   *
   * Original IRI: http://festipod.org/name
   */
  name: string;
  /**
   * Initials for avatar display
   *
   * Original IRI: http://festipod.org/initials
   */
  initials: string;
  /**
   * Username handle (e.g. @mariedupont)
   *
   * Original IRI: http://festipod.org/username
   */
  username: string;
  /**
   * Role or title of the user
   *
   * Original IRI: http://festipod.org/role
   */
  role?: string;
  /**
   * Whether the profile is public
   *
   * Original IRI: http://festipod.org/isPublic
   */
  isPublic?: boolean;
}

/**
 * Participation Type
 */
export interface FpParticipation {
  /**
   * The graph IRI.
   */
  readonly "@graph": IRI;
  /**
   * The subject IRI.
   */
  readonly "@id": IRI;
  /**
   * Original IRI: http://www.w3.org/1999/02/22-rdf-syntax-ns#type
   */
  "@type": "http://festipod.org/Participation";
  /**
   * Reference to the event
   *
   * Original IRI: http://festipod.org/event
   */
  event: IRI;
  /**
   * Reference to the user
   *
   * Original IRI: http://festipod.org/user
   */
  user: IRI;
  /**
   * Whether the participation is confirmed
   *
   * Original IRI: http://festipod.org/isConfirmed
   */
  isConfirmed: boolean;
}
