package com.example.demo.repository;

import com.example.demo.model.MeetingRoom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Created by Divineit-Iftekher on 8/9/2017.
 */
@Repository
public interface MeetingRoomRepository extends CrudRepository<MeetingRoom,Integer> {

    @Query(value = "SELECT r from MeetingRoom r WHERE r.roomId = ?1")
    public Optional<MeetingRoom> findRoom (Integer id);

    @Query(value = "SELECT r from MeetingRoom r")
    public List<MeetingRoom> findAllRoom();

}
