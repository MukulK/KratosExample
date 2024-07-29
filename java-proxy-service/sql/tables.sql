-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    failed_login_attempt INTEGER DEFAULT 0
);

-- Create the password_history table
CREATE TABLE password_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create a trigger to maintain only the last 5 password histories
CREATE OR REPLACE FUNCTION maintain_password_history() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM password_history
    WHERE user_id = NEW.user_id AND id NOT IN (
        SELECT id FROM password_history
        WHERE user_id = NEW.user_id
        ORDER BY created_at DESC
        LIMIT 5
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maintain_password_history
AFTER INSERT ON password_history
FOR EACH ROW
EXECUTE FUNCTION maintain_password_history();
