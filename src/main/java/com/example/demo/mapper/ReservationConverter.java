package com.example.demo.mapper;

import com.example.demo.Utillity.DateUtil;
import com.example.demo.dto.ReserveRoomDto;
import com.example.demo.model.MeetingRoom;
import com.example.demo.model.Reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ReservationConverter {

    public static Reservation convertToReservation(ReserveRoomDto reserveRoomDto){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a");
        MeetingRoom meetingRoom = MeetingRoom.builder()
                .roomId(reserveRoomDto.getMeetingRoom().getRoomId())
                .build();

        LocalDateTime startTime = DateUtil.convertToDateTime(formatter,
                reserveRoomDto.getReservationDate(),reserveRoomDto.getStartHour());
        LocalDateTime endTime = DateUtil.convertToDateTime(formatter,
                reserveRoomDto.getReservationDate(),reserveRoomDto.getEndHour());

        return Reservation.builder()
                .startTime(startTime)
                .endTime(endTime)
                .reservationDate(reserveRoomDto.getReservationDate())
                .startHour(reserveRoomDto.getStartHour())
                .endHour(reserveRoomDto.getEndHour())
                .event(EventMapper.convertToEvent(reserveRoomDto.getEvent()))
                .meetingRoom(meetingRoom)
                .build();
    }


}
