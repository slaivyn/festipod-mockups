import type { Schema } from "@ng-org/shex-orm";

/**
 * =============================================================================
 * festipodShapesSchema: Schema for festipodShapes
 * =============================================================================
 */
export const festipodShapesSchema: Schema = {
  "http://festipod.org/Event": {
    iri: "http://festipod.org/Event",
    predicates: [
      {
        dataTypes: [
          {
            valType: "iri",
            literals: ["http://festipod.org/Event"],
          },
        ],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        readablePredicate: "@type",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/title",
        readablePredicate: "title",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/description",
        readablePredicate: "description",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/date",
        readablePredicate: "date",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/location",
        readablePredicate: "location",
      },
      {
        dataTypes: [{ valType: "number" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/distance",
        readablePredicate: "distance",
      },
      {
        dataTypes: [{ valType: "number" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/participantCount",
        readablePredicate: "participantCount",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/coverImage",
        readablePredicate: "coverImage",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/hostName",
        readablePredicate: "hostName",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/hostInitials",
        readablePredicate: "hostInitials",
      },
    ],
  },
  "http://festipod.org/UserProfile": {
    iri: "http://festipod.org/UserProfile",
    predicates: [
      {
        dataTypes: [
          {
            valType: "iri",
            literals: ["http://festipod.org/UserProfile"],
          },
        ],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        readablePredicate: "@type",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/name",
        readablePredicate: "name",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/initials",
        readablePredicate: "initials",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/username",
        readablePredicate: "username",
      },
      {
        dataTypes: [{ valType: "string" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/role",
        readablePredicate: "role",
      },
      {
        dataTypes: [{ valType: "boolean" }],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "http://festipod.org/isPublic",
        readablePredicate: "isPublic",
      },
    ],
  },
  "http://festipod.org/Participation": {
    iri: "http://festipod.org/Participation",
    predicates: [
      {
        dataTypes: [
          {
            valType: "iri",
            literals: ["http://festipod.org/Participation"],
          },
        ],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        readablePredicate: "@type",
      },
      {
        dataTypes: [{ valType: "iri" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/event",
        readablePredicate: "event",
      },
      {
        dataTypes: [{ valType: "iri" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/user",
        readablePredicate: "user",
      },
      {
        dataTypes: [{ valType: "boolean" }],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://festipod.org/isConfirmed",
        readablePredicate: "isConfirmed",
      },
    ],
  },
};
