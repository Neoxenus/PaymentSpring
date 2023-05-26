package com.my.repositories;

import com.my.entities.Payment;
import com.my.entities.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Page<Payment> findAllBySenderAccountUserIdOrReceiverAccountUserIdAndStatusEquals(
            Integer userId, Integer id, PaymentStatus sent, Pageable pageable);
}
