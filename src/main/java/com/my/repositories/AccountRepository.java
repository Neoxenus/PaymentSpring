package com.my.repositories;

import com.my.entities.Account;
import com.my.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Page<Account> findAllByUserId(Integer userId, Pageable pageable);

    Optional<Account> findByNumber(String receiver);
}
