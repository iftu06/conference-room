package com.example.demo.config;

/**
 * Created by Divineit-Iftekher on 4/9/2018.
 */
import javax.servlet.http.HttpServletRequest;

/**
 * Created by IntelliJ IDEA.
 * User: audestick@gmail.com
 * Date: 2016/11/17 0017
 * To change this template use File | Settings | File Templates.
 */
public class WebUtil {

  public static  boolean isAjax(HttpServletRequest request) {
    return (request.getHeader("X-Requested-With") != null && "XMLHttpRequest".equals(request.getHeader("X-Requested-With").toString()));
  }


  public  void toJson() {

  }


//  public static  String ip(HttpServletRequest request) {
//    if (request == null) {
//      return "";
//    }
//    String ip = request.getHeader("x-forwarded-for");
//    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//      ip = request.getHeader("Proxy-Client-IP");
//    }
//    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//      ip = request.getHeader("WL-Proxy-Client-IP");
//    }
//    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//      ip = request.getRemoteAddr();
//    }
//    if (ip == null) {
//      ip = "";
//    }
//    if (ip != null && ip.equals("0:0:0:0:0:0:0:1")) {
//      ip = "";
//    }
//    return ip;
//  }
}
