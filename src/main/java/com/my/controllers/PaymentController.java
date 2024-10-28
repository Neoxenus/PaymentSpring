package com.my.controllers;

import com.my.dto.PaymentDTO;
import com.my.entities.Account;
import com.my.entities.Payment;
import com.my.entities.User;
import com.my.services.AccountService;
import com.my.services.PaymentService;
import com.my.services.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.SessionScope;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Lazy
@SessionScope
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;
    //private User defaultUser;
    private final static Logger LOGGER = Logger.getLogger(AccountController.class);
    @DeleteMapping("/payment/{id}")
    ResponseEntity<Payment> cancelPayment(@PathVariable Integer id) {
        LOGGER.info("Request to delete payment: {}");
        paymentService.delete(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/payments")
    List<Payment> getPayments(
            HttpSession session,
            @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
            @RequestParam(value = "sortType", required = false, defaultValue = "id") String sortType
    ){
        LOGGER.info("Get payments ->");
//        Optional<User> user = userService.findByEmail("user1@gmail.com");
//        defaultUser = user.orElse(null);

        User sessionUser = (User) session.getAttribute("user");
        LOGGER.info("User: " + sessionUser);
        //String email = "";
        try {
            String email = sessionUser.getEmail();
            User currentUser = userService.findByEmail(email).get();
            return paymentService.getPage(currentUser.getId(), pageNum, sortType).getContent();
        }catch (Exception ignored){}

        return new ArrayList<>();
    }

    @PostMapping("/payment")
    ResponseEntity<?> createPayment(
            @RequestBody PaymentDTO payment
    ){
        LOGGER.info("Request to create payment: {}");
        //String email = "user1@gmail.com";
        //Optional<User> user = userService.findByEmail(email);

        // check to see if user already exists
        //Optional<User> user = userRepository.findById(userId);
        //account.setUser(user.orElse(defaultUser));
        try{
            Payment result = paymentService.addPayment(payment);
            return ResponseEntity.ok().body(result);
        }catch (IllegalStateException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/payment/send/{id}")
    ResponseEntity<Payment> sendPayment(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(paymentService.sendPayment(id));
    }
}
