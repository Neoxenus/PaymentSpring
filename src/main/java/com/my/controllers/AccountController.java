package com.my.controllers;

import com.my.entities.Account;
import com.my.entities.User;
import com.my.entities.enums.Block;
import com.my.repositories.AccountRepository;
import com.my.services.AccountService;
import com.my.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.SessionScope;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.*;

/*
todo:
add account
block/unblock
replenish
getAccounts+
 */

@RestController
@RequiredArgsConstructor
@Lazy
@SessionScope
//@CrossOrigin("*")
public class AccountController {
    private final AccountService accountService;
    private final UserService userService;
    private final static Logger LOGGER = Logger.getLogger(AccountController.class);

    //private User defaultUser;



    @GetMapping("/accounts")
    public List<Account> getAccounts(
            HttpSession session,
            @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
            @RequestParam(value = "sortType", required = false, defaultValue = "id") String sortType){
        LOGGER.info("get accounts ->");
//        Optional<User> user = userService.findByEmail("user1@gmail.com");
//        defaultUser = user.orElse(null);

        User sessionUser = (User) session.getAttribute("user");
        LOGGER.info("User: " + sessionUser);
        //String email = "";
        try {
            String email = sessionUser.getUsername();

            User currentUser = userService.findByEmail(email).get();
            return accountService.getPage(currentUser.getId(), pageNum, sortType).getContent();
        }catch (Exception ignored){
            return new ArrayList<>();
        }
    }
    @GetMapping("/account/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Integer id){
        Optional<Account> account = accountService.findById(id);
        return account.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping("/accounts/{id}")
    public List<Account> getAccountByUserId(
            @PathVariable Integer id,
            @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
            @RequestParam(value = "sortType", required = false, defaultValue = "id") String sortType
                                                      ){
        return accountService.getPage(id, pageNum, sortType).getContent();
    }

    @PostMapping("/account")
    ResponseEntity<Account> createAccount(
            HttpSession session,
            @RequestBody Account account
                                      ) throws URISyntaxException {
        LOGGER.info("Request to create account: {}");
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String email = ((UserDetails)principal).getUsername();
//        String email = "user1@gmail.com";
//        Optional<User> user = userService.findByEmail(email);
        User sessionUser = (User) session.getAttribute("user");
        // check to see if user already exists
        //Optional<User> user = userRepository.findById(userId);

        //LOGGER.info("User: " + sessionUser);
        //String email = "";
        try {
            String email = sessionUser.getEmail();
            User currentUser = userService.findByEmail(email).get();
            //return accountService.getPage(currentUser.getId(), pageNum, sortType).getContent();
            account.setUser(currentUser);
            Account result = accountService.addAccount(account);
            return ResponseEntity.created(new URI("/account/" + result.getId()))
                    .body(result);
        }catch (Exception ignored){
            return ResponseEntity.badRequest().build();
        }


    }
    @PutMapping("/account/{id}")
    ResponseEntity<Account> updateAccount(@Valid @RequestBody Account account) {

        LOGGER.info("Request to update account: {}");
        Account result = accountService.update(account);
        return ResponseEntity.ok().body(result);
    }
    @PutMapping("/account/replenish/{id}")
    ResponseEntity<Account> replenishAccount(
            @PathVariable Integer id,
            @RequestBody Double amount) {

        LOGGER.info("Request to update account: {}");
        try {
            Account account = accountService.replenish(id, amount);
            return ResponseEntity.ok().body(account);
        }catch (IllegalStateException e){
            LOGGER.warn(e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }
    @PutMapping("/account/block/{id}")
    ResponseEntity<Account> blockAccount(
            @PathVariable Integer id) {

        LOGGER.info("Request to update account: {}");
        try {
            Account account = accountService.blockAccount(id);
            return ResponseEntity.ok().body(account);
        }catch (IllegalStateException e){
            LOGGER.warn(e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }
    @PutMapping("/account/admin-block/{id}")
    ResponseEntity<Account> blockAccountByAdmin(
            @PathVariable Integer id) {

        LOGGER.info("Request to update account: {}");
        try {
            Account account = accountService.blockAccountByAdmin(id);
            return ResponseEntity.ok().body(account);
        }catch (IllegalStateException e){
            LOGGER.warn(e);
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    @DeleteMapping("/account/{id}")
    ResponseEntity<Account> deleteAccount(@PathVariable Integer id) {
        LOGGER.info("Request to delete account: {}");
        accountService.delete(id);
        return ResponseEntity.ok().build();
    }
}
