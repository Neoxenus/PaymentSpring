package com.my.controllers;

import com.my.dto.UserDTO;
import com.my.entities.User;
import com.my.entities.enums.Block;
import com.my.repositories.UserRepository;
import com.my.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.SessionScope;


import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
@AllArgsConstructor
@Lazy
@SessionScope
public class UserController extends SecurityContextLogoutHandler {
    //private final ClientRegistration registration;
    //private ClientRegistrationRepository clientRegistrationRepository;
    private UserRepository userRepository;
    private UserService userService;

    private final static Logger LOGGER = Logger.getLogger(UserController.class);
//    public UserController(ClientRegistrationRepository registrations) {
//        this.registration = registrations.findByRegistrationId("auth0");
//    }


    @PostMapping("/login")
    public ResponseEntity<?> login(HttpSession session, HttpServletRequest req, @RequestBody UserDTO user) {


        try {
            User DBUser = userService.login(user.getEmail(), user.getPassword());
            session.setAttribute("user", DBUser);
            return ResponseEntity.ok().body(DBUser);
        }catch (IllegalStateException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        userService.logout();
        session.setAttribute("user", null);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/registration")
    public ResponseEntity<?> registration(@RequestBody User user) {

        try {
            User savedUser = userService.signUpUser(user);
            return ResponseEntity.ok().body(savedUser);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(HttpSession session, @AuthenticationPrincipal UserDetails user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//        if (authentication != null && authentication.isAuthenticated()) {
//            Object principal = authentication.getPrincipal();
//
//            if (principal instanceof UserDetails) {
//                System.out.println(((UserDetails) principal).getUsername());
//                return ResponseEntity.ok((UserDetails) principal);
//            } else {
//                System.out.println(principal.toString());
//                // if principal is a simple String (like when using a token-based auth system)
//                return null;
//            }
//        }
        User sessionUser = (User) session.getAttribute("user");
        return ResponseEntity.ok().body(sessionUser); // or throw an exception if you prefer


    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }


}
