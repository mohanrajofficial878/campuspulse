CampusPulse Admin Login Add-on
================================

Included:
- admin.html: a standalone admin dashboard prototype.
- Admin ID: 4146
- Password: 4146
- Manage class timetable entries.
- Manage exam timetable entries (course code, subject, date, FN/AN).
- Manage batch/project members.
- Edit dashboard information/notices.
- Export JSON backup.

HOW TO TRY IT
1. Extract this ZIP.
2. Open admin.html in a modern browser.
3. Sign in with ID 4146 and password 4146.
4. Add/edit/delete timetable, exam, batch, or notice entries.
5. Data is saved in the browser's localStorage.

IMPORTANT LIMITATION
This is a frontend prototype, not a secure live admin system. The ID/password are visible in the HTML source and can be bypassed by a technical user. Changes are stored only in the browser/device where the admin page is opened. They do NOT automatically update the existing public CampusPulse student website, and they do NOT sync to other students/devices.

For real deployment:
- Keep the existing website.
- Deploy a backend API and database (for example, Node.js + PostgreSQL/SQLite on a suitable host).
- Verify admin credentials on the server, store passwords as secure hashes, use HTTPS and secure sessions.
- Connect both student and admin pages to the same API/database.
- Do not put real student personal data into this prototype.
