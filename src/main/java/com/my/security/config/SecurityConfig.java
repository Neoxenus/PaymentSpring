package com.my.security.config;


import com.auth0.AuthenticationController;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.my.security.config.web.CookieCsrfFilter;
import com.my.security.config.web.SpaWebFilter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;


import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SimpleSavedRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.UnsupportedEncodingException;
import java.util.List;


@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
//    @Value(value = "${com.auth0.domain}")
//    private String domain;
//
//    @Value(value = "${spring.security.oauth2.client.registration.auth0.client-id}")
//    private String clientId;
//
//    @Value(value = "${spring.security.oauth2.client.registration.auth0.client-secret}")
//    private String clientSecret;
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())  // Disable CSRF protection for simplicity; adjust as needed
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/public/**").permitAll()  // Allow public access to certain endpoints
//                        .anyRequest().authenticated()  // Require authentication for all other requests
//                )
//                .oauth2Login();  // Enable OAuth2 login
//
//        return http.build();
//    }

    //private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        // set the name of the attribute the CsrfToken will be populated on
        requestHandler.setCsrfRequestAttributeName(null);
         http
                .cors()
                  .and()
                 //.csrf().disable()

                .authorizeHttpRequests((authz) -> authz
                                .requestMatchers( "/index.html", "/static/**",
                                        "/*.ico", "/*.json", "/*.png", "/user",
                                        "/oauth2/authorization/auth0", "/logout", "/login/**", "/oauth2/**", "/error", "/api/**").permitAll()
                                .anyRequest().authenticated()
                                //.anyRequest().permitAll()
//                        .requestMatchers("/","/csrf", "/index.html", "/static/**",
//                                "/*.ico", "/*.json", "/*.png", "/user",
//                                "/oauth2/authorization/auth0", "/logout").permitAll()
                        //.anyRequest().authenticated()
                )
                 .formLogin()  // Use form-based login for authentication
                 .permitAll()
                 .and()
                 .oauth2Login()
                 .loginPage("/login")
                 .defaultSuccessUrl("/home", true)
                 .failureUrl("/login?error")
                 .authorizationEndpoint()
                    .baseUri("/oauth2/authorization")
                    .and()
                 .redirectionEndpoint()
                    .baseUri("/login/oauth2/code/*")
                    .and()
                 .and()
                 .logout()
                 .logoutSuccessUrl("https://dev-e3n1otn0qq2n0tiy.us.auth0.com/v2/logout?client_id=zTmBgBIVupr7hXAJMuGOPzRlIq3KEVyc&returnTo=http://localhost:3000")
                 .invalidateHttpSession(true)  // Invalidate session
                 .clearAuthentication(true)    // Clear security context
                 .deleteCookies("JSESSIONID");
//                .logout()
//                .logoutSuccessUrl("http://localhost:3000/")

//                 .and()
//                .and().logout()
//                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                .addLogoutHandler(logoutHandler)
                //.and()
//                .csrf((csrf) -> csrf
//                                .csrfTokenRepository(CookieCsrfTokenRepository
//                                        .withHttpOnlyFalse())
////                        // https://stackoverflow.com/a/74521360/65681
//                                .csrfTokenRequestHandler(requestHandler)
//                )
//
//                .addFilterAfter(new CookieCsrfFilter(), BasicAuthenticationFilter.class)
//                .addFilterAfter(new SpaWebFilter(), BasicAuthenticationFilter.class);
        ;
        return http.build();
    }
//    @Bean
//    public AuthenticationController authenticationController() throws UnsupportedEncodingException {
//        JwkProvider jwkProvider = new JwkProviderBuilder(domain).build();
//        return AuthenticationController.newBuilder(domain, clientId, clientSecret)
//                .withJwkProvider(jwkProvider)
//                .build();
//    }
//    @Bean
//    public RequestCache refererRequestCache() {
//        return new HttpSessionRequestCache() {
//            @Override
//            public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
//                String referrer = request.getHeader("referer");
//                if (referrer == null) {
//                    referrer = request.getRequestURL().toString();
//                }
//                request.getSession().setAttribute("SPRING_SECURITY_SAVED_REQUEST",
//                        new SimpleSavedRequest(referrer));
//
//            }
//        };
//    }
        @Bean
        public CorsFilter corsFilter() {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:3000"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);
            return new CorsFilter(source);
        }
}