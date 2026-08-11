# Sankofa Library — Architecture

## Overview

Sankofa Library is a multi-tenant platform. It does not run a single library — it allows any user to create and operate their own independent library instance ("tenant") on shared infrastructure. Each library has its own catalog, its own members, its own admin dashboard, and does not share data with any other library on the platform.

---

## Core Entities

### User

A platform account: an email, password, and identity. A `User` is not tied to any single library.

```
User
  id
  name
  email
  passwordHash
  createdAt
```

### Library

A tenant. An isolated instance of the system with its own catalog, members, and admin space.

```
Library
  id
  name
  slug          -- used for subdomain routing, e.g. chris-library
  ownerId       -- FK to User
  plan          -- e.g. 'free' | 'paid'
  createdAt
```

### LibraryMembership

The join between a `User` and a `Library`, carrying a role. This is what allows one account to be associated with multiple libraries in different capacities.

```
LibraryMembership
  id
  userId        -- FK to User
  libraryId     -- FK to Library
  role          -- 'owner' | 'librarian' | 'member'
  joinedAt
```

A single `User` may have multiple `LibraryMembership` rows — one per library they're associated with, each with its own role.

### Book

```
Book
  id
  libraryId     -- FK to Library
  title
  author
  isbn
  copiesTotal
  copiesAvailable
  isFree
  addedAt
```

### CirculationRecord

```
CirculationRecord
  id
  libraryId     -- FK to Library
  bookId        -- FK to Book
  memberId      -- FK to User
  checkedOutAt
  dueDate
  returnedAt
```

---

## Tenant Isolation Rule

Every table that stores library-specific data (`Book`, `CirculationRecord`, staff/member records, procurement orders, reports) includes a `libraryId` column. Every query against these tables is scoped with `WHERE libraryId = ?`.

This is the tenant boundary. A query that omits this filter exposes one library's data to another.

---

## Account vs. Library vs. Membership

| Concept | Created by | Scope |
|---|---|---|
| `User` | Register | One person's login. Global — not scoped to any library. |
| `Library` | Create Library | One isolated tenant: catalog, members, admin dashboard, subdomain. |
| `LibraryMembership` | Joining or creating a library | Links a `User` to a `Library` with a role (`owner`, `librarian`, `member`). |

One `User` can hold a `LibraryMembership` in multiple `Library` records simultaneously, with a different role in each.

---

## Frontend Implications

### Routing

Each library-scoped route (`/discover`, `/database`, `/dashboard/*`) needs to resolve which `Library` it's operating against. Two routing strategies:

**Subdomain-based**
```
chris-library.sankofalibrary.com/discover
```
The subdomain identifies the library. Requires wildcard DNS and subdomain-aware routing.

**Path-based**
```
sankofalibrary.com/chris-library/discover
```
The library slug is a URL segment. No DNS configuration required.

### Library Context

Pages need access to the current library's `id` at render time — typically via a context provider populated from the resolved subdomain or path segment, wrapping the relevant route tree.

### Library Switching

A `User` with multiple `LibraryMembership` rows needs a UI mechanism to switch which library they're currently viewing/administering (e.g., a selector near the account menu).

### Create Library Flow

A dedicated flow, distinct from Register:

1. User is authenticated (has a `User` account)
2. Submits library name and slug
3. Server creates a `Library` row and a `LibraryMembership` row with `role: 'owner'`
4. User is redirected into that library's admin dashboard

---

## Auth Implications

Two distinct checks apply to any protected route:

**Authentication** — is there a valid session for any `User`?

**Authorization** — does this `User` have a `LibraryMembership` for *this* `Library`, with a `role` that permits *this* route?

Example: a `member` role should not reach `/dashboard/catalogs`, even for a library they are genuinely a member of. An `owner` of Library A should not be able to access Library B's admin dashboard without a separate membership in Library B.

---

## Summary

- `User` — a login, global across the platform
- `Library` — an isolated tenant with its own data
- `LibraryMembership` — join table carrying a per-library role
- All library-scoped tables carry a `libraryId` and are queried with that scope enforced
- Routing, context, and auth all need to resolve "which library" before serving library-scoped data