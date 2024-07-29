package com.mukul.service;

import com.mukul.model.PasswordHistory;
import com.mukul.model.User;
import com.mukul.repository.PasswordHistoryRepository;
import com.mukul.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordHistoryRepository passwordHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MAX_FAILED_ATTEMPTS = 5;

    public void registerUser(String emailId, String password) throws Exception {
        Optional<User> existingUser = userRepository.findByEmailId(emailId);
        if (existingUser.isPresent()) {
            throw new Exception("User already exists with this email ID");
        }

        User user = new User();
        user.setEmailId(emailId);
        userRepository.save(user);

        savePasswordHistory(user, password);
    }

    public void loginUser(String emailId, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmailId(emailId);

        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();

        if (user.getFailedLoginAttempt() >= MAX_FAILED_ATTEMPTS) {
            throw new Exception("Too many failed login attempts. Account is locked.");
        }

        List<PasswordHistory> passwordHistories = passwordHistoryRepository.findTop5ByUserOrderByCreatedAtDesc(user);
        boolean passwordMatch = passwordHistories.stream()
                .anyMatch(ph -> passwordEncoder.matches(password, ph.getPasswordHash()));

        if (passwordMatch) {
            resetFailedLoginAttempts(user);
        } else {
            incrementFailedLoginAttempts(user);
            throw new Exception("Incorrect password");
        }
    }

    public void changePassword(String emailId, String newPassword) throws Exception {
        Optional<User> userOptional = userRepository.findByEmailId(emailId);

        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();

        List<PasswordHistory> passwordHistories = passwordHistoryRepository.findTop5ByUserOrderByCreatedAtDesc(user);
        boolean passwordReused = passwordHistories.stream()
                .anyMatch(ph -> passwordEncoder.matches(newPassword, ph.getPasswordHash()));

        if (passwordReused) {
            throw new Exception("Cannot reuse any of the last 5 passwords");
        }

        savePasswordHistory(user, newPassword);
        resetFailedLoginAttempts(user);
    }

    private void savePasswordHistory(User user, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        PasswordHistory passwordHistory = new PasswordHistory();
        passwordHistory.setUser(user);
        passwordHistory.setPasswordHash(encodedPassword);
        passwordHistoryRepository.save(passwordHistory);
    }

    private void resetFailedLoginAttempts(User user) {
        user.setFailedLoginAttempt(0);
        userRepository.save(user);
    }

    private void incrementFailedLoginAttempts(User user) {
        user.setFailedLoginAttempt(user.getFailedLoginAttempt() + 1);
        userRepository.save(user);
    }
}
