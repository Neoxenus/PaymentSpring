package com.my.services;

import com.my.entities.Account;
import com.my.entities.User;
import com.my.entities.enums.Block;
import com.my.repositories.AccountRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AccountService {
    private final static Logger LOGGER = Logger.getLogger(AccountService.class);
    private final AccountRepository accountRepository;
    private static final int DEFAULT_PAGE_SIZE = 5;

    public Page<Account> getPage(Integer userId, int pageNum, String sortType) {
        LOGGER.info("Getting exhibitions on page with number " + pageNum + ", sorted by " + sortType);
        Pageable paging = PageRequest.of(pageNum - 1, DEFAULT_PAGE_SIZE, Sort.by(sortType));
        return accountRepository.findAllByUserId(userId, paging);
        //return accountRepository.findAll();
    }

    public Optional<Account> findById(Integer id) {
        return accountRepository.findById(id);
    }

    public Account addAccount(Account account) {
        account.setDateOfRegistration(LocalDateTime.now());
        account.setIsBlocked(Block.ACTIVE);
        account.setBalanceAmount(1000);
        accountRepository.save(account);
        return account;
    }

    public Account update(Account account) {
        accountRepository.save(account);
        return account;
    }

    public void delete(Integer id) {
        accountRepository.deleteById(id);
    }

    public Account replenish(Integer accountId, double amount) throws IllegalStateException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalStateException("No account with such id"));
        account.replenish(amount);
        return accountRepository.save(account);

    }

    public Account blockAccount(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No account with such id"));

        if(account.getIsBlocked().equals(Block.ACTIVE))
            account.setIsBlocked(Block.BLOCKED);
        else if(account.getIsBlocked().equals(Block.BLOCKED))
            account.setIsBlocked(Block.APPROVAL);
        else if(account.getIsBlocked().equals(Block.APPROVAL))
            return account;
        return accountRepository.save(account);
    }

    public Account blockAccountByAdmin(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No account with such id"));

        if(account.getIsBlocked().equals(Block.ACTIVE))
            account.setIsBlocked(Block.BLOCKED);
        else
            account.setIsBlocked(Block.ACTIVE);
        return accountRepository.save(account);
    }
}
