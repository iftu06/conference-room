package com.example.demo.dto;

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
public class MeetingRoomDto {

    public Integer roomId;

    public String roomName;

    public String roomNum;

    public MeetingRoomDto(MeetingRoom meetingRoom) {
        this.roomId = meetingRoom.getRoomId();
        this.roomName = meetingRoom.getRoomName();
        this.roomNum = meetingRoom.getRoomNum();

    }

}
