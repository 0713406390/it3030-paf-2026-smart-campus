package lk.sliit.smartcampus.config;

import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.Role;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin if not exists
        if (userRepository.findByEmail("admin@campus.com").isEmpty()) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@campus.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .provider("LOCAL")
                    .department("IT Services")
                    .build();
            userRepository.save(admin);
        }

        // Seed Technician if not exists
        if (userRepository.findByEmail("tech@campus.com").isEmpty()) {
            User tech = User.builder()
                    .name("Maintenance Tech")
                    .email("tech@campus.com")
                    .password(passwordEncoder.encode("tech123"))
                    .role(Role.TECHNICIAN)
                    .provider("LOCAL")
                    .department("Facilities")
                    .build();
            userRepository.save(tech);
        }

        // Seed Resources if empty
        if (resourceRepository.count() == 0) {
            Resource room1 = Resource.builder()
                    .name("Main Auditorium")
                    .type(Resource.ResourceType.EVENT_SPACE)
                    .description("Large auditorium for university events and guest lectures.")
                    .location("Block A, Level 1")
                    .capacity(500)
                    .status(Resource.ResourceStatus.ACTIVE)
                    .availableFrom(LocalTime.of(8, 0))
                    .availableTo(LocalTime.of(20, 0))
                    .maxBookingHours(4)
                    .availableDate(LocalDate.now().plusDays(1))
                    .build();

            Resource lab1 = Resource.builder()
                    .name("Computer Lab 01")
                    .type(Resource.ResourceType.LAB)
                    .description("Equipped with 40 high-end workstations.")
                    .location("Block B, Level 3")
                    .capacity(40)
                    .status(Resource.ResourceStatus.ACTIVE)
                    .availableFrom(LocalTime.of(9, 0))
                    .availableTo(LocalTime.of(18, 0))
                    .maxBookingHours(2)
                    .availableDate(LocalDate.now().plusDays(1))
                    .build();

            Resource meeting1 = Resource.builder()
                    .name("Meeting Room 102")
                    .type(Resource.ResourceType.MEETING_ROOM)
                    .description("Small meeting room with projector and whiteboard.")
                    .location("Block C, Level 2")
                    .capacity(12)
                    .status(Resource.ResourceStatus.ACTIVE)
                    .availableFrom(LocalTime.of(8, 30))
                    .availableTo(LocalTime.of(17, 30))
                    .maxBookingHours(3)
                    .availableDate(LocalDate.now().plusDays(1))
                    .build();

            resourceRepository.save(room1);
            resourceRepository.save(lab1);
            resourceRepository.save(meeting1);
        }
    }
}
