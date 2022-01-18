package com.example.demo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseContanier {

    private String status;
    private Object response;

}
