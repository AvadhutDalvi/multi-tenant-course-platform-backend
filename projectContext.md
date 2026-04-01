🚀 PROJECT CONTEXT DOCUMENT
Multi-Tenant SaaS Course Platform (Shopify for Educators)
1️⃣ PROBLEM STATEMENT
🎯 Core Problem

Small and independent educators face major barriers when trying to monetize their knowledge online.

Challenges They Face:

No technical infrastructure

Building a custom website is expensive

Payment integration is complex

Student management is difficult

Progress tracking requires backend logic

Hosting videos and structured content needs engineering

Managing authentication and security is hard

As a result:

👉 Many educators cannot monetize their content efficiently.

2️⃣ OUR SOLUTION

We are building:

A Multi-Tenant SaaS Course Platform
Similar to Shopify, but for educators.

Instead of building their own platform, educators:

Register on our platform

Create courses

Upload lectures

Set pricing

Manage students

And our system handles:

Authentication

Authorization

Course storage

Lecture storage

Payment simulation

Enrollment logic

Progress tracking

Role-based access

3️⃣ SYSTEM TYPE
Multi-Tenant SaaS Application

Meaning:

Multiple educators share the same infrastructure

Each educator owns their courses

Students can purchase courses

Data isolation happens logically through relationships

All users share one backend and one database

4️⃣ USER ROLES (RBAC)

We use Role-Based Access Control (RBAC).

Roles:

Student

Educator

Admin (platform owner)

Authorization is handled using:

JWT authentication

Role middleware

5️⃣ TECHNOLOGY STACK
Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

bcrypt

Role-based middleware

Frontend

React (Vite)

React Router

Axios

TailwindCSS

Context API for authentication

6️⃣ DATABASE DESIGN (DETAILED)
User Schema
{
  name,
  email,
  password,
  role: ["student", "educator", "admin"],
  createdAt
}

Purpose:

Single unified user collection

Role determines behavior

Course Schema
{
  title,
  description,
  price,
  imageURL,
  educator: ObjectId (ref: users),
  lectures:[],
  createdAt
}

Design Decision:

Each course belongs to one educator

We DO NOT store lecture arrays inside course

We use relational reference

Lecture Schema
{
  title,
  videoUrl,
  course: ObjectId (ref: courses)
}

Design Decision:

Separate collection for scalability

Avoid large embedded arrays

Efficient querying

Better scaling for many lectures

Purchase Schema
{
  student: ObjectId (ref: users),
  course: ObjectId (ref: courses),
  createdAt
}

Purpose:

Represents enrollment

One purchase per student per course

Progress Schema
{
  student: ObjectId,
  course: ObjectId,
  completedLectures: [ObjectId],
  percentage: Number
}

Important Design:

Created only after purchase

Stores completed lecture IDs

Stores computed percentage

7️⃣ BACKEND ARCHITECTURE
backend/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 ├── config/
 └── index.js
Authentication Flow

User logs in

Server verifies credentials

JWT generated with:

id

role

Token sent to frontend

Frontend stores in localStorage

Axios interceptor attaches token

Middleware verifies token

Role middleware enforces permissions

8️⃣ STUDENT FLOW

Login

Browse courses

Purchase course

Progress document created

Access enrolled courses

View lectures

Mark lecture complete

Progress percentage recalculated

Progress bar updated

9️⃣ EDUCATOR FLOW

Login as educator

Create course

Fetch own courses

Add lectures to course

Manage content

🔟 FRONTEND ARCHITECTURE
frontend/
 ├── pages/
 │    ├── student/
 │    ├── educator/
 ├── layouts/
 ├── routes/
 ├── context/
 ├── services/
AuthContext Design

We use 3 states:

undefined → loading

null → not logged in

object → logged in user

Prevents redirect race conditions.

ProtectedRoute Logic

If loading → show spinner

If null → redirect to login

Else → render dashboard

Axios Interceptor

Automatically attaches:

Authorization: Bearer <token>

To all requests.

1️⃣1️⃣ CURRENT PROJECT STATUS
✅ Completed Backend

Signup

Login

JWT auth

Role middleware

Course creation

Lecture creation

Purchase logic

Enrollment logic

Progress tracking

GET enrolled courses

GET educator courses

✅ Completed Frontend

Login page

Register page

Protected dashboard

Role-based sidebar

Student enrolled courses page

Course learning page

Progress bar

Mark complete functionality

Educator MyCourses page

Create course UI

1️⃣2️⃣ DESIGN DECISIONS EXPLAINED
Why Separate Lecture Collection?

Pros:

Scalable

Efficient queries

Avoid document growth

Cleaner relational logic

Cons:

Requires extra queries

Decision:
Scalability > convenience

Why Progress Separate?

Pros:

Per student

Efficient updates

Cleaner state management

Why Not Store Courses in Educator Array?

Because:

Not scalable for many courses

Mongo document size limit

Better to query by reference

1️⃣3️⃣ BUSINESS MODEL

This is designed as:

Platform-as-a-Service

Future monetization:

Commission per course sale

Monthly subscription for educators

Premium analytics

AI recommendations

1️⃣4️⃣ FUTURE ROADMAP
Phase 2

Manage course page

Add lecture UI

Delete lecture

Edit lecture

Educator analytics

Phase 3

Search & filtering

Ratings & reviews

Course preview page

Stripe payment integration

Video streaming service integration

Cloud storage

Phase 4

AI features

Personalized recommendations

Course completion certificates

1️⃣5️⃣ ARCHITECTURE GOALS

We aim for:

Clean separation of concerns

Scalable Mongo relationships

Proper RBAC

Stateless backend

Multi-tenant safety

Professional folder structure

1️⃣6️⃣ CURRENT FOCUS

We are currently building:

Educator Dashboard → Manage Course → Add Lecture UI → Lecture Listing UI

FINAL SUMMARY

This is not a CRUD project.

This is:

Multi-tenant SaaS architecture

Role-based full-stack system

Stateful learning engine

Real-world monetization model

Scalable Mongo design

Proper authentication lifecycle