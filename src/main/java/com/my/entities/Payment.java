package com.my.entities;

import com.my.entities.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name="payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue
    private Integer id;

    //private String number;
    public String getNumber(){
        return "P" + id;
    }

    private double amount;

    private String assignment;
    private LocalDateTime time;
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "sender_account_id"
    )
    private Account senderAccount;
    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "receiver_account_id"
    )
    private Account receiverAccount;

    public Payment(double amount,
                   String assignment,
                   Account senderAccount,
                   Account receiverAccount) {
        this.amount = amount;
        this.assignment = assignment;
        this.time = LocalDateTime.now();
        this.status = PaymentStatus.PREPARED;
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
    }
}
