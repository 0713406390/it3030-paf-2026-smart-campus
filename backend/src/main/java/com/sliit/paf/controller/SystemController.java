package com.sliit.paf.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SystemController {

    @GetMapping({"/", "/continue"})
    public ResponseEntity<Map<String, String>> home() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "Smart Campus backend is running",
            "api", "/api/tickets"
        ));
    }
}
