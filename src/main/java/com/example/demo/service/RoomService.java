package com.example.demo.service;

import com.example.demo.dto.MeetingRoomDto;
import com.example.demo.model.MeetingRoom;
import com.example.demo.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class RoomService {

    @Autowired
    private MeetingRoomRepository meetingRoomRepository;

    public RoomService(MeetingRoomRepository meetingRoomRepository) {
        this.meetingRoomRepository = meetingRoomRepository;
    }

    public MeetingRoomDto findMeetingRoom(Integer roomId) {
        return this.meetingRoomRepository.findRoom(roomId)
                .map(MeetingRoomDto::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found"));
    }

    public MeetingRoomDto saveRoom(MeetingRoom meetingRoom){
        MeetingRoom savedRoom = meetingRoomRepository.save(meetingRoom);
        return new MeetingRoomDto(savedRoom);
    }

    public List<MeetingRoomDto> roomList(){
        return meetingRoomRepository.findAllRoom()
        .stream()
        .map(MeetingRoomDto::new)
        .collect(Collectors.toList());
    }

}
