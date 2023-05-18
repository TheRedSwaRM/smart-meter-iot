CREATE TABLE user_auth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) UNIQUE,
    passplain VARCHAR(64)
);

CREATE TABLE user_input (
    id INT PRIMARY KEY REFERENCES user_auth(id),
    cost_per_kwh FLOAT8 NOT NULL,
    thresh_low FLOAT8 NOT NULL,
    thresh_up FLOAT8 NOT NULL
);

CREATE TABLE device_user (
    device_id VARCHAR(64) PRIMARY KEY NOT NULL,
    user_id INT NOT NULL REFERENCES user_input(id)
);

CREATE TABLE device_response (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(64) NOT NULL REFERENCES device_user(device_id),
    created_on TIMESTAMP NOT NULL,
    current_value FLOAT8 NOT NULL
);

CREATE TABLE cloud_response (
    id SERIAL PRIMARY KEY,
    created_on TIMESTAMP NOT NULL, 
    estimated_cost FLOAT8 NOT NULL,
    led_status INT NOT NULL,
    buzzer_status INT NOT NULL,
    device_response_id INT REFERENCES device_response(id)
);