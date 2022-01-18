package com.example.demo.service;

import com.example.demo.dto.MeetingRoomDto;
import com.example.demo.dto.ReserveRoomDto;
import com.example.demo.mapper.ReservationConverter;
import com.example.demo.model.MeetingRoom;
import com.example.demo.model.Reservation;
import com.example.demo.model.User;
import com.example.demo.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;


    //@PreAuthorize("hasRole('ADMIN') or #reservation.user.userId == principal.user.userId")
    public void cancel(Reservation reservation) {
        this.reservationRepository.delete(reservation);
    }

    public Reservation findOne(Integer reservationId) {
        return this.reservationRepository.findReservation(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "\n"
                        + "It is a reservation that does not exist."));
    }


    public List<Reservation> findReservations(User user) {
        String roles = user.getRolesFlat();
        if (!roles.contains("ADMIN")) {
            return this.reservationRepository
                    .findReservableRoomByStartTime(LocalDateTime.now(), user.getId());
        } else {
            return this.reservationRepository
                    .findReservableRoomByStartTimeForAdmin(LocalDateTime.now());
        }


    }

    public ReserveRoomDto reserveRoom(ReserveRoomDto reservationDto, User user) {
        Reservation reservation = ReservationConverter.convertToReservation(reservationDto);
        reservation.setUser(user);
        Reservation reserved = reservationRepository.save(reservation);
        return new ReserveRoomDto(reserved);
    }


}
