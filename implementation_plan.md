# Implementation Plan - Frontend Integration

## Goal
Connect the React Frontend to the Backend API to enable real data fetching and job creation functionality.

## Proposed Changes

### Frontend Configuration
#### [NEW] [frontend/.env](file:///c:/Users/Administrator/Desktop/app/rainflow-app/frontend/.env)
- Add `VITE_API_URL` pointing to the backend URL (http://54.219.178.244:3000).

### Frontend Logic
#### [NEW] [frontend/src/services/api.ts](file:///c:/Users/Administrator/Desktop/app/rainflow-app/frontend/src/services/api.ts)
- Create `api` axios instance or fetch wrapper.
- Implement `createJob` function calling `POST /api/jobs`.
- Implement `getHealth` function calling `GET /health`.

#### [MODIFY] [frontend/src/App.tsx](file:///c:/Users/Administrator/Desktop/app/rainflow-app/frontend/src/App.tsx)
- Import `createJob` service.
- Add state for `isCreatingJob`.
- Implement `handleCreateCampaign` function to trigger `createJob`.
- Replace "NEW CAMPAIGN" button `onClick` with `handleCreateCampaign`.
- Add simple toast/alert on success/error.

## Verification Plan

### Automated Tests
- None (Frontend testing infrastructure is minimal).

### Manual Verification
1.  **Deploy to VPS**: Push changes and pull on VPS.
2.  **Browser Test**:
    - Open http://54.219.178.244:5173.
    - Click "NEW CAMPAIGN".
    - Verify alert/toast confirms job creation.
    - Check Backend Logs (`pm2 logs rainflow-backend`) to see "Job added to queue".
