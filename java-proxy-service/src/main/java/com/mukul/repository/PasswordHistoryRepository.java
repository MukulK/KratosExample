package com.mukul.repository;

import com.mukul.model.PasswordHistory;
import com.mukul.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {
    List<PasswordHistory> findTop5ByUserOrderByCreatedAtDesc(User user);
}