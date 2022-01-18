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
public class UserController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/login")
    public String loginView(Model model) {
        return "login";
    }

    @GetMapping("/home")
    public String home(Model model) {
        return "index";
    }


}
