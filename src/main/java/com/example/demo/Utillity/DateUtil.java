package com.example.demo.Utillity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    public static LocalDateTime convertToDateTime(DateTimeFormatter df,String date,String time){
        String dateTimeStr = date + " "+ time;
        return LocalDateTime.parse(dateTimeStr,df);
    }


}
