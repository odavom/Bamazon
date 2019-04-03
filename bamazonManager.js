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
    console.log('\033c');
    // console.log(chalk.red('\nPRODUCTS FOR SALE'));
    connection.query('SELECT * from products', function(error, results) {
        if (error) throw error;

        const newArray = results.map(rowData => {
            return {
                "Item ID": rowData.item_id,
                "Product Name": rowData.product_name,
                "Department": rowData.department_name,
                "Retail": rowData.customer_price,
                "Quantity": rowData.stock_quantity
            };
            
        })
        console.table('Products for Sale', newArray);
    })
    // setTimeout(continueSearching(), 2000);
    // continueSearching();
}

function lowInventory() {
    console.log('\033c');
    // console.log('\Products with low inventory')
    connection.query('SELECT * FROM products WHERE stock_quantity < 5 ',
    function (error, results) {
        if (error) throw error;
        const newArray = results.map(rowData => {
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
    })
}





// function continueSearching() {
//     inquirer
//     .prompt([
//         {
//             type: 'confirm',
//             name: 'more',
//             message: "\nWould you like to do anything else?"
//         }
//     ]).then(answer =>{
//         if(answer.more == true) {
//             managerMenu();
//         } else {
//             connection.end();
//             console.log("Goodbye - come again.")
//         }
//     })
// }