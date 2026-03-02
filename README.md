# Fastbreak AI Dev Challenge

## Overview

This is a simple event management application that allows users to create, edit, and archive events. 

This web app can viewed at `https://fastbreak-challenge-roan.vercel.app`

Technical Requirements:
- Framework: Next.js 15+ (App Router)
- Language: TypeScript
- Database: Supabase
- Styling: Tailwind CSS
- UI Components: Shadcn
- Deployment: Vercel
- Authentication: Supabase Auth

Core Requirements:
- Authentication
  - Sign up / Login with email & password or Google OAuth Sign-in
  - Protected routes (redirect to login if not authenticated)
  - Logout functionality
- Dashboard
  - When users login, they should be taken to a home page / dashboard that:
    - Display list of all sports events
    - Show key event details: name, date, venue, sport type
    - Navigate to create/edit event forms
    - Responsive grid/list layout
    - Search by name, filter by sport - should refetch from the database
- Event Management
  - User should be able to create events:
    - Event name
    - Sport type (e.g., Soccer, Basketball, Tennis)
    - Date & Time
    - Description
    - Venues (Plural)
  - User should be able to edit events
  - User should be able to delete events


### Build

To run this app locally, clone the repo and run `npm install`.
Make sure you have a Supabase account and have the following environment variables set in your `.env.local` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL` # This is the connection string to your Supabase database for the business logic layer

On first run, the app will create a `db_versions` table in your Supabase database for tracking database migrations.

When new migrations are added to the `lib/db/db_migrate` directory, they will be applied to the database on app startup. If a migration fails, the app will throw an error and stop.
Database migrations are handled sequentially, and their file name should be in the format of `<version>.sql`, where `<version>` is an incrementing integer starting at 1.

Run the app with `npm run dev`.

## Design Considerations

### Database

I chose to use `pg` and raw SQL queries for the database layer so that I could have more control over the schemas and queries and avoid the overhead of an ORM. By using raw SQL queries, I can write more performant queries, create indexes as necessary, and take full advantage of Postgres' features.
Writing my own database module gives me much greater flexibility in how the module is used and allows me to build upon it in the future.
The database layer is organized into three main tables- `events`, `venues`, and `event_venues`, where `event_venues` is a join table for many-to-many relationships between events and venues. This allows for more performance and flexibility in their relationship, as opposed to joining on `venues` with an `event_venue_ids` array column that can't maintain referential integrity.

### UI

For the UI, I heavily leaned on `shadcn/ui` for the components and `sonner` for toast notifications. This allowed me to create a modern, responsive, and accessible UI with minimal effort. UI development is not my strong suit, so I focused on creating a clean and intuitive interface that was easy to use.
All timestamps are stored in UTC and converted to the user's local time on the client side.

### Testing

Some brief tests were included in the `__tests__` directory, implemented with `vitest` because of its integration with `next`. The tests cover the use of the `actionClient` and the database `file` function. More tests could be added to ensure that server actions and the UI layer function as expected.

## Future Improvements

For the search functionality, I chose to use `ILIKE` against the `event_name` column instead of a Postgres extension like `pg_trgm` due to the simplicity of this challenge. For a production application, I would use `pg_trgm` and a GIN index for fuzzy search. 

As more events are created, I would consider adding pagination to the search results and `getEvents` action, as well as creating a dedicated view for user-created events (The query for this already exists in `db/events/get_by_user_id.sql`). 

While outside the scope of this challenge, I would also add a way for users to create and manage their own venues. It could be integrated with Google Places API to provide a more seamless experience in searching for and selecting venues.

With more time, I would consider adding an `event_sports` table to allow for multiple sports per event.

Testing could also be improved, with more tests for the database layer to ensure that the queries return the expected results. E2E tests could also be added to ensure that the UI layer functions as expected.
