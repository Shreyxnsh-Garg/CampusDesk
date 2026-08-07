const Booking = require("../models/Booking");
const Resource = require("../models/Resource");

const createBooking = async (req, res) => {
    try {

        const { resource, date, startTime, endTime, purpose } = req.body;
        if (
            !resource ||
            !date ||
            !startTime ||
            !endTime ||
            !purpose
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        const foundResource = await Resource.findById(resource);
        if (!foundResource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found."
            });
        }
        if (!foundResource.isActive) {
            return res.status(400).json({
                success: false,
                message: "Resource is not available."
            });
        }

        // Check if user already has 2 confirmed bookings

        const activeBookings = await Booking.countDocuments({
            user: req.user.id,
            status: "confirmed"
        });

        if (activeBookings >= 2) {
            return res.status(400).json({
                success: false,
                message: "You can only have 2 active bookings at a time."
            });
        }

        // Get all bookings for this resource on this date

        const existingBookings = await Booking.find({
            resource,
            date,
            status: "confirmed"
        });

        const toMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const newStart = toMinutes(startTime);
        const newEnd = toMinutes(endTime);

        for (const booking of existingBookings) {

            const existingStart = toMinutes(booking.startTime);
            const existingEnd = toMinutes(booking.endTime);

            if (
                existingStart < newEnd &&
                existingEnd > newStart
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Resource is already booked during this time."
                });
            }
        }
        const booking = await Booking.create({
            user: req.user.id,
            resource,
            date,
            startTime,
            endTime,
            purpose
        });
        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getMyBookings = async (req, res) => {
    try {

        const { status } = req.query;

        const filter = {
            user: req.user.id
        };

        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .populate("resource", "name type location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const cancelBooking = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // Student can cancel only own booking
        if (
            req.user.role !== "admin" &&
            booking.user.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.",
            booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getAllBookings = async (req, res) => {
    try {

        const filter = {};

        if (req.query.resource) {
            filter.resource = req.query.resource;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.date) {
            filter.date = req.query.date;
        }

        const bookings = await Booking.find(filter)
            .populate("user", "name email")
            .populate("resource", "name type location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getResourceBookings = async (req, res) => {
    try {

        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required."
            });
        }

        const bookings = await Booking.find({
            resource: req.params.id,
            date,
            status: "confirmed"
        })
        .populate("user", "name email")
        .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};



module.exports = {
    createBooking,
    getMyBookings,
    getResourceBookings,
    cancelBooking,
    getAllBookings
};