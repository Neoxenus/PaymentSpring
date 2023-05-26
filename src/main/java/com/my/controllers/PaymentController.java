package com.my.controllers;

import com.my.dto.PaymentDTO;
import com.my.entities.Account;
import com.my.entities.Payment;
import com.my.entities.User;
import com.my.services.AccountService;
import com.my.services.PaymentService;
import com.my.services.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;
    private User defaultUser;
    private final static Logger LOGGER = Logger.getLogger(AccountController.class);
    @DeleteMapping("/payment/{id}")
    ResponseEntity<Payment> cancelPayment(@PathVariable Integer id) {
        LOGGER.info("Request to delete payment: {}");
        paymentService.delete(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/payments")
    List<Payment> getPayments(
            @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
            @RequestParam(value = "sortType", required = false, defaultValue = "id") String sortType
    ){
        LOGGER.info("Get payments ->");
        Optional<User> user = userService.findByEmail("user1@gmail.com");
        defaultUser = user.orElse(null);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.info("Principal: " + principal);
        String email = "";
        try {
            email = ((UserDetails)principal).getUsername();
        }catch (Exception ignored){}

        User currentUser = userService.findByEmail(email).orElse(defaultUser);
        return paymentService.getPage(currentUser.getId(), pageNum, sortType).getContent();
    }

    @PostMapping("/payment")
    ResponseEntity<Payment> createPayment(
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
            return ResponseEntity.ok(result);
        }catch (IllegalStateException e){
            return ResponseEntity.unprocessableEntity()
                    .header("error", e.getMessage()).build();
        }
    }

    @PutMapping("/payment/send/{id}")
    ResponseEntity<Payment> sendPayment(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(paymentService.sendPayment(id));
    }
}
