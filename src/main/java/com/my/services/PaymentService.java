package com.my.services;

import com.my.dto.PaymentDTO;
import com.my.entities.Account;
import com.my.entities.Payment;
import com.my.entities.enums.PaymentStatus;
import com.my.repositories.AccountRepository;
import com.my.repositories.PaymentRepository;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class PaymentService {
    private final static Logger LOGGER = Logger.getLogger(PaymentService.class);
    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;
    private static final int DEFAULT_PAGE_SIZE = 5;

    public void delete(Integer paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    public Page<Payment> getPage(String userId, int pageNum, String sortType){
        LOGGER.info("Getting exhibitions on page with number " + pageNum + ", sorted by " + sortType);
        Pageable paging = PageRequest.of(pageNum - 1, DEFAULT_PAGE_SIZE);
        return paymentRepository.findAllBySenderAccountUserIdOrReceiverAccountUserIdAndStatusEquals(userId, userId, PaymentStatus.SENT, paging);
    }

    public Payment addPayment(PaymentDTO payment) throws IllegalStateException{
        Account receiver = accountRepository.findByNumber(payment.getReceiver())
                .orElseThrow(() -> new IllegalStateException("Incorrect receiver"));
        Account sender = accountRepository.findByNumber(payment.getSender())
                .orElseThrow(() -> new IllegalStateException("Incorrect sender"));
        if(receiver.equals(sender))
            throw new IllegalStateException("Sender and receiver are identical");

        Payment newPayment = new Payment(
                Double.parseDouble(payment.getAmount()),
                payment.getAssignment(),
                sender,
                receiver);
        return paymentRepository.save(newPayment);
    }


    public Payment sendPayment(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Invalid id"));
        if(payment.getStatus().equals(PaymentStatus.PREPARED)){
            Account receiver = payment.getReceiverAccount();
            Account sender = payment.getSenderAccount();

            receiver.setBalanceAmount(receiver.getBalanceAmount() + payment.getAmount());
            sender.setBalanceAmount(sender.getBalanceAmount() - payment.getAmount());
        }
        payment.setStatus(PaymentStatus.SENT);
        return paymentRepository.save(payment);
    }
}
