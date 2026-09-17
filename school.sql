DROP DATABASE IF EXISTS school;

CREATE DATABASE school;

USE school;


CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE courses(
    id INT PRIMARY KEY,
    student_id INT,
    course VARCHAR(100),

    FOREIGN KEY (student_id)
       REFERENCES students(id)
);

INSERT INTO students (id, name)
VALUES 
(1, 'Edosa'),
(2, 'Nicholas'),
(3, 'Ebun');


INSERT INTO courses (id, student_id, course)
VALUES
(101, 1, 'SQL'),
(102, 2, 'Python'),
(103, 3, 'Java');

--JOIN the two tables to get the student names along with their respective courses.
SELECT
    students.name,
    courses.course
FROM students
JOIN courses
     ON students.id = courses.student_id;
    