# Database Schema Specification
> This document outlines the database structure required for the **Tambo Health App**. It provides specifications for both **Firebase (NoSQL)** and **Supabase (PostgreSQL)** implementations. A developer should pick one provider and implement according to these specs.

## Data Models Overview

The application requires tracking the following core entities:
1.  **Patients**
2.  **Prescriptions**
3.  **Lab Orders & Results**
4.  **Symptoms**
5.  **Vitals History**

---

## Option A: Firebase (Cloud Firestore)

Firestore is a NoSQL document database. Data should be structured in collections.

### Collection: `patients`
-   **Document ID:** (auto-generated or mapped from auth)
-   **Fields:**
    -   `name` (string)
    -   `age` (number)
    -   `gender` (string)
    -   `createdAt` (timestamp)

### Collection: `prescriptions`
-   **Document ID:** (auto-generated)
-   **Fields:**
    -   `patientId` (string, ref: `users/{uid}`)
    -   `medicationName` (string)
    -   `dosage` (string)
    -   `instructions` (string)
    -   `status` (string: 'pending' | 'ready_for_pickup' | 'picked_up')
    -   `prescribedAt` (timestamp)
    -   `filledAt` (timestamp, optional)

### Collection: `lab_orders`
-   **Document ID:** (auto-generated)
-   **Fields:**
    -   `patientId` (string, ref: `users/{uid}`)
    -   `testName` (string)
    -   `status` (string: 'ordered' | 'processing' | 'completed')
    -   `orderedAt` (timestamp)
    -   `completedAt` (timestamp, optional)
    -   `results` (array of objects, optional):
        -   `{ parameter: string, value: string, unit: string, range: string, flag: string }`
    -   `notes` (string, optional)

### Collection: `symptoms`
-   **Document ID:** (auto-generated)
-   **Fields:**
    -   `patientId` (string, ref: `users/{uid}`)
    -   `region` (string)
    -   `description` (string)
    -   `severity` (string: 'mild' | 'moderate' | 'severe')
    -   `recordedAt` (timestamp)

### Collection: `vitals`
-   **Document ID:** (auto-generated)
-   **Fields:**
    -   `patientId` (string, ref: `users/{uid}`)
    -   `type` (string: 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen_sat')
    -   `value` (number)
    -   `meta` (string, optional)
    -   `recordedAt` (timestamp)

---

## Option B: Supabase (PostgreSQL)

Supabase is a relational SQL database. Use the following DDL to create tables.

### 1. Patients Table
```sql
create table patients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  age integer,
  gender text
);
```

### 2. Prescriptions Table
```sql
create table prescriptions (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) not null,
  medication_name text not null,
  dosage text,
  instructions text,
  status text check (status in ('pending', 'ready_for_pickup', 'picked_up')) default 'pending',
  prescribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  filled_at timestamp with time zone
);
```

### 3. Lab Orders Table
```sql
create table lab_orders (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) not null,
  test_name text not null,
  status text check (status in ('ordered', 'processing', 'completed')) default 'ordered',
  ordered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  notes text,
  results jsonb -- Stores array of result objects
);
```

### 4. Symptoms Table
```sql
create table symptoms (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) not null,
  region text not null,
  description text,
  severity text check (severity in ('mild', 'moderate', 'severe')),
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 5. Vitals Table
```sql
create table vitals (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) not null,
  type text check (type in ('heart_rate', 'blood_pressure', 'temperature', 'oxygen_sat')) not null,
  value numeric not null,
  meta text, -- For string representations like "120/80"
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Implementation Notes
-   **Authentication:** Both providers offer Auth (Firebase Auth / Supabase Auth). Ensure RLS (Row Level Security) or Firestore Rules enforce that users can only access their own data (`patientId == auth.uid`).
-   **Realtime:** Use Firestore `onSnapshot` or Supabase `subscribe` to maintain the live dashboard updates currently simulated in the frontend.
