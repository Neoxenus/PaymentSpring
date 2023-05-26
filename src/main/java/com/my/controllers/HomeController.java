package com.my.controllers;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    private final static Logger LOGGER = Logger.getLogger(HomeController.class);
    @GetMapping("/home")
    private String home(){
        LOGGER.info("Get -> /home");
        return "home";
    }
}
