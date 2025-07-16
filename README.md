## Getting Started

First, run the development server:

```bash
npm run dev

npx drizzle-kit push

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

* First User will be Registered with valid email
    All the fields are validation

* Once you register you get the confirmation mail

* just Click on open the mail for confirmation

* You can get the Token

* Then you can login with credentials
   Email and password field with validations

* once you login you can see the dashboard page along with role based access for Edit Delete   

* If its admin they can allow to Edit and Delete all the users

* Or else if you are user you can see the user detail and you can edit only your profile

Technology 

 Next.js (App Router + SSR)
 Supabase (Auth + PostgreSQL)
 Supabase CLI
 Drizzle ORM
 Tailwind 

Following by below the instruction
 Full user authentication (Supabase)
 Role-based access control (Admin/User)
 CRUD APIs using Drizzle ORM
 Supabase-managed database with migrations
 Frontend interactions using Axios
 Server-side authentication using cookies (no token exposure)

Use Case
You are building a business dashboard where:
 Users can sign up and log in.
 Each user belongs to a role: either admin or user
 Admins can manage a list of businesses (CRUD).
 Users can only view their own business profile.




