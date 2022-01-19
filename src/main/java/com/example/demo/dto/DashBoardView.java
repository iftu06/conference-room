package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashBoardView {
    public String roomName;
    public List<ReserveRoomDto> reserveRoomDtos;
    public String nextMetting;
}
