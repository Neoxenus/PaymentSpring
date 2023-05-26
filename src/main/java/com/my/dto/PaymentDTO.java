package com.my.dto;

import com.my.entities.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    @Id
    private Long id;

    private String amount;
    private String assignment;
    private String sender;
    private String receiver;


}
