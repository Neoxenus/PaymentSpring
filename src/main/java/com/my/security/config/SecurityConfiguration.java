package com.my.security.config;


import com.my.web.CookieCsrfFilter;
import com.my.web.SpaWebFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@AllArgsConstructor
public class SecurityConfiguration {

    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        // set the name of the attribute the CsrfToken will be populated on
        requestHandler.setCsrfRequestAttributeName(null);
        return http
                //.cors().and()

                .authorizeHttpRequests((authz) -> authz
                                .anyRequest().permitAll()
//                        .requestMatchers("/","/csrf", "/index.html", "/static/**",
//                                "/*.ico", "/*.json", "/*.png", "/user",
//                                "/oauth2/authorization/auth0", "/logout").permitAll()
                        //.anyRequest().authenticated()
                )
//                .oauth2Login()
//                .and().logout()
//                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                .addLogoutHandler(logoutHandler)
                //.and()
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository
                                .withHttpOnlyFalse())
//                        // https://stackoverflow.com/a/74521360/65681
                        .csrfTokenRequestHandler(requestHandler)
               )

               .addFilterAfter(new CookieCsrfFilter(), BasicAuthenticationFilter.class)
               .addFilterAfter(new SpaWebFilter(), BasicAuthenticationFilter.class)
                .build();
    }

    @Bean
    public RequestCache refererRequestCache() {
        return new HttpSessionRequestCache() {
            @Override
            public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
                String referrer = request.getHeader("referer");
                if (referrer == null) {
                    referrer = request.getRequestURL().toString();
                }
                request.getSession().setAttribute("SPRING_SECURITY_SAVED_REQUEST",
                        new SimpleSavedRequest(referrer));

            }
        };
    }
}