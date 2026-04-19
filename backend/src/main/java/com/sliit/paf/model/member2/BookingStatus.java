package com.sliit.paf.model.member2;

public enum BookingStatus {
    PENDING,     // Booking submitted, waiting for admin
    APPROVED,
    REJECTED,
    CANCELLED    // User cancelled their own booking
}
