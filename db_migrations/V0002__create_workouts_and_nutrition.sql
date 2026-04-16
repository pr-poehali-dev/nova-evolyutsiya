CREATE TABLE IF NOT EXISTS t_p99527936_nova_evolyutsiya.workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p99527936_nova_evolyutsiya.users(id),
    title VARCHAR(255) NOT NULL,
    workout_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p99527936_nova_evolyutsiya.nutrition_diary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p99527936_nova_evolyutsiya.users(id),
    entry_date DATE NOT NULL,
    meal_type VARCHAR(50),
    food_name VARCHAR(255) NOT NULL,
    calories INTEGER,
    proteins NUMERIC(6,1),
    fats NUMERIC(6,1),
    carbs NUMERIC(6,1),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);