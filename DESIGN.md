# Concurrency-Safe Booking Design

Whenever a user tries to book a resource, the system first checks if that resource is already booked for the date and time that the user selected.

Then it looks at all confirmed bookings and compares the requested time with all other bookings. If there is any overlap,the booking is not allowed and an error message is shown.

If there is no overlap,the booking is successfully done.

The bookings that were cancelled are ignored,so that the other users can book those time slots again.

This prevents two users from booking the same resource at the same time.
