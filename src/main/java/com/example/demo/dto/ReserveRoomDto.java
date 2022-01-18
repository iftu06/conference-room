package com.example.demo.dto;

import com.example.demo.model.MeetingRoom;
import com.example.demo.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by Divineit-Iftekher on 1/16/2018.
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReserveRoomDto {

    private Integer reservationId;

    private String reservationDate;

    private String startHour;

    private String endHour;

    private EventDto event;

    private MeetingRoomDto meetingRoom;

    public ReserveRoomDto(Reservation reservation) {
        this.reservationId = reservation.getReservationId();
        this.reservationDate = reservation.getReservationDate();
        this.startHour = reservation.getStartHour();
        this.endHour = reservation.getEndHour();
        this.event = new EventDto();
        this.event.eventId = reservation.getEvent().getEventId();
        this.event.eventTitle = reservation.getEvent().getEventTitle();
        this.event.hostBy = reservation.getEvent().getHostBy();
        this.event.participants = reservation.getEvent().getParticipants();
        this.meetingRoom = new MeetingRoomDto();
        this.meetingRoom.roomId = reservation.getMeetingRoom().getRoomId();
        this.meetingRoom.roomName = reservation.getMeetingRoom().getRoomName();
        this.meetingRoom.roomNum = reservation.getMeetingRoom().getRoomNum();
    }



}
