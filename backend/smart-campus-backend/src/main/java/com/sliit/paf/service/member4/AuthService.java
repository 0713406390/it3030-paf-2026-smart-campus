package com.sliit.paf.service.member4;

import com.sliit.paf.dto.member4.AuthResponse;
import com.sliit.paf.dto.member4.LoginRequest;
import com.sliit.paf.dto.member4.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}