const cron = require("node-cron");
const Booking = require("../models/Booking");
const transporter = require("../config/mail");

// Runs every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log(
  "Booking Cron:",
  new Date().toLocaleTimeString()
);

    const now = new Date();

    // -----------------------------
    // Send Reminder Emails
    // -----------------------------
    const bookings = await Booking.find({
      status: "confirmed",
      reminderSent: false,
    })
      .populate("user")
      .populate("resource");

    for (const booking of bookings) {
      const bookingDate = new Date(booking.date);

      const [hour, minute] = booking.startTime.split(":");

      bookingDate.setHours(Number(hour));
      bookingDate.setMinutes(Number(minute));
      bookingDate.setSeconds(0);

      const diff =
        bookingDate.getTime() - now.getTime();

      // between 59 and 60 minutes
 if (
  diff > 0 &&
  diff <= 60 * 60 * 1000 &&
  !booking.reminderSent
){

        await transporter.sendMail({
          from: "Campus Desk <shreyansh7952@gmail.com>",
          to: booking.user.email,
          subject: "CampusDesk Booking Reminder",
          text: `Hi ${booking.user.name},

This is a reminder that your booking for ${booking.resource.name} starts soon.

Date: ${booking.date.toDateString()}
Time: ${booking.startTime} - ${booking.endTime}

Thank you.`,
        });

        booking.reminderSent = true;
        await booking.save();
      }
    }

    // -----------------------------
    // Mark Completed
    // -----------------------------
    const confirmedBookings = await Booking.find({
      status: "confirmed",
    });

    for (const booking of confirmedBookings) {

      const bookingEnd = new Date(booking.date);

      const [hour, minute] =
        booking.endTime.split(":");

      bookingEnd.setHours(Number(hour));
      bookingEnd.setMinutes(Number(minute));
      bookingEnd.setSeconds(0);

      if (bookingEnd < now) {

        booking.status = "completed";
        await booking.save();
      }
    }

  } catch (err) {
    console.error(err);
  }
});