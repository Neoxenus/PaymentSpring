package com.my.controllers;

import org.apache.log4j.Logger;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.context.annotation.SessionScope;

@Controller
@SessionScope
public class HomeController {
    private final static Logger LOGGER = Logger.getLogger(HomeController.class);
    @GetMapping("/home")
    private String home(){
        LOGGER.info("Get -> /home");
        return "home";
    }
}
