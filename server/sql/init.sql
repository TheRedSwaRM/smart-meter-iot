CREATE TABLE user_input (
    id SERIAL PRIMARY KEY,
    cost_per_kwh FLOAT8 NOT NULL,
    thresh_low FLOAT8 NOT NULL,
    thresh_up FLOAT8 NOT NULL
);

CREATE TABLE user_auth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64),
    passplain VARCHAR(64)
);

CREATE TABLE device_user (
    device_id INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL REFERENCES user_input(id)
);

CREATE TABLE device_response (
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL,
    current_value FLOAT8 NOT NULL,
    user_id INT NOT NULL FOREIGN KEY REFERENCES user_input(id)
);

CREATE TABLE cloud_response (
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL, 
    estimated_cost FLOAT8 NOT NULL,
    led_status INT NOT NULL,
    buzzer_status INT NOT NULL,
    device_response_id FOREIGN KEY REFERENCES device_response(id)
);