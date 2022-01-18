//package com.example.demo.controller;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import javax.servlet.http.HttpServletRequest;
//
///**
// * Created by ismail on 10/13/16.
// */
//
//@Controller
//public class MeetingController {
//    private static final Logger logger = LoggerFactory.getLogger(MeetingController.class);
//
//    /*Todo: Refactor to be done which should be passed to base controller*/
//
//
//
//
//    @GetMapping(value = "/{businessId}/cart/delete/{lineItemId}",
//            produces = MediaType.APPLICATION_JSON_VALUE)
//    @ResponseBody
//    public Object deleteCartItem(
//            @PathVariable String lineItemId,
//            @PathVariable(required = false) String businessId,
//            HttpServletRequest request) {
//
//        return null;
//    }
//
//
//
//
//
//}
