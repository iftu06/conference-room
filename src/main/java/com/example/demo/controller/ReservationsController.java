package com.example.demo.controller;


import com.example.demo.ResponseContanier;
import com.example.demo.Validate.ReservationValidator;
import com.example.demo.dto.DashBoardView;
import com.example.demo.dto.MeetingRoomDto;
import com.example.demo.dto.ReserveRoomDto;
import com.example.demo.error.Error;
import com.example.demo.model.MeetingRoom;
import com.example.demo.model.Reservation;
import com.example.demo.model.User;
import com.example.demo.service.ReservationService;
import com.example.demo.service.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Controller
public class ReservationsController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private RoomService roomService;

    @Autowired
    ReservationValidator reservationValidator;


    @GetMapping("/reservation-view")
    public String reservation(Model model) {
        List<MeetingRoomDto> rooms = roomService.roomList();
        model.addAttribute("rooms", rooms);
        return "reserveRoom";
    }

    @PostMapping(value = "/reserve", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object reserveRoom(@AuthenticationPrincipal User user,
                              @Valid @RequestBody ReserveRoomDto reserveRoomDto,
                              BindingResult bindingResult) {

        reservationValidator.validate(reserveRoomDto, bindingResult);
        if (bindingResult.hasErrors()) {
            List<Error> errors = bindingResult.getFieldErrors().stream().map(error ->
                    Error.builder().field(error.getField()).message(error.getDefaultMessage()).build())
                    .collect(Collectors.toList());

            return ResponseContanier.builder().status("error").response(errors).build();

        } else {
            ReserveRoomDto reserveRoomDto1 = reservationService.reserveRoom(reserveRoomDto, user);
            return ResponseContanier.builder().status("success")
                    .response(reserveRoomDto1)
                    .build();
        }

    }


    @GetMapping("/reservation-room-frag")
    public String reservationRoomFragment(Model model) {
        List<MeetingRoomDto> rooms = roomService.roomList();
        model.addAttribute("rooms", rooms);
        return "reserveRoomFragment";
    }

    private static String nextMeeting(List<ReserveRoomDto> reservationsDash){
        if (!reservationsDash.isEmpty() && reservationsDash.size() > 1) {
            ReserveRoomDto nextMeeting = reservationsDash.get(1);
            if (nextMeeting != null) {
                return nextMeeting.getEvent().getEventTitle();
            }
        }
        return "";
    }

    @GetMapping("/reservation-dash")
    public String reservationDashBoard(Model model, @AuthenticationPrincipal User user) {

        List<Reservation> reservations = reservationService.findReservations(user);
        Map<String, List<ReserveRoomDto>> reserveRoomDtoMap = reservations.stream()
                .map(reservation -> new ReserveRoomDto(reservation))
                .collect(Collectors.groupingBy(reservation -> reservation.getMeetingRoom().getRoomName()));
        Iterator<Map.Entry<String, List<ReserveRoomDto>>> it = reserveRoomDtoMap.entrySet().iterator();
        List<DashBoardView> dashBoardViews = new ArrayList<>();
        while (it.hasNext()) {
            Map.Entry<String, List<ReserveRoomDto>> entry = it.next();

            dashBoardViews.add(DashBoardView.builder()
                    .reserveRoomDtos(entry.getValue())
                    .roomName(entry.getKey())
                    .nextMetting(nextMeeting(entry.getValue()))
                    .build());
        }


        model.addAttribute("dashBoardViews", dashBoardViews);
        return "reservation-dash";
    }


}
