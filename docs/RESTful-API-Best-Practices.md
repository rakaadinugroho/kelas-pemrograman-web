# RESTful API Design Best Practices

## A Comprehensive Guide for Software Engineering Students

---

## Table of Contents

1. [What is an API?](#1-what-is-an-api)
2. [Understanding REST](#2-understanding-rest)
3. [RESTful API URL Structure](#3-restful-api-url-structure)
4. [HTTP Methods & Operations](#4-http-methods--operations)
5. [HTTP Status Codes](#5-http-status-codes)
6. [Request & Response Format](#6-request--response-format)
7. [Query Parameters vs Path Parameters](#7-query-parameters-vs-path-parameters)
8. [API Versioning](#8-api-versioning)
9. [Error Handling](#9-error-handling)
10. [Hands-On: Building APIs with Next.js](#10-hands-on-building-apis-with-nextjs)
11. [Best Practices Summary](#11-best-practices-summary)

---

## 1. What is an API?

### Definition

**API (Application Programming Interface)** is a set of protocols, routines, and tools for building software applications that specifies how software components should interact.

### Real-World Analogy

```
Restaurant Analogy:
┌─────────────────────────────────────────────────────────────┐
│  Customer (Client)                                          │
│      │                                                      │
│      │  Order Menu (Request)                                │
│      ▼                                                      │
│  ┌─────────────┐                                            │
│  │   Waiter    │  ◄── API Interface                         │
│  └─────────────┘                                            │
│      │                                                      │
│      │  Kitchen Instructions                                │
│      ▼                                                      │
│  ┌─────────────┐                                            │
│  │   Kitchen   │  ◄── Server/Backend                       │
│  │   (Database)│                                            │
│  └─────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Types of APIs

| Type | Description | Example |
|------|-------------|---------|
| **Web API** | Accessed via HTTP/HTTPS | REST, GraphQL, SOAP |
| **Library API** | Provided by programming libraries | React hooks, jQuery |
| **Operating System API** | System-level functionality | File I/O, networking |
| **Hardware API** | Device communication | Camera, sensors |

---

## 2. Understanding REST

### What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. It relies on a stateless, client-server, cacheable communication protocol — almost always HTTP.

### REST Constraints

```
┌────────────────────────────────────────────────────────────────┐
│                     REST ARCHITECTURE                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Client-Server Architecture                                 │
│     ├── Client handles UI, Server handles data                 │
│     └── Separation of concerns                                 │
│                                                                │
│  2. Stateless                         3. Cacheable            │
│     ├── Each request contains           ├── Responses can be   │
│     │   all necessary info              │   cached             │
│     └── No session stored               └── Reduces latency    │
│                                                                │
│  4. Uniform Interface                                          │
│     └── Resources identified by URIs                           │
│                                                                │
│  5. Layered System                                             │
│     └── Client doesn't know if connected  directly to server    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### REST Resources

A **resource** is any named information that can be addressed. Resources have:

- **Unique Identifier** (URI)
- **Representation** (JSON, XML, HTML)
- **Set of Methods** (GET, POST, PUT, DELETE)

---

## 3. RESTful API URL Structure

### The Golden Rule: Use Plural Nouns for Collections

```
❌ BAD Examples:
/getDistricts
/getAllCCTV
/district/1
/createUser

✅ GOOD Examples:
/districts
/cctvs
/districts/1
/users
```

### URL Hierarchy Structure

```
API Base URL
│
└── /api
    │
    ├── /districts              ← Collection of all districts
    │       │
    │       └── /{code}         ← Single district (by code)
    │               │
    │               ├── /commodities      ← Sub-resource
    │               │
    │               └── /inflation-markets ← Sub-resource
    │
    ├── /cctvs                  ← Collection of all CCTVs
    │       │
    │       └── /{id}           ← Single CCTV (by ID)
    │
    └── /markets                ← Collection of markets
```

### Path Structure Best Practices

| Pattern | Example | Use Case |
|---------|---------|----------|
| `/resources` | `/districts` | List all resources |
| `/resources/{id}` | `/districts/WNS` | Get single resource |
| `/resources/{id}/sub` | `/districts/WNS/commodities` | Get sub-resources |
| `/resources?filter=value` | `/districts?population=50000` | Filter collection |

### Nouns vs Verbs in URL

```
┌─────────────────────────────────────────────────────────────┐
│                    URL VERB USAGE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   HTTP Method  │  URL                │  Action              │
│   ─────────────┼─────────────────────┼─────────────────────  │
│   GET          │  /districts         │  List districts       │
│   GET          │  /districts/WNS     │  Get WNS district     │
│   POST         │  /districts         │  Create district      │
│   PUT          │  /districts/WNS      │  Update WNS           │
│   DELETE       │  /districts/WNS      │  Delete WNS          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. HTTP Methods & Operations

### CRUD Operations Mapping

```
┌────────────────────────────────────────────────────────────────┐
│                   CRUD vs HTTP METHODS                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CREATE         →    POST     /districts       (body: data)   │
│   READ           →    GET      /districts/WNS                   │
│   UPDATE         →    PUT      /districts/WNS    (body: data)  │
│   DELETE         →    DELETE   /districts/WNS                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Safe vs Unsafe Methods

| Method | Safe (Read-only) | Idempotent | Description |
|--------|------------------|------------|-------------|
| GET | ✅ | ✅ | Retrieve resource |
| POST | ❌ | ❌ | Create new resource |
| PUT | ❌ | ✅ | Replace resource |
| PATCH | ❌ | ❌ | Partial update |
| DELETE | ❌ | ✅ | Remove resource |

### Method Definitions

```
GET
  - Retrieve data from server
  - Should not modify data
  - Can be cached
  - URL contains all parameters

POST
  - Send data to server
  - Creates new resource
  - Non-idempotent (multiple calls = multiple resources)
  - Data sent in request body

PUT
  - Replace entire resource
  - Idempotent (multiple calls = same result)
  - Requires full resource data in body

PATCH
  - Partial update
  - Only changed fields in body
  - Non-idempotent in some implementations

DELETE
  - Remove resource
  - Idempotent (deleting same resource twice = same result)
```

---

## 5. HTTP Status Codes

### Status Code Categories

```
┌────────────────────────────────────────────────────────────────┐
│                  HTTP STATUS CODE CATEGORIES                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1xx ─── Informational    Request received, continuing...      │
│   2xx ─── Success         Request successfully received         │
│   3xx ─── Redirection     Further action needed                │
│   4xx ─── Client Error    Problem with request                 │
│   5xx ─── Server Error    Server failed to fulfill request      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Essential Status Codes

| Code | Name | When to Use |
|------|------|-------------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST (new resource) |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Invalid request syntax |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Authenticated but no permission |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource conflict (duplicate) |
| **422** | Unprocessable | Validation failed |
| **500** | Internal Error | Server-side error |

### Error Response Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "District with code 'XYZ' not found",
    "details": {}
  }
}
```

---

## 6. Request & Response Format

### Consistent Response Structure

```json
{
  "data": [
    {
      "code": "WNS",
      "name": "Wonosobo",
      "population": 89012,
      "area": "48.21 km²"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "perPage": 10,
    "filters": {
      "name": null
    }
  }
}
```

### Single Resource Response

```json
{
  "data": {
    "code": "WNS",
    "name": "Wonosobo",
    "population": 89012,
    "area": "48.21 km²",
    "description": "Wonosobo town center"
  }
}
```

### Error Response Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "District with code 'INVALID' not found",
    "status": 404
  }
}
```

---

## 7. Query Parameters vs Path Parameters

### Path Parameters

Used for **required, unique identifiers**:

```
/districts/WNS        ← WNS is path param (required)
/districts/KRT        ← KRT is path param
/cctvs/cctv-001       ← cctv-001 is path param
```

### Query Parameters

Used for **filtering, searching, pagination**:

```
/districts?name=Wonosobo                    ← search
/districts?minPopulation=50000              ← filter
/cctvs?status=active                        ← filter
/cctvs?districtCode=WNS&status=active        ← multiple filters
/districts?page=2&perPage=10                ← pagination
```

### Decision Matrix

```
┌────────────────────────────────────────────────────────────────┐
│              PATH vs QUERY PARAMETERS                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PATH Parameters           │    QUERY Parameters               │
│   ─────────────────────     │    ──────────────────────          │
│   Required identifier       │    Optional filters               │
│   Unique resource ID        │    Search queries                 │
│   Pagination page numbers   │    Sorting                       │
│   Part of URL structure     │    Optional fields               │
│   Example: /districts/WNS    │    Example: /districts?name=won   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. API Versioning

### Why Version?

```
Without Versioning:              With Versioning:
┌─────────────────────┐         ┌─────────────────────┐
│ Breaking changes     │         │ /api/v1/...         │
│ break all clients!   │         │ /api/v2/...         │
│                      │         │                     │
│ v1 ──┬── Client A   │         │ v1 ──┬── Client A   │
│      ├── Client B   │         │      ├── Client B   │
│      └── Client C   │         │ v2 ──┬── Client C   │
│         ✗          │         │      └── Client D   │
└─────────────────────┘         └─────────────────────┘
```

### Versioning Strategies

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL Path | `/api/v1/districts` | Clear, easy | URL changes |
| Header | `Accept: v1` | Clean URL | Complex |
| Query | `/api/districts?version=1` | Flexible | Cluttered URL |

### Recommended: URL Path Versioning

```
/api/v1/districts        ← First version
/api/v2/districts        ← Updated version

/api/v1/districts/WNS    ← Specific resource in v1
/api/v2/districts/WNS    ← Same resource in v2
```

---

## 9. Error Handling

### Error Response Structure

```typescript
interface ErrorResponse {
  error: {
    code: string;      // Machine-readable code
    message: string;   // Human-readable message
    details?: object;  // Additional context
    status: number;    // HTTP status code
  }
}
```

### Common Error Scenarios

| Scenario | Status Code | Error Code |
|----------|-------------|------------|
| Resource not found | 404 | NOT_FOUND |
| Invalid ID format | 400 | INVALID_ID |
| Missing required field | 400 | VALIDATION_ERROR |
| Duplicate resource | 409 | DUPLICATE |
| Server error | 500 | INTERNAL_ERROR |

### Error Handling Best Practices

```
┌────────────────────────────────────────────────────────────────┐
│                  ERROR HANDLING BEST PRACTICES                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Always return consistent error format                        │
│  2. Include error codes for programmatic handling              │
│  3. Provide meaningful error messages                          │
│  4. Never expose internal server details                       │
│  5. Log errors server-side for debugging                        │
│  6. Return appropriate status codes                           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. Hands-On: Building APIs with Next.js

### Project Structure

```
src/app/api/
│
├── route.ts                           # API Root
│
├── districts/
│   ├── route.ts                       # GET /api/districts
│   │
│   └── [code]/
│       ├── route.ts                   # GET /api/districts/{code}
│       │
│       ├── commodities/
│       │   └── route.ts               # GET /api/districts/{code}/commodities
│       │
│       └── inflation-markets/
│           └── route.ts               # GET /api/districts/{code}/inflation-markets
│
└── cctvs/
    └── route.ts                       # GET /api/cctvs
```

### Step-by-Step Implementation

#### Step 1: Create API Root

```typescript
// src/app/api/route.ts
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    name: 'Wonosobo Smart City API',
    version: 'v1',
    resources: {
      districts: '/api/districts',
      cctvs: '/api/cctvs',
    },
  })
}
```

#### Step 2: Create Mock Data

```typescript
// src/lib/mock-data.ts
export interface District {
  code: string
  name: string
  population: number
  area: string
}

export const districts: District[] = [
  {
    code: 'WNS',
    name: 'Wonosobo',
    population: 89012,
    area: '48.21 km²',
  },
  {
    code: 'SKU',
    name: 'Sapuran',
    population: 45230,
    area: '45.12 km²',
  },
]
```

#### Step 3: List Districts (Collection Endpoint)

```typescript
// src/app/api/districts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { districts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  let filteredDistricts = [...districts]

  if (name) {
    filteredDistricts = filteredDistricts.filter((d) =>
      d.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  return NextResponse.json({
    data: filteredDistricts,
    meta: {
      total: filteredDistricts.length,
      filters: { name },
    },
  })
}
```

#### Step 4: Get Single District (Detail Endpoint)

```typescript
// src/app/api/districts/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { districts } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const district = districts.find(
    (d) => d.code.toLowerCase() === code.toLowerCase()
  )

  if (!district) {
    return NextResponse.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: `District with code '${code}' not found`,
        },
      },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: district })
}
```

#### Step 5: Sub-resource (Commodities)

```typescript
// src/app/api/districts/[code]/commodities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { commodities } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const districtCommodities = commodities.filter(
    (c) => c.districtCode.toLowerCase() === code.toLowerCase()
  )

  let filtered = districtCommodities

  if (category) {
    filtered = filtered.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    )
  }

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      districtCode: code.toUpperCase(),
    },
  })
}
```

---

## 11. Best Practices Summary

### URL Design

```
┌────────────────────────────────────────────────────────────────┐
│                    URL DESIGN CHECKLIST                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Use plural nouns for collections (districts, not district) │
│  ✅ Use kebab-case for multi-word URLs                          │
│  ✅ Use path parameters for resource identifiers                │
│  ✅ Use query parameters for filtering and search               │
│  ❌ Don't use verbs in URLs (let HTTP methods handle it)        │
│  ❌ Don't use file extensions (.json, .xml)                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Response Design

```
┌────────────────────────────────────────────────────────────────┐
│                  RESPONSE DESIGN CHECKLIST                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Use consistent response structure { data, meta }            │
│  ✅ Return appropriate HTTP status codes                        │
│  ✅ Include pagination info in meta                             │
│  ✅ Use snake_case for JSON field names                         │
│  ✅ Provide meaningful error messages                           │
│  ❌ Don't return raw database IDs to clients                    │
│  ❌ Don't expose internal server errors                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Security Considerations

```
┌────────────────────────────────────────────────────────────────┐
│                  SECURITY CHECKLIST                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Always validate input data                                   │
│  ✅ Use authentication for protected endpoints                   │
│  ✅ Implement rate limiting                                     │
│  ✅ Never expose sensitive data in error messages               │
│  ✅ Use HTTPS in production                                     │
│  ✅ Sanitize user input to prevent injection                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference: Common Patterns

### List Resources
```
GET /api/resources
Response: { data: [...], meta: { total: n } }
```

### Get Single Resource
```
GET /api/resources/{id}
Response: { data: {...} }
Error: 404 if not found
```

### Get Sub-resources
```
GET /api/resources/{id}/sub-resources
Response: { data: [...], meta: { total: n } }
```

### Filter Collection
```
GET /api/resources?field=value&another=value
Response: { data: [...], meta: { total: n, filters: {...} } }
```

### Search Collection
```
GET /api/resources?search=term
Response: { data: [...], meta: { total: n } }
```

### Pagination
```
GET /api/resources?page=2&perPage=10
Response: { data: [...], meta: { total: n, page: 2, perPage: 10 } }
```

---

## Exercise for Students

### Task 1: Add New Endpoint
Add an endpoint to list all markets in Wonosobo:
- URL: `/api/markets`
- Support filtering by district

### Task 2: Add Pagination
Add pagination to the districts list:
- Default: 10 items per page
- Parameters: `page`, `perPage`

### Task 3: Add Error Handling
Improve error responses with:
- Validation errors (400)
- Duplicate resource errors (409)

---

## Additional Resources

- [REST API Design Rulebook](https://www.oreilly.com/library/view/rest-api-design/9781449317904/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Next.js Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)

---

*Document Version: 1.0*
*Last Updated: April 2026*
*Author: Wonosobo Smart City Development Team*
