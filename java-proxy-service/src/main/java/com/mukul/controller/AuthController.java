package com.mukul.controller;

import com.mukul.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestParam String emailId, @RequestParam String password) {
        try {
            userService.registerUser(emailId, password);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String emailId, @RequestParam String password) {
        try {
            userService.loginUser(emailId, password);
            return ResponseEntity.ok("Login successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String emailId, @RequestParam String newPassword) {
        try {
            userService.changePassword(emailId, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
