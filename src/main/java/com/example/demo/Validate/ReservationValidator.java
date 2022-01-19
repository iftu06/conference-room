package com.example.demo.Validate;

import com.example.demo.Utillity.DateUtil;
import com.example.demo.dto.ReserveRoomDto;
import com.example.demo.model.Reservation;
import com.example.demo.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ReservationValidator implements Validator {
    @Autowired
    ReservationRepository reservationRepository;

    @Override
    public boolean supports(Class<?> aClass) {
        return ReserveRoomDto.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        ReserveRoomDto reservation = (ReserveRoomDto) o;
        String reservationDate = reservation.getReservationDate();
        String reservationStartHour = reservation.getStartHour();
        String reservationEndHour = reservation.getEndHour();
        Integer roomId = reservation.getMeetingRoom().getRoomId();

        if (StringUtils.isEmpty(reservationDate)) {
            errors.rejectValue("reservationDate", null, "Reservation Date can not be empty");
            return;
        }

        LocalDateTime startTime = DateUtil.convertToDateTime(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a"),
                reservationDate, reservationStartHour);
        LocalDateTime endTime = DateUtil.convertToDateTime(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a"),
                reservationDate, reservationEndHour);

        List<Reservation> reservations1 = reservationRepository.findReservationBetween(startTime, roomId);
        List<Reservation> reservations2 = reservationRepository.findReservationBetween(endTime, roomId);

        if (!reservations1.isEmpty()) {
            errors.rejectValue("reservationDate", null, "Start Time Overlap with other meetings");
        }

        if (!reservations2.isEmpty()) {
            errors.rejectValue("reservationDate", null, "End Time Overlap with other meetings");
        }

    }
}
