package com.my.services;

import com.my.entities.Account;
import com.my.entities.User;
import com.my.entities.enums.Block;
import com.my.entities.enums.Role;
import com.my.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";

    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;
    private static final int DEFAULT_PAGE_SIZE = 5;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(USER_NOT_FOUND_MSG, email)));
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public void signUpUser(User user) throws IllegalStateException{
        boolean userExists = userRepository
                .findByEmail(user.getEmail())
                .isPresent();

        if (userExists) {
            throw new IllegalStateException("email already taken");
        }

        String encodedPassword = bCryptPasswordEncoder
                .encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setRole(Role.USER);
        user.setIsBlocked(Block.ACTIVE);

        userRepository.save(user);
    }

    public Page<User> getPage(int pageNum) {
        Pageable paging = PageRequest.of(pageNum - 1, DEFAULT_PAGE_SIZE);
        return userRepository.findAll(paging);
    }

    public User blockUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No user with such id"));

        user.setIsBlocked(
                user.getIsBlocked().equals(Block.ACTIVE)
                        ? Block.BLOCKED
                        : Block.ACTIVE
        );
        return userRepository.save(user);
    }

    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalStateException("No user with such id"));
    }
}
