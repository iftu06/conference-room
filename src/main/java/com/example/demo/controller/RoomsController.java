package com.example.demo.controller;

import com.example.demo.ResponseContanier;
import com.example.demo.dto.MeetingRoomDto;
import com.example.demo.error.Error;
import com.example.demo.model.MeetingRoom;
import com.example.demo.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class RoomsController {

    @Autowired
    private RoomService roomService;


    @GetMapping(value = "/room")
    public String room(Model model) {
        List<MeetingRoomDto> rooms = roomService.roomList();
        model.addAttribute("rooms", rooms);
        return "room";
    }

    @PostMapping(value = "/room", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Object saveRoom(@RequestBody MeetingRoom meetingRoom, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<Error> errors = bindingResult.getFieldErrors().stream().map(error ->
                    Error.builder().field(error.getField()).message(error.getDefaultMessage()).build())
                    .collect(Collectors.toList());

            return ResponseContanier.builder().status("error").response(errors).build();

        } else {
            MeetingRoomDto dto = roomService.saveRoom(meetingRoom);
            return ResponseContanier.builder().status("success")
                    .response(dto)
                    .build();
        }

    }

    @GetMapping(value = "/rooms")
    public String rooms(Model model) {
        List<MeetingRoomDto> rooms = roomService.roomList();
        model.addAttribute("rooms", rooms);
        return "roomList";
    }

    @GetMapping(value = "/rooms/{id}")
    @ResponseBody
    public ResponseContanier getRoom(@PathVariable Integer id) {
        MeetingRoomDto meetingRoomDto = roomService.findMeetingRoom(id);
        return ResponseContanier.builder()
                .status("success")
                .response(meetingRoomDto)
                .build();
    }


}
