# Mini User Management System - Project TODO

## Backend Requirements

### Authentication Features
- [x] User signup endpoint with email, password, full name
- [x] Email format validation on signup
- [x] Password strength validation on signup
- [x] Authentication token generation on signup
- [x] User login endpoint with email and password
- [x] Credentials verification on login
- [x] Authentication token generation on login
- [x] Get current user information endpoint
- [x] User logout functionality

### User Management - Admin Functions
- [x] View all users endpoint with pagination
- [x] Activate user account endpoint
- [x] Deactivate user account endpoint

### User Management - User Functions
- [x] View own profile information endpoint
- [x] Update full name and email endpoint
- [x] Change password endpoint

### Security Requirements
- [x] Password hashing with bcrypt
- [x] Protected routes with authentication verification
- [x] Role-based access control (admin/user)
- [x] Input validation on all endpoints
- [x] Consistent error response format
- [x] Proper HTTP status codes
- [x] Environment variables for JWT secret

## Frontend Requirements

### Login Page
- [x] Email and password input fields
- [x] Client-side form validation
- [x] Redirect to dashboard on success
- [x] Error message display
- [x] Link to signup page

### Signup Page
- [x] Full name, email, password, confirm password inputs
- [x] Required field validation
- [x] Email format validation
- [x] Password strength validation
- [x] Password confirmation matching
- [x] Server-side error display
- [x] Redirect to login on success

### Admin Dashboard
- [x] Table displaying all users
- [x] Columns: email, full name, role, status, actions
- [x] Pagination (10 users per page)
- [x] Activate user button
- [x] Deactivate user button

### User Profile Page
- [x] Display user profile information
- [x] Edit full name and email
- [x] Change password form
- [x] Logout button

### Home/Landing Page
- [x] Landing page with feature overview
- [x] Login and signup links
- [x] Feature highlights
- [x] Responsive design

## Testing & Deployment
- [x] Write vitest tests for authentication endpoints
- [x] Write vitest tests for user management endpoints
- [x] Test complete authentication flow
- [x] Test role-based access control
- [x] All 25 tests passing
- [x] Prepare deployment configuration
