USE users;

-- All columns
SELECT * FROM users;

-- Specific columns
SELECT id, username, email FROM users;

-- With a condition
SELECT * FROM users WHERE username = 'ada';

-- Ordered results
SELECT * FROM users ORDER BY created_at DESC;

-- Limit results
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

UPDATE users
SET username = 'ada_updated'
WHERE id = 1;

DELETE FROM users WHERE id = 1;
-- Equality
WHERE status = 'active'

-- Comparison
WHERE age >= 18

-- Range
WHERE created_at BETWEEN '2026-01-01' AND '2026-12-31'

-- Multiple conditions
WHERE status = 'active' AND role = 'admin'

-- Pattern matching
WHERE email LIKE '%@example.com'

-- In a set
WHERE tag IN ('work', 'personal')

-- NULL check
WHERE deleted_at IS NULL

SELECT COUNT(*)          FROM notes WHERE user_id = 1;
SELECT SUM(amount)       FROM transactions WHERE user_id = 1;
SELECT AVG(rating)       FROM reviews WHERE product_id = 5;
SELECT MAX(created_at)   FROM sessions WHERE user_id = 1;
SELECT MIN(price)        FROM products WHERE category = 'electronics';

-- Count notes per user
SELECT user_id, COUNT(*) AS note_count
FROM notes
GROUP BY user_id;

-- Only users with more than 5 notes
SELECT user_id, COUNT(*) AS note_count
FROM notes
GROUP BY user_id
HAVING COUNT(*) > 5;