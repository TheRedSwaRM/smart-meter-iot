CREATE TABLE device_response (
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL,
    current_value FLOAT8 NOT NULL
);

CREATE TABLE cloud_response (
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL,
    created_on TIMESTAMP NOT NULL, 
    estimated_cost FLOAT8 NOT NULL,
    led_status INT NOT NULL,
    buzzer_status INT NOT NULL
);

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