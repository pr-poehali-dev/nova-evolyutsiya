CREATE TABLE IF NOT EXISTS t_p99527936_nova_evolyutsiya.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p99527936_nova_evolyutsiya.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p99527936_nova_evolyutsiya.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);