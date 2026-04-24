package com.sliit.paf;

import com.sliit.paf.model.member3.User;
import com.sliit.paf.repository.member3.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmartCampusBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedTechnicians(UserRepository userRepository) {
        return args -> {
            ensureUser(userRepository, "tharanath.ambilla", "Mr.Tharanath Ambilla - Location Management Head");
            ensureUser(userRepository, "tharuka.rewnith", "Mr.Tharuka Rewnith - Documentation Management Head");
            ensureUser(userRepository, "amaranath.athukorala", "Mr.Amaranath Athukorala - Network Management Head");
            ensureUser(userRepository, "surath.abewardhana", "Mr.Surath Abewardhana - Facility Service Head");
        };
    }

    private void ensureUser(UserRepository userRepository, String username, String name) {
        userRepository.findByUsername(username).orElseGet(() -> {
            User user = new User();
            user.setUsername(username);
            user.setName(name);
            return userRepository.save(user);
        });
    }
}
