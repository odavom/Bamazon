let inquirer = require('inquirer');
let mysql = require("mysql");

let divider = '\n-------------------------------------------------------------\n'
let space = "\n\n"

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


    // userInput();
   
    // console.log('connected as id ' + connection.threadId);
    // console.log(`\nConnected as id ${connection.threadId}\n`)
});


// need a function to display all the items

function displayItems() {
    // clear the  console
    console.log('\033c');
    console.log("\nAVAILABLE PRODUCTS\n");
    connection.query('SELECT * from products', function (error, results) {
        if (error) throw error;
        // console.log(results);
        // for (let i = 0; i < results.length; i++){
        //     // console.log(results[i]);
        //     let rowData = results[i];
        //     // console.log(rowData);
        //     console.log(divider + "ITEM ID: "  + rowData.item_id + " " + "||" + " " + "PRODUCT: " + rowData.product_name + " " + "||"  + " " + "PRICE: " + rowData.customer_price + divider)
        // }
        console.table(results.map(rowData => {
            return {
                "Item ID": rowData.item_id,
                "Product Name": rowData.product_name,
                "Price": rowData.customer_price
            };
        })
    )
      userInput();  
    })
}
displayItems();

function userInput() { 
    inquirer
        .prompt([{
            type: 'input',
            name: 'item_id',
            message: '\nPlease enter purchase item_id.\n',
            validate: function(input) {
                if (!isNaN(input) && parseInt(input) > 0){
                    return true
                } else {
                    console.log("\nPlease enter a number greater then zero.\n")
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: '\nHow many would you like to purchase?\n',
            validate: function(input) {
            if (!isNaN(input) && parseInt(input) > 0){
                return true
            } else {
                console.log("\nPlease enter a number greater then zero.\n")
            }
        }
    }
])
        .then(answers => {
            console.log(answers)
  });

}



/* 

*/