package com.mukul.model;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_id", unique = true, nullable = false)
    private String emailId;

    @Column(name = "failed_login_attempt", nullable = false)
    private int failedLoginAttempt = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public int getFailedLoginAttempt() {
        return failedLoginAttempt;
    }

    public void setFailedLoginAttempt(int failedLoginAttempt) {
        this.failedLoginAttempt = failedLoginAttempt;
    }
}
