package com.my.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;


@Entity
@Table(name="credit_card")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditCard {
    @Id
    private int id;
    private String number;
    private String cvv;
    private String expireDate;
    @OneToOne
    @JoinColumn(
            nullable = false,
            name = "account_id"
    )
    private Account account;

    public CreditCard(String number, String cvv, String expireDate, Account account) {
        this.number = number;
        this.cvv = cvv;
        this.expireDate = expireDate;
        this.account = account;
    }
}
