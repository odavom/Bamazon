// require npm packages
let inquirer = require('inquirer');
let mysql = require("mysql");
require('console.table');
// 
// let divider = '\n-------------------------------------------------------------\n'
// let space = "\n\n"

// connection object that connects to the database
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
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
/* the query to SELECT all from products is stored in results, which is an array object */ 

        // console.log(results);

        // for (let i = 0; i < results.length; i++){
        //     // console.log(results[i]);
        //     let rowData = results[i];
        //     // console.log(rowData);
        //     console.log(divider + "ITEM ID: "  + rowData.item_id + " " + "||" + " " + "PRODUCT: " + rowData.product_name + " " + "||"  + " " + "PRICE: " + rowData.customer_price + divider)
        // }

        // then set a newArray to the results where the map method is used to set a new array
        const newArray = results.map(rowData => {
            return {
                "Item ID": rowData.item_id,
                "Product Name": rowData.product_name,
                "Price": rowData.customer_price
            };
            
        })
        console.table(newArray);
    //     // console.table(results.map(rowData => {
    //     //     return {
    //     //         "Item ID": rowData.item_id,
    //     //         "Product Name": rowData.product_name,
    //     //         "Price": rowData.customer_price
    //     //     };
    //     // })
    // )
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
                    console.log("\nPlease enter a valid id number.\n");
                    return false
                    
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
                console.log("\nPlease enter a number greater then zero.\n");
                return false
            }
        }
    }
]).then(answer => {
            // console.log(answer)
            connection.query("SELECT stock_quantity, customer_price FROM products WHERE ?", {item_id: answer.item_id},
            
            function (err, res) {
                if (err) throw err;
                console.log(res)
                console.log(res[0].stock_quantity);
                console.log(res[0].customer_price);

                let quantity = res[0].stock_quantity;
                let updateQuantity = quantity - parseInt(answer.quantity)
                let price = res[0].customer_price;
                let totalSale = price * parseInt(answer.quantity);
                // console.log(totalSale);

                if (quantity < answer.quantity) {
                    console.log("Not enough in stock");
                    orderSomethingElse();
                } else {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                       [{
                           stock_quantity: updateQuantity, 
                       },
                       {
                           item_id: answer.item_id
                       }
                    ], 
                    function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("\nOrder Confirmed\n")
                            console.log("Total Cost: " + totalSale)
                            orderSomethingElse();
                        }
                    }
                    )
                }
            }
           

            )
            // console.log(connection.query());

            // INSERT use when want to add dataup

            // into row where ID equals 

            // update table  set quantity equals new qanity where is the row containing information
            
  });

}

function orderSomethingElse() {
    inquirer
    .prompt([
        {
            type: 'confirm',
            name: 'more',
            message: "Would you like to order something else?"
        }
    ]).then(answer =>{
        if(answer.more == true) {
            displayItems();
        } else {
            connection.end();
            console.log("Goodbye - come again.")
        }
    })
}
// orderSomethingElse(); 


