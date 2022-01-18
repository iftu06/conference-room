package com.example.demo.repository;

import com.example.demo.model.Reservation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Created by Divineit-Iftekher on 8/9/2017.
 */
@Repository
public interface ReservationRepository extends CrudRepository<Reservation, Integer> {


    @Query(value = "select t from Reservation t where t.reservationId = ?1  ")
    public Optional<Reservation> findReservation(Integer reservationId);

    @Query(value = "select t from Reservation t where  " +
            "       t.startTime >= ?1 and t.user.id = ?2 order by t.startTime")
    public List<Reservation> findReservableRoomByStartTime(LocalDateTime reservationTime, Integer userId);

    @Query(value = "select t from Reservation t where  " +
            "       t.startTime >= ?1 order by t.startTime")
    public List<Reservation> findReservableRoomByStartTimeForAdmin(LocalDateTime reservationTime);


}
