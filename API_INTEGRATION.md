# FaceId Attendance Backend — API Integration Document

> Generated from codebase analysis. Target audience: React/TypeScript frontend assistant.

---

## 1. Authentication

### Scheme

All authenticated requests use **JWT Bearer tokens**:

```
Authorization: Bearer <access_token>
```

A secondary **ApiKey** scheme exists for server-to-server calls (Face API integration only):

```
Authorization: ApiKey <api_key>
```

### Required Headers on ALL `/api/*` Requests

```
X-App-Platform: web          // Required: "android" | "ios" | "web"
X-App-Build: 126             // Required for Android only (must be >= 126)
```

The web frontend should always send `X-App-Platform: web`.

---

### Login

**`POST /api/auth/login`** — No auth required. Rate-limited (1000 req/10min per IP).

**Request body:**
```json
{
  "username": "string",
  "password": "string",
  "rememberMe": true,
  "deviceInfo": "string | null",
  "fcmDeviceToken": "string | null"
}
```

**Success response (`200 OK`):**
```json
{
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "abc123...",
    "accessTokenExpiry": "2026-03-16T12:00:00Z",
    "refreshTokenExpiry": "2026-04-15T12:00:00Z",
    "tokenType": "Bearer",
    "scopes": ["attendance", "leave"],
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "userName": "jdoe",
      "email": "jdoe@example.com",
      "phoneNumber": "+9647001234567",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLoginAt": "2026-03-16T08:00:00Z",
      "timeZone": "Asia/Baghdad",
      "roles": ["Employee"],
      "permissions": ["A1", "L1"],
      "projectAccesses": [
        {
          "projectId": "3fa85f64-...",
          "projectName": "Main Site",
          "role": "Employee",
          "isActive": true,
          "assignedAt": "2025-01-01T00:00:00Z",
          "assignedBy": "admin"
        }
      ],
      "profile": { }
    }
  },
  "succeeded": true,
  "errors": [],
  "isConflict": false,
  "isNotFound": false
}
```

Store `data.accessToken` and `data.refreshToken` from the response. Attach the access token as `Authorization: Bearer <token>` on every subsequent request.

---

### Refresh Token

**`POST /api/auth/refresh-token`** — No auth required.

```json
{
  "refreshToken": "string",
  "deviceInfo": "string | null",
  "ipAddress": "string | null"
}
```

Returns the same shape as login (`TokenResponseDto`).

---

### Revoke Token (Logout)

**`POST /api/auth/revoke-token`** — Bearer required.

```json
{
  "refreshToken": "string | null",
  "revokeAll": false,
  "reason": "string | null"
}
```

Returns `204 No Content`.

---

## 2. TypeScript Interfaces (Data Models)

```typescript
// ─── Shared / Wrapper ───────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  succeeded: boolean;
  errors: string[];
  isConflict: boolean;
  isNotFound: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

// Paginated endpoints return the array directly in `data`,
// with pagination info in the X-Pagination response header (JSON).

// ─── Auth ────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
  deviceInfo?: string;
  fcmDeviceToken?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;  // ISO 8601
  refreshTokenExpiry: string;
  tokenType: 'Bearer';
  scopes: string[];
  user: UserWithProfile;
}

export interface UserProjectAccess {
  projectId: string;
  projectName: string;
  role: string;
  isActive: boolean;
  assignedAt: string;
  assignedBy: string;
}

// ─── Users ───────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  timeZone: string;
  projectAccesses: UserProjectAccess[];
  roles: string[];
  permissions: string[];
}

export interface UserWithProfile extends UserDto {
  profile: ProfileDto | null;
}

// ─── Profiles / Employees ────────────────────────────────────────────

export type Gender = 'Male' | 'Female';

export type ProfileType =
  | 'Employee'
  | 'Manager'
  | 'Supervisor'
  | 'HR'
  | 'Admin';

export type ShiftType = 'Fixed' | 'Flexible' | 'Rotating';

export interface WorkingHoursDto {
  shiftType: ShiftType;
  startTime: string | null;       // "HH:mm"
  endTime: string | null;
  weeklyOffDays: number[];        // 0=Sunday … 6=Saturday
  weeklySchedule: Record<string, { start: string; end: string }> | null;
}

export interface EmployeeDataDto {
  hireDate: string | null;        // ISO date "YYYY-MM-DD"
  terminationDate: string | null;
  isTerminated: boolean;
  workingHours: WorkingHoursDto | null;
}

export interface ProfileDto {
  id: string;
  fullName: string;
  gender: Gender;
  employeeNumber: string;
  phoneNumber: string | null;
  address: string | null;
  profileType: ProfileType;
  locationNodeId: string | null;
  locationName: string | null;
  projectId: string;
  projectName: string | null;
  positionId: string | null;
  positionTitle: string | null;
  hasMultiSite: boolean;
  employeeData: EmployeeDataDto | null;
}

// ─── Attendance ───────────────────────────────────────────────────────

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Holiday'
  | 'WeeklyOff'
  | 'Leave'
  | 'Late'
  | 'EarlyDeparture'
  | 'HalfDay';

export type CheckInType = 'CheckIn' | 'CheckOut';

export type CheckInStatus = 'Pending' | 'Completed' | 'Skipped';

export interface CheckInRecordDto {
  id: string;
  attendanceRecordId: string;
  profileId: string;
  scheduledTime: string | null;   // ISO datetime
  checkInTime: string | null;
  type: CheckInType;
  status: CheckInStatus;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export interface AttendanceRecordDto {
  id: string;
  profileId: string;
  date: string;                   // "YYYY-MM-DD"
  status: AttendanceStatus;
  totalWorkingHours: string | null; // TimeSpan as "HH:mm:ss"
  notes: string | null;
  isReviewed: boolean;
  isConfirmed: boolean;
  isWorkingDay: boolean;
  checkIns: CheckInRecordDto[];
}

export interface FaceVerificationResult {
  success: boolean;
  match: boolean;
  similarityScore: number;
  threshold: number;
  confidenceLevel: string;
  facesDetected: number;
  serviceMessage: string | null;
  error: string | null;
  userId: string | null;
  username: string | null;
}

export interface InitiateCheckInResponse {
  checkInRecordId: string;
  profileId: string;
  status: 'QueuedForCompletion' | 'Rejected';
  message: string;
  serverTimeUtc: string;
  verification: FaceVerificationResult;
}

// ─── Projects ─────────────────────────────────────────────────────────

export interface ProjectDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProjectLookupDto {
  id: string;
  name: string;
}

// ─── Location Nodes ───────────────────────────────────────────────────

export interface LocationNodeDto {
  id: string;
  name: string;
  projectId: string;
  parentNodeId: string | null;
  level: number;
  nodeType: string;
  isActive: boolean;
}

export interface LocationNodeMinimalDto {
  id: string;
  name: string;
  nodeType: string;
  level: number;
  parentNodeId: string | null;
}

export interface GeographicalZoneDto {
  id: string;
  locationNodeId: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

// ─── Leave ────────────────────────────────────────────────────────────

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveTypeDto {
  id: string;
  name: string;
  code: string;
  description: string | null;
  maxDaysPerRequest: number;
  requiresDocument: boolean;
  requiresReplacement: boolean;
  defaultAllowedDaysPerMonth: number;
  isAutoAllocatedMonthly: boolean;
  maxAccumulatedDays: number;
  canCarryForward: boolean;
  isActive: boolean;
}

export interface LeaveRequestDto {
  id: string;
  profileId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;              // "YYYY-MM-DD"
  endDate: string;
  status: LeaveStatus;
  reason: string | null;
  isShortTimeLeave: boolean;
  rejectionReason: string | null;
  createdAt: string;
}

export interface EmployeeLeaveBalanceDto {
  id: string;
  profileId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  month: number | null;
  allowedDays: number;
  usedDays: number;
  remainingDays: number;
}

// ─── Positions ────────────────────────────────────────────────────────

export interface PositionDto {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
}

// ─── Notifications ────────────────────────────────────────────────────

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Roles & Permissions ──────────────────────────────────────────────

export interface PermissionDto {
  id: string;
  code: string;
  displayName: string;
  description: string | null;
  category: string;
  isActive: boolean;
}

export interface ApplicationRoleDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// ─── Public Holidays ─────────────────────────────────────────────────

export interface PublicHolidayDto {
  id: string;
  name: string;
  date: string;                   // "YYYY-MM-DD"
  locationNodeId: string | null;
  isActive: boolean;
}

// ─── Statistics (Dashboard) ──────────────────────────────────────────

export interface ProfileStatisticsDto {
  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;
  terminatedProfiles: number;
  byProfileType: Record<ProfileType, number>;
  byLocation: Array<{ locationName: string; locationNodeId: string; count: number }>;
  byPosition: Array<{ positionTitle: string; positionId: string; count: number }>;
  recentHires: number;
}

export interface AttendanceStatisticsDto {
  totalRecords: number;
  byStatus: Record<AttendanceStatus, number>;
  averageWorkingHoursPerDay: number;
  lateArrivals: number;
  absentCount: number;
  presentCount: number;
}
```

---

## 3. Endpoints Inventory

### Global Query Params (Paginated Endpoints)

| Param | Type | Default | Description |
|---|---|---|---|
| `pageNumber` | `number` | `1` | Page index (1-based) |
| `pageSize` | `number` | `10` | Items per page (max 100,000) |

Pagination metadata is returned in the **`X-Pagination` response header** as JSON:
```json
{ "currentPage": 1, "totalPages": 5, "pageSize": 10, "totalCount": 48 }
```

The `data` field in the response body is the plain array of items.

---

### Auth — `/api/auth`

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | None | `LoginRequest` | `ApiResponse<TokenResponse>` |
| `POST` | `/api/auth/refresh-token` | None | `{ refreshToken, deviceInfo?, ipAddress? }` | `ApiResponse<TokenResponse>` |
| `POST` | `/api/auth/revoke-token` | Bearer | `{ refreshToken?, revokeAll, reason? }` | `204` |
| `POST` | `/api/auth/create-user` | Perm: `U1` | `CreateUserWithProfileDto` (see below) | `ApiResponse<{ userId, profile }>` |
| `PUT` | `/api/auth/update-user/{userId}` | Perm: `U2` | `UpdateUserWithProfileDto` | `ApiResponse<UserWithProfile>` |
| `GET` | `/api/auth/employee/{profileId}/setup-status` | None | — | `ApiResponse<SetupStatusDto>` |

**`CreateUserWithProfileDto` body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "gender": "Male | Female",
  "phoneNumber": "string",
  "address": "string",
  "employeeNumber": "string",
  "hireDate": "YYYY-MM-DD",
  "locationNodeId": "guid | null",
  "positionId": "guid | null",
  "timeZone": "Asia/Baghdad",
  "profileType": "Employee",
  "projectId": "guid",
  "role": "Employee",
  "shiftType": "Fixed | Flexible",
  "weeklyOffDays": [5, 6],
  "hasMultiSite": false
}
```

---

### Users — `/api/users`

| Method | Path | Auth | Query | Returns |
|---|---|---|---|---|
| `GET` | `/api/users` | Perm: `U4` | `pageNumber, pageSize, q?, isActive?` | `ApiResponse<UserDto[]>` + X-Pagination |
| `GET` | `/api/users/{id}` | Perm: `U4` | — | `ApiResponse<UserWithProfile>` |
| `GET` | `/api/users/me` | Bearer | — | `ApiResponse<UserWithProfile>` |
| `GET` | `/api/users/statistics` | Role: Admin+ | `projectId?, locationNodeId?, fromDate?, toDate?` | `ApiResponse<ProfileStatisticsDto>` |
| `POST` | `/api/users/change-password` | Bearer | `{ currentPassword, newPassword }` | `ApiResponse<null>` |
| `POST` | `/api/users/reset-password/{id}` | Perm: `U2` | `{ newPassword, confirmPassword }` | `ApiResponse<null>` |
| `POST` | `/api/users/{userId}/deactivate` | Perm: `U2` | `{ reason? }` | `204` |
| `POST` | `/api/users/{userId}/activate` | Perm: `U2` | — | `204` |
| `DELETE` | `/api/users/{id}` | Perm: `U3` | — | `204` |

---

### Attendance — `/api/attendance`

| Method | Path | Auth | Query / Body | Returns |
|---|---|---|---|---|
| `GET` | `/api/attendance/records` | Perm: `A1` | `pageNumber, pageSize, profileId?, fromDate?, toDate?` | `ApiResponse<AttendanceRecordDto[]>` + X-Pagination |
| `GET` | `/api/attendance/records/current-user` | Bearer | `pageNumber, pageSize, fromDate?, toDate?` | `ApiResponse<AttendanceRecordDto[]>` + X-Pagination |
| `GET` | `/api/attendance/records/{id}` | Bearer | — | `ApiResponse<AttendanceRecordDto>` |
| `GET` | `/api/attendance/statistics` | Role: Admin+ | `projectId?, locationNodeId?, fromDate?, toDate?` | `ApiResponse<AttendanceStatisticsDto>` |
| `POST` | `/api/attendance/records` | Perm: `A2` | see below | `ApiResponse<AttendanceRecordDto>` |
| `PUT` | `/api/attendance/records/{id}` | Perm: `A2` | `{ status?, notes?, recalculateStatus }` | `ApiResponse<AttendanceRecordDto>` |
| `DELETE` | `/api/attendance/records/{id}` | Perm: `A2` | — | `204` |
| `GET` | `/api/attendance/check-ins` | Bearer | `pageNumber, pageSize, attendanceRecordId?, profileId?, status?` | `ApiResponse<CheckInRecordDto[]>` |
| `POST` | `/api/attendance/checkin/initiate` | Bearer | `multipart/form-data` (see below) | `ApiResponse<InitiateCheckInResponse>` |
| `POST` | `/api/attendance/checkin/timeoff` | Bearer | `{ profileId, checkInRecordId, reason? }` | `ApiResponse<null>` |
| `GET` | `/api/attendance/checkin/timeoff/balance` | Bearer | — | `ApiResponse<TimeOffBalanceDto>` |

**Create Attendance Record body:**
```json
{
  "profileId": "guid",
  "date": "YYYY-MM-DD",
  "checkInType": "string",
  "createCheckIns": true,
  "ignoreWeeklyOffDays": false,
  "ignorePublicHolidays": false,
  "createHolidayRecord": false
}
```

**Face Check-in (`multipart/form-data`):**
```
ProfileId:       guid    (required)
Image:           File    (required, image/*)
CheckInRecordId: guid    (optional)
Latitude:        number  (optional)
Longitude:       number  (optional)
Radius:          number  (optional, metres)
RequestId:       string  (optional, idempotency key)
```

---

### Projects — `/api/projects`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/projects` | Perm: `P4` | `ApiResponse<ProjectDto[]>` + X-Pagination. Query: `pageNumber, pageSize, name?` |
| `GET` | `/api/projects/{id}` | Perm: `P4` | `ApiResponse<ProjectDto>` |
| `GET` | `/api/projects/lookup` | Perm: `P4` | `ApiResponse<ProjectLookupDto[]>` |
| `POST` | `/api/projects` | Perm: `P1` | `ApiResponse<{ id }>` — `201` with Location header |
| `PATCH` | `/api/projects/{id}` | Perm: `P2` | `ApiResponse<ProjectDto>` |
| `DELETE` | `/api/projects/{id}` | Perm: `P3` | `204` |

---

### Leave — `/api/leave`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/leave/requests` | Bearer | `ApiResponse<LeaveRequestDto[]>` + X-Pagination. Query: `pageNumber, pageSize, profileId?, status?` |
| `GET` | `/api/leave/requests/{id}` | Bearer | `ApiResponse<LeaveRequestDto>` |
| `POST` | `/api/leave/requests` | Bearer | `ApiResponse<LeaveRequestDto>` — `201` |
| `PUT` | `/api/leave/requests/{id}/approve` | Perm: `L2` | `ApiResponse<LeaveRequestDto>` |
| `PUT` | `/api/leave/requests/{id}/reject` | Perm: `L2` | `ApiResponse<LeaveRequestDto>` |
| `PUT` | `/api/leave/requests/{id}/cancel` | Bearer | `ApiResponse<LeaveRequestDto>` |
| `GET` | `/api/leave/types` | Bearer | `ApiResponse<LeaveTypeDto[]>` + X-Pagination. Query: `pageNumber, pageSize, isActive?` |
| `POST` | `/api/leave/types` | Perm: `L3` | `201` |
| `PUT` | `/api/leave/types/{id}` | Perm: `L3` | `ApiResponse<LeaveTypeDto>` |
| `DELETE` | `/api/leave/types/{id}` | Perm: `L3` | `501 Not Implemented` |

**Create Leave Request body:**
```json
{
  "profileId": "guid",
  "leaveTypeId": "guid",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "reason": "string | null",
  "isShortTimeLeave": false,
  "replacementEmployeeId": "guid | null",
  "documentPath": "string | null"
}
```

---

### Employee — `/api/employee`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/employee/leave-balances` | Bearer | `ApiResponse<EmployeeLeaveBalanceDto[]>` + X-Pagination. Query: `profileId?, pageNumber, pageSize` |
| `POST` | `/api/employee/leave-balances` | Bearer | `ApiResponse<EmployeeLeaveBalanceDto>` |
| `PUT` | `/api/employee/leave-balances/{id}` | Bearer | `ApiResponse<EmployeeLeaveBalanceDto>` |

---

### Profiles — `/api/profiles`

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| `POST` | `/api/profiles/{id}/terminate` | Role: Admin+ | `{ profileId, terminationDate, reason? }` | `ApiResponse<ProfileDto>` |
| `POST` | `/api/profiles/{id}/reactivate` | Role: Admin+ | — | `ApiResponse<ProfileDto>` |

---

### Location Nodes — `/api/locationnodes`

| Method | Path | Auth | Query | Returns |
|---|---|---|---|---|
| `GET` | `/api/locationnodes` | Perm: `O4` | `projectId?, parentNodeId?, name?, pageNumber, pageSize` | `ApiResponse<LocationNodeDto[]>` |
| `GET` | `/api/locationnodes/minimal` | Perm: `O4` | `projectId?, level?, nodeType?, parentId?, includeInactive?` | `ApiResponse<LocationNodeMinimalDto[]>` |
| `GET` | `/api/locationnodes/{id}` | Perm: `O4` | — | `ApiResponse<LocationNodeDto>` |
| `POST` | `/api/locationnodes` | Perm: `O1` | — | `201` |
| `PUT` | `/api/locationnodes/{id}` | Perm: `O2` | — | `ApiResponse<LocationNodeDto>` |
| `DELETE` | `/api/locationnodes/{id}` | Perm: `O3` | `hardDelete?` | `ApiResponse<{ type: 'hard' | 'soft' }>` |

---

### Notifications — `/api/notification`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/notification` | Bearer | `ApiResponse<NotificationDto[]>` + X-Pagination. Query: `pageNumber, pageSize, isRead?` |
| `PUT` | `/api/notification/{id}/read` | Bearer | `ApiResponse<{ markedCount: number }>` |
| `PUT` | `/api/notification/read-all` | Bearer | `ApiResponse<{ markedCount: number }>` |
| `POST` | `/api/notification/broadcast` | Role: Admin+ | `ApiResponse<BroadcastResultDto>` |

---

### Positions — `/api/positions`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/positions` | Perm: `ViewPosition` | `ApiResponse<PositionDto[]>` + X-Pagination. Query: `search?, pageNumber, pageSize` |
| `GET` | `/api/positions/{id}` | Perm: `ViewPosition` | `ApiResponse<PositionDto>` |
| `POST` | `/api/positions` | Perm: `CreatePosition` | `201` |
| `PUT` | `/api/positions/{id}` | Perm: `EditPosition` | `ApiResponse<PositionDto>` |
| `DELETE` | `/api/positions/{id}` | Perm: `DeletePosition` | `204` |

---

### Public Holidays — `/api/publicholidays`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/publicholidays` | Perm: `H4` | `ApiResponse<PublicHolidayDto[]>` + X-Pagination |
| `GET` | `/api/publicholidays/{id}` | Perm: `H4` | `ApiResponse<PublicHolidayDto>` |
| `GET` | `/api/publicholidays/by-location/{locationNodeId}` | Perm: `H4` | `ApiResponse<PublicHolidayDto[]>` |
| `POST` | `/api/publicholidays` | Perm: `H1` | `201` |
| `PUT` | `/api/publicholidays/{id}` | Perm: `H2` | `ApiResponse<PublicHolidayDto>` |
| `DELETE` | `/api/publicholidays/{id}` | Perm: `H3` | `204` |
| `PATCH` | `/api/publicholidays/{id}/activate` | Perm: `H2` | `ApiResponse<PublicHolidayDto>` |
| `PATCH` | `/api/publicholidays/{id}/deactivate` | Perm: `H2` | `ApiResponse<PublicHolidayDto>` |

---

### Health — `/api/health`

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/api/health` | None | `{ Status, Service, Timestamp, Version }` |
| `GET` | `/api/health/face-recognition` | None | Face API connectivity status |

---

## 4. Dashboard / Analytics

There are two dedicated statistics endpoints. These return pre-aggregated data suitable for rendering charts.

### Employee / Profile Statistics

**`GET /api/users/statistics`**

Required roles: `SuperAdmin`, `ProjectAdmin`, `HRManager`

Query params: `projectId?`, `locationNodeId?`, `fromDate?`, `toDate?`

```json
{
  "data": {
    "totalProfiles": 145,
    "activeProfiles": 132,
    "inactiveProfiles": 8,
    "terminatedProfiles": 5,
    "byProfileType": {
      "Employee": 120,
      "Manager": 12,
      "Supervisor": 8,
      "HR": 3,
      "Admin": 2
    },
    "byLocation": [
      { "locationNodeId": "guid", "locationName": "Baghdad HQ", "count": 80 },
      { "locationNodeId": "guid", "locationName": "Basra Branch", "count": 52 }
    ],
    "byPosition": [
      { "positionId": "guid", "positionTitle": "Software Engineer", "count": 45 }
    ],
    "recentHires": 12
  },
  "succeeded": true,
  "errors": [],
  "isConflict": false,
  "isNotFound": false
}
```

> **For a `DepartmentChart`:** use `data.byLocation` — each entry maps to a chart bar/slice with `locationName` as the label and `count` as the value.

---

### Attendance Statistics

**`GET /api/attendance/statistics`**

Required roles: `SuperAdmin`, `ProjectAdmin`, `HRManager`

Query params: `projectId?`, `locationNodeId?`, `fromDate?`, `toDate?`

```json
{
  "data": {
    "totalRecords": 2900,
    "byStatus": {
      "Present": 2400,
      "Absent": 200,
      "Late": 150,
      "Holiday": 100,
      "WeeklyOff": 50
    },
    "averageWorkingHoursPerDay": 7.8,
    "lateArrivals": 150,
    "absentCount": 200,
    "presentCount": 2400
  },
  "succeeded": true,
  "errors": [],
  "isConflict": false,
  "isNotFound": false
}
```

> **For attendance trend/status charts:** use `data.byStatus` as pie/bar chart data.

> **Note:** There is no separate `/api/dashboard` or `/api/reports` endpoint. All other stats must be derived on the frontend from paginated list calls.

---

## 5. Global API Patterns

### Base URL

```
https://attendance-api.scopesky.iq
```

All endpoints are prefixed with `/api/`. There is **no version segment** in the URL (no `/v1/`).

Full example: `https://attendance-api.scopesky.iq/api/auth/login`

---

### Standard Response Envelope

Every response is wrapped in:

```typescript
interface ApiResponse<T> {
  data: T | null;
  succeeded: boolean;
  errors: string[];
  isConflict: boolean;
  isNotFound: boolean;
}
```

For React Query hooks, check `response.data.succeeded` before consuming `response.data.data`.

---

### Error Responses

| HTTP Status | Meaning | Notes |
|---|---|---|
| `400` | Validation failure | `errors[]` contains field-level messages |
| `401` | Missing or expired token | Re-authenticate and retry |
| `403` | Permission denied | Check `user.permissions` in stored auth state |
| `404` | Resource not found | `isNotFound: true` |
| `409` | Business conflict / duplicate | `isConflict: true` |
| `422` | Face verification failed | Face not recognized |
| `426` | Missing `X-App-Platform` header | Always send this header |
| `429` | Rate limit exceeded | `Retry-After: 60` header included |
| `500` | Server error | — |
| `502` | Face API unreachable | External service failure |

**Error response shape:**
```json
{
  "data": null,
  "succeeded": false,
  "errors": ["Descriptive error message here"],
  "isConflict": false,
  "isNotFound": false
}
```

---

### Pagination Pattern for React Query

```typescript
// Parse pagination metadata from response header
const paginationHeader = response.headers.get('X-Pagination');
const pagination: PaginationMeta = JSON.parse(paginationHeader ?? '{}');

// Items are in the response body `data` array
const items: UserDto[] = responseBody.data ?? [];
```

---

### Permission Codes Reference

| Code | Permission | Category |
|---|---|---|
| `U1` | CreateUser | Users |
| `U2` | EditUser | Users |
| `U3` | DeleteUser | Users |
| `U4` | ViewUser | Users |
| `U5` | AssignRoles | Users |
| `A1` | ViewAttendance | Attendance |
| `A2` | EditAttendance | Attendance |
| `A3` | ManageAttendanceExceptions | Attendance |
| `A4` | GenerateAttendanceReports | Attendance |
| `A5` | ReviewAttendance | Attendance |
| `A6` | ConfirmAttendance | Attendance |
| `P1` | CreateProject | Projects |
| `P2` | EditProject | Projects |
| `P3` | DeleteProject | Projects |
| `P4` | ViewProject | Projects |
| `L1` | ViewLeaveRequests | Leave |
| `L2` | ApproveLeaveRequests | Leave |
| `L3` | ManageLeaveTypes | Leave |
| `L4` | ManageLeaveBalances | Leave |
| `E1` | CreateEmployee | Employees |
| `E2` | EditEmployee | Employees |
| `E3` | DeleteEmployee | Employees |
| `E4` | ViewEmployee | Employees |
| `E5` | ManageEmployeeFace | Employees |
| `O1` | CreateLocation | Organization |
| `O2` | EditLocation | Organization |
| `O3` | DeleteLocation | Organization |
| `O4` | ViewLocation | Organization |
| `O5` | ManageLocationZones | Organization |
| `S1` | ManageSystemConfig | System |
| `S2` | ViewSystemConfig | System |
| `S3` | ManageAuditLogs | System |
| `S4` | ViewReports | System |
| `H1` | CreatePublicHoliday | Holidays |
| `H2` | EditPublicHoliday | Holidays |
| `H3` | DeletePublicHoliday | Holidays |
| `H4` | ViewPublicHoliday | Holidays |

Use the permission codes stored in `user.permissions` (from the login response) to gate UI elements client-side.

---

### System Roles Reference

```typescript
type SystemRole =
  | 'SuperAdmin'       // Global — full access
  | 'Admin'            // Global
  | 'ProjectAdmin'     // Project-scoped
  | 'HRManager'        // Project-scoped
  | 'LocationManager'
  | 'Supervisor'
  | 'Employee'
  | 'HR'
  | 'HRUser'
  | 'Auditor';
```

---

### CORS — Allowed Origins

| Origin | Environment |
|---|---|
| `http://localhost:5173` | Local dev |
| `https://attendance-app.scopesky.iq` | Production |
| `https://attendance-api.scopesky.iq` | Production API |

---

### Idempotency

Face check-in requests accept an optional `RequestId` field. Duplicate requests with the same `RequestId` return `409 Conflict` with `"This request was already processed"`. Use this for safe retries on network failures.

---

### Soft Deletes

All entities are soft-deleted — `IsDeleted` is filtered automatically at the database level. Deleted records never appear in list responses unless `.IgnoreQueryFilters()` is used server-side (not exposed to clients).
