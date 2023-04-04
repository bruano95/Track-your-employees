const mysql = require('mysql2/promise');
const inquirer = require ('inquirer');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Jherbo10!!',
    database: 'employee_db'
},
console.log('Connected to the employee_db database')
);

function init(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'userChoice',
                choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role',
                    'exit'
                ]
            }
        ]).then (answer => {
            if (answer.userChoice === "view all departments"){
                viewAllDepartments()
            } else if (answer.userChoice === "view all roles"){
                viewAllRoles()
            } else if (answer.userChoice === "view all employees"){
                viewAllEmployees()
            } else if (answer.userChoice === "add a department"){
                addDepartment()
            } else if (answer.userChoice === "add a role"){
                addRole()
            } else if (answer.userChoice === "add an employee"){
                addEmployee()
            } else if (answer.userChoice === "update an employee role"){
                updateEmployeeRole()
            } else if (answer.userChoice === "exit"){
                process.exit()
            }
        })
}

async function viewAllDepartments(){
    let query = "SELECT * FROM department;"
    let [rows, columns]= await db.query(query)
    console.table(rows)
    init()
}

async function viewAllRoles(){
    let query ="SELECT * FROM role;"
    let [rows, columns]= await db.query(query)
    console.table(rows)
    init()
}

async function viewAllEmployees(){
    let query ="SELECT * FROM employee;"
    let [rows, columns]= await db.query(query)
    console.table(rows)
    init()
}

async function addDepartment(){
    await inquirer
        .prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the name of the new department?',
        }
    ]).then(async (answer) => {
        let query = "INSERT INTO department(department_name)VALUES(?)"
        await db.query(query, answer.addDepartment)
        let [rows, columns] = await db.query('SELECT * FROM department')
        console.table(rows)
        init()
    })
}

async function addRole(){
    let [departments, columns] = await db.query('SELECT * FROM department;')
    let departmentList = departments.map(department=>{
        return {
            name: `${department.department_name}`,
            value: department.id
        }
    })
    await inquirer
        .prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the new role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'which department is this role in?',
            choices: departmentList
        }
    ])
    .then(async (answer) => {
        await db.query(`INSERT INTO role(title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", (SELECT id FROM department WHERE department_name ="${answer.department}"))`)
        let [rows, columns] = await db.query('SELECT * FROM role')
        console.table(rows)
        init()
    })
}

async function addEmployee(){
    let [employees, columns] = await db.query('SELECT * FROM employee;')
    let employeesList = employees.map(employee=>{
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    })

    let [roles, column] = await db.query('SELECT * FROM role;')
    let roleList = roles.map(role=>{
        return {
            name: role.title,
            value: role.id
        }
    })
    await inquirer
        .prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'What is the first name of the new employee?',
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the role of the new employee?',
            choices: roleList
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the manager for this employee?',
            choices: employeesList
        }
    ]).then(async (answer)=>{
        await db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${answer.firstname}", "${answer.lastname}", "${answer.role}", "${answer.manager}")`)
        let [rows, columns] = await db.query('SELECT * FROM employee')
        console.table(rows)
        init()
    })
}

async function updateEmployeeRole(){
    let [employees, columns] = await db.query('SELECT * FROM employee;')
    let employeesList = employees.map(employee=>{
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    })

    let [roles, column] = await db.query('SELECT * FROM role;')
    let roleList = roles.map(role=>{
        return {
            name: role.title,
            value: role.id
        }
    })
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeesList
        },    
        {
            type: 'list',
            name: 'role',
            message: 'Which role would you like to update it to?',
            choices: roleList
        },    
    ]).then(async (answer)=>{
       await db.query (`UPDATE employee SET role_id = '${answer.role}' WHERE id = '${answer.employee}';`)
       let [rows, columns] = await db.query('SELECT * FROM employee;')
       console.table(rows)
       init()
    })

}

init()
