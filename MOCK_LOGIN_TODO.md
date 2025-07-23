### Re-enable Mock Login

**Objective:** Restore the mock login functionality for the admin application.

**To-Do List:**

1.  **Re-enable Mock User in `App.tsx`**
    - [ ] Uncomment the code that creates the mock user in local storage.

2.  **Verify `FirebaseProtectedRoute.tsx`**
    - [ ] Ensure the protected route component correctly handles the mock user and redirects to the login page if the mock user is not present.

3.  **Test the Login Flow**
    - [ ] Clear local storage to simulate a new user.
    - [ ] Verify that the application redirects to the login page.
    - [ ] Log in using the mock credentials and confirm that the admin page is accessible.