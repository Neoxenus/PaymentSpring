package com.my.web;

import com.my.controllers.AccountController;
import com.my.entities.Account;
import com.my.entities.User;
import com.my.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@AllArgsConstructor
public class UserController extends SecurityContextLogoutHandler {
    //private final ClientRegistration registration;
    //private ClientRegistrationRepository clientRegistrationRepository;
    private UserRepository userRepository;
    private final static Logger LOGGER = Logger.getLogger(UserController.class);
//    public UserController(ClientRegistrationRepository registrations) {
//        this.registration = registrations.findByRegistrationId("auth0");
//    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            return ResponseEntity.ok().body(user.getAttributes());
        }
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/users")
    public List<User> getUser() {
        return userRepository.findAll();
    }
//    public ResponseEntity<?> logout(HttpServletRequest request) {
//        // send logout URL to client so they can initiate logout
//        LOGGER.info("Logout ->");
//        StringBuilder logoutUrl = new StringBuilder();
//        String issuerUri = this.registration.getProviderDetails().getIssuerUri();
//        logoutUrl.append(issuerUri.endsWith("/") ? issuerUri + "v2/logout" : issuerUri + "/v2/logout");
//        logoutUrl.append("?client_id=").append(this.registration.getClientId());
//
//        Map<String, String> logoutDetails = new HashMap<>();
//        logoutDetails.put("logoutUrl", logoutUrl.toString());
//        request.getSession(false).invalidate();
//        return ResponseEntity.ok().body(logoutDetails);
//
//    }

//    @Override
//    public void logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) {
//        // Invalidate the session and clear the security context
//        super.logout(httpServletRequest, httpServletResponse, authentication);
//
//        // Build the URL to log the user out of Auth0 and redirect them to the home page.
//        // URL will look like https://YOUR-DOMAIN/v2/logout?clientId=YOUR-CLIENT-ID&returnTo=http://localhost:3000
//        String issuer = (String) getClientRegistration().getProviderDetails().getConfigurationMetadata().get("issuer");
//        String clientId = getClientRegistration().getClientId();
//        String returnTo = ServletUriComponentsBuilder.fromCurrentContextPath().build().toString();
//
//        String logoutUrl = UriComponentsBuilder
//                .fromHttpUrl(issuer + "v2/logout?client_id={clientId}&returnTo={returnTo}")
//                .encode()
//                .buildAndExpand(clientId, returnTo)
//                .toUriString();
//
//        try {
//            httpServletResponse.sendRedirect(logoutUrl);
//        } catch (IOException ioe) {
//            // Handle or log error redirecting to logout URL
//        }
//    }
//    /**
//     * Gets the Spring ClientRegistration, which we use to get the registered client ID and issuer for building the
//     * {@code returnTo} query parameter when calling the Auth0 logout API.
//     *
//     * @return the {@code ClientRegistration} for this application.
//     */
//    private ClientRegistration getClientRegistration() {
//        return this.clientRegistrationRepository.findByRegistrationId("auth0");
//    }
}