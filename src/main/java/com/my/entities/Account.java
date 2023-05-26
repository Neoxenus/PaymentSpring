package com.my.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.my.entities.enums.Block;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="account")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue
    private int id;
    private String number;
    private String accountName;
    private String IBAN;
    private LocalDateTime dateOfRegistration;
    private double balanceAmount;
    @Enumerated(EnumType.STRING)
    private Block isBlocked;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            nullable = false,
            name = "user_id"
    )
    private User user;

    public Account(String number, String accountName, String IBAN, double balanceAmount, User user) {
        this.number = number;
        this.accountName = accountName;
        this.IBAN = IBAN;
        this.dateOfRegistration = LocalDateTime.now();
        this.balanceAmount = balanceAmount;
        this.isBlocked = Block.ACTIVE;
        this.user = user;
    }
    public void replenish(double amount){
        balanceAmount += amount;
    }
}
