# CRM Public API Contract

This document defines the interface between the Jeto Vacations public website and the CRM backend.

## Status: Hypothesized (Based on Legacy Audit)
*The contracts below are derived from extracted legacy frontend calls and the program plan. They must be verified against the live backend before production deployment.*

## 1. Catalogue Endpoints

### List Destinations
- **Method:** `GET`
- **Path:** `/listdest`
- **Auth:** None (Public)
- **Response Shape:** `Destination[]`
- **Description:** Fetches all published destinations for the public directory.

### List Packages
- **Method:** `GET`
- **Path:** `/listtripsdata/all`
- **Auth:** None (Public)
- **Response Shape:** `HolidayPackage[]`
- **Description:** Fetches all published holiday packages.

## 2. Enquiry Endpoints

### Submit Public Enquiry
- **Method:** `POST`
- **Path:** `/weblead`
- **Auth:** None (Public)
- **Request Payload:**
  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "destination": "string",
    "departureCity": "string",
    "travelMonth": "string",
    "adults": "number",
    "children": "number",
    "budgetRange": "string",
    "travelStyle": "string",
    "notes": "string",
    "source": "website",
    "landingPage": "string",
    "timestamp": "ISO8601 string",
    "consent": "boolean"
  }
  ```
- **Response Shape:**
  ```json
  {
    "leadId": "string",
    "status": "created | duplicate | error",
    "message": "string"
  }
  ```
- **Description:** Creates a new lead in the CRM from a website enquiry.

## Integration Strategy
- **Adapter Layer:** All calls are routed through `src/lib/api/crm-adapter.ts`.
- **Mode Switching:** The adapter supports a `DEMO_ENQUIRY_MODE` environment variable to switch between live API calls and local mock persistence.
- **Security:** No secrets are passed from the client; all API calls are handled via server-side Next.js actions.
