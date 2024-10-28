package com.my.services;

import com.my.entities.User;
import com.my.entities.enums.Block;
import com.my.entities.enums.Role;
import com.my.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.my.entities.enums.Role.ADMIN;
import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Service
@Lazy
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";

    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authManager;
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



    public User login(String email, String password) throws IllegalStateException{
        String encodedPassword = bCryptPasswordEncoder
                .encode(password);
        try{
            Optional<User> DBUser = userRepository.findByEmail(email);

            UserDetails userDetails = this.loadUserByUsername(email);

            if(DBUser.isPresent()){
                User curUser = DBUser.get();
                if(bCryptPasswordEncoder.matches(password, curUser.getPassword())){

                    Authentication auth
                            = new UsernamePasswordAuthenticationToken(userDetails, curUser.getPassword(), curUser.getAuthorities());

                    //Authentication auth = authManager.authenticate(authReq);

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    //SecurityContextHolder.getContext().getAuthentication().setAuthenticated(true);

                    //HttpSession session = req.getSession(true);
                    //session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
                    return DBUser.get();
                }
            }
            throw new IllegalStateException("Incorrect email or password");
        } catch (Exception e){
            throw new IllegalStateException("Incorrect email or password");
        }


        ////////////////////////

        ///////////////////////////////

    }
    public void logout(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            // Clear the authentication and invalidate session
            SecurityContextHolder.clearContext();
        }
    }

    public User signUpUser(User user) throws IllegalStateException{
        boolean userExists = userRepository
                .findByEmail(user.getEmail())
                .isPresent();

        if (userExists) {
            throw new IllegalStateException("Email already taken");
        }

        String encodedPassword = bCryptPasswordEncoder
                .encode(user.getPassword());
        user.setPassword(encodedPassword);
        user.setRole(Role.USER);
        user.setIsBlocked(Block.ACTIVE);

        return userRepository.save(user);
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

    public boolean existsByUsername(String username) {

        return userRepository.existsByEmail(username);
    }

    public void createAdmin() {

        User user = new User("admin", "0000", "admin", "");
        user.setPassword(bCryptPasswordEncoder.encode("admin"));
        user.setRole(ADMIN);
        userRepository.save(user);
    }

}
