package com.example.demo.dto;

import com.example.demo.model.Event;
import com.example.demo.model.MeetingRoom;
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
public class EventDto {

    public Integer eventId;
    public String eventTitle;
    public String participants;
    public String hostBy;

    public EventDto(Event event) {
        this.eventId = event.getEventId();
        this.eventTitle = event.getEventTitle();
        this.participants = event.getParticipants();
        this.hostBy = event.getHostBy();

    }

}
