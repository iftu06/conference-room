package com.example.demo.model;

import javax.persistence.Embeddable;

/**
 * Created by Divineit-Iftekher on 10/16/2017.
 */
@Embeddable
public class Location {

    private String latitude;

    private String longitude;

    private String street;

    private String roadNo;


    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getRoadNo() {
        return roadNo;
    }

    public void setRoadNo(String roadNo) {
        this.roadNo = roadNo;
    }
}
