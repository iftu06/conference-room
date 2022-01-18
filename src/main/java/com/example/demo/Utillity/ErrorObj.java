package com.example.demo.Utillity;

/**
 * Created by Divineit-Iftekher on 12/16/2017.
 */
public class ErrorObj {
    private String fieldName;
    private String errorMsg;

    public ErrorObj(String fieldName, String errorMsg) {
        this.fieldName = fieldName;
        this.errorMsg = errorMsg;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
