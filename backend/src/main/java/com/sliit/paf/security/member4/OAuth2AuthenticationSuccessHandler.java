package com.sliit.paf.security.member4;

import com.sliit.paf.model.member4.AppUser;
import com.sliit.paf.model.member4.Role;
import com.sliit.paf.repository.member4.AppUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AppUserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.oauth2.redirect-uri:http://localhost:5173/oauth2/redirect}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(AppUserRepository userRepository,
                                              JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = getAttribute(oAuth2User, "email");
        String name = getAttribute(oAuth2User, "name");

        if (email == null || email.isBlank()) {
            response.sendRedirect(redirectUri + "?error=google_auth_failed");
            return;
        }

        AppUser user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setName(name != null && !name.isBlank() ? name : existingUser.getName());
                    existingUser.setEnabled(true);
                    return existingUser;
                })
                .orElseGet(() -> AppUser.builder()
                        .name(name != null && !name.isBlank() ? name : email)
                        .email(email)
                        .role(Role.USER)
                        .enabled(true)
                        .build());

        AppUser savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(UserPrincipal.create(savedUser));

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("id", savedUser.getId())
                .queryParam("name", savedUser.getName())
                .queryParam("email", savedUser.getEmail())
                .queryParam("role", savedUser.getRole().name())
                .build()
                .toUriString();

        response.sendRedirect(targetUrl);
    }

    private String getAttribute(OAuth2User oAuth2User, String key) {
        Object value = oAuth2User.getAttributes().get(key);
        return value instanceof String stringValue ? stringValue : null;
    }
}