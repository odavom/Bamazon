let inquirer = require('inquirer');
let mysql = require('mysql');
let chalk = require('chalk');
require('console.table');

let connection = mysql.createConnection({

    host: 'localhost',
    port: 3306,

    user: 'root',

    password: 'root',
    database: 'bamazon_DB'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
        
    }
    // console.log(err)
    // console.log(connection.config)

    // console.log(chalk.red("Connected as id " + connection.threadId));
});
managerMenu();
function managerMenu() {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: '\nWhat do you want to do?',
            choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add new product', 'Exit']
        }
]).then(answer => {
    switch(answer.action) {
        case 'View products for sale':
            viewProducts();
            break;
        case 'View low inventory':
            lowInventory();
            break;
        case 'Add to inventory':
            addInventory();
            break;
        case 'Add new product':
            addNewProduct();
            break;
        case 'Exit':
            connection.end();
            break;
        default:
            console.log("Try again.")

    }
});
}

function viewProducts() {
    // console.log('\033c');
    // console.log(chalk.red('\nPRODUCTS FOR SALE'));
    connection.query('SELECT * from products', function(error, results) {
        if (error) throw error;

        const newArray = results.map(function(rowData) {
            return {
                "Item ID": rowData.item_id,
                "Product Name": rowData.product_name,
                "Department": rowData.department_name,
                "Retail": rowData.customer_price,
                "Quantity": rowData.stock_quantity
            };
            
        })
        console.table('Products for Sale', newArray);
        continueSearching();
    })
    // setTimeout(continueSearching(), 2000);
}

function lowInventory() {
    // console.log('\033c');
    // console.log('\Products with low inventory')
    connection.query('SELECT * FROM products WHERE stock_quantity < 5 ',
    function (error, results) {
        if (error) throw error;
        const newArray = results.map(rowData =>{
            return {
                "Item ID": rowData.item_id,
                "Product Name": rowData.product_name,
                "Department": rowData.department_name,
                "Retail": rowData.customer_price,
                "Quantity": rowData.stock_quantity
            };
            // how to set up if else statement if no information comes up?
        })
        console.table('Low Inventory Products', newArray);
        continueSearching();
    })
};

function addInventory() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'item_id',
                message: 'Please enter the item_id to add inventory',
                validate: function(value) {
                    if(isNaN(value)) {
                        // why will this not return???
                        // console.log();
                        return "\nEnter valid item_id!\n";
                    } return true;
                }
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'how many units do you want to add?',
                validate: function(input) {
                    if (!isNaN(input) && parseInt(input) > 0){
                        return true
                    } else {
                        // console.log();
                        return "\nPlease enter a number greater then zero.\n"
                    }
                }
            }
        ]).then(answer => {
            connection.query('SELECT stock_quantity FROM products WHERE ?',
            {
                item_id: answer.item_id
            },
            function (err, res) {
                if (err) throw err;
                // console.log(res);
                let newQuantity = parseInt(res[0].stock_quantity) + parseInt(answer.quantity);
                connection.query ('UPDATE products SET ? WHERE ?',
                [   {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: answer.item_id
                    }
                        
                ],
                function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Item " + answer.item_id +  " updated. Inventory is " + newQuantity)
                        continueSearching();
                    }
                })
            })
        })
};

function addNewProduct() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Enter the item_id: ',
            // figure out how to validate
        },
        {
            type: 'input',
            name: 'product_name',
            message: "Enter product_name: "
        },
        {
            type: 'input',
            name: 'department_name',
            message: "Enter department_name: "
        },
        {
            type: 'input',
            name: 'customer_price',
            message: "Enter customer_price: "
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: "Enter stock_quantity: "
        }

    ]).then (answer => {
        inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'add',
                message: "Would you like to add new product?"
            }
        ]).then(ans => {
            if (ans.add == true) {
                connection.query('INSERT INTO products SET ?', {
                    item_id: answer.item_id,
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    customer_price: answer.customer_price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) throw err;
                    console.table(answer.product_name + ' has been added', {
                        'item_id ': answer.item_id,
                        'product_name ': ans.product_name,
                        'department_name': answer.department_name,
                        'customer_price': answer.customer_price,
                        'stock_quantity': answer.stock_quantity
                    }
                    )
                    continueSearching();
                }
                )
            } else {
                console.log("Not added");
                continueSearching();
            }
        })
    })
}


function continueSearching() {
    inquirer
    .prompt([
        {
            type: 'confirm',
            name: 'more',
            message: "\nWould you like to do anything else?"
        }
    ]).then(answer =>{
        if(answer.more == true) {
            managerMenu();
        } else {
            connection.end();
            console.log("Goodbye - have a nice day manager.")
        }
    })
}