package com.sliit.paf.controller.member3;

import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Map<String, String> TECHNICIAN_USERS = Map.of(
        "tharanath.ambilla", "Mr.Tharanath Ambilla - Location Management Head",
        "tharuka.rewnith", "Mr.Tharuka Rewnith - Documentation Management Head",
        "amaranath.athukorala", "Mr.Amaranath Athukorala - Network Management Head",
        "surath.abewardhana", "Mr.Surath Abewardhana - Facility Service Head"
    );

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String role) {
        if ("TECHNICIAN".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(resolveTechnicianUsers());
        }

        return ResponseEntity.ok(userRepository.findAll());
    }

    private List<User> resolveTechnicianUsers() {
        List<User> result = new ArrayList<>();

        for (Map.Entry<String, String> entry : TECHNICIAN_USERS.entrySet()) {
            String username = entry.getKey();
            String name = entry.getValue();

            User user = userRepository.findByUsername(username).orElseGet(() -> {
                User created = new User();
                created.setUsername(username);
                created.setName(name);
                return userRepository.save(created);
            });

            if (!name.equals(user.getName())) {
                user.setName(name);
                user = userRepository.save(user);
            }

            result.add(user);
        }

        return result;
    }
}
