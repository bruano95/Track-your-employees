INSERT INTO department(department_name)
    VALUES  ("PRODUCTION"),
            ("MARKETING"),
            ("FINANCE"),
            ("HUMAN RESOURCES");
        
INSERT INTO role(title, salary, department_id)
    
    VALUES  ("Production Manager", 64000, 1),
            ("Production technician", 58000, 1),
            ("HR Supervisor", 79000, 4),
            ("HR Representative", 68000, 4),
            ("Marketing Expert", 89000, 2),
            ("Marketing Intern", 72000, 2),
            ("Financial Analyst", 100000, 3),
            ("Financial Intern", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ("Kyle", "Smith", 1, NULL),
            ("Tyler", "Alexander", 2, 1),
            ("Amanda", "Jones", 3, NULL),
            ("Brandon", "Ruano", 4, 3),
            ("Ben", "Johnson", 5, NULL),
            ("Greg", "Wallace", 6, 5),
            ("Michelle", "Simmons", 7, NULL),
            ("Tina", "Rush", 8, 7);
