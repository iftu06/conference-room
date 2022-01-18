package com.example.demo.mapper;

import com.example.demo.Utillity.DateUtil;
import com.example.demo.dto.EventDto;
import com.example.demo.dto.ReserveRoomDto;
import com.example.demo.model.Event;
import com.example.demo.model.Reservation;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EventMapper {

    public static Event convertToEvent(EventDto eventDto){
        return Event.builder()
                .eventTitle(eventDto.eventTitle)
                .hostBy(eventDto.hostBy)
                .participants(eventDto.participants)
                .build();
    }

}
