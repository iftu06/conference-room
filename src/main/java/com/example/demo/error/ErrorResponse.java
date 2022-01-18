package com.example.demo.error;

import com.example.demo.model.ResponseObj;
import org.springframework.http.HttpStatus;

import java.util.Date;

public class ErrorResponse extends ResponseObj{


    private ErrorCode errorCode;

    private Date date;

    public ErrorResponse(HttpStatus status, String message, ErrorCode errorCode, Date date) {
        super(message,status);
        this.errorCode = errorCode;
        this.date = date;
    }




    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
