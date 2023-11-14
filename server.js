// Importing the Express.js framework
const express = require('express');
// Importing the body-parser middleware for parsing request bodies
const bodyParser = require('body-parser');
// Create an instance of the Express application called "app"
const app = express();

// Use bodyParser middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Load product data from a JSON file and initialize total_sold property
let products = require(__dirname + '/products.json');
products.forEach((prod, i) => { prod.total_sold = 0 });

// Route to provide product data as a JavaScript file
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

// Handle form submission via POST request
app.post("/process_form", function (request, response) {
    // Get the quantities from the request body
    let qtys = request.body[`quantity_textbox`];
    let valid = true;
    let url = '';
    let soldArray = [];

    // Validate and process each quantity
    for (i in qtys) {
        let q = Number(qtys[i]);

        if (validateQuantity(q) == '') {
            if (products[i]['qty_available'] - Number(q) < 0) {
                valid = false;
                url += `&prod${i}=${q}`;
            } else {
                soldArray[i] = Number(q);
                url += `&prod${i}=${q}`;
            }
        } else {
            valid = false;
            url += `&prod${i}=${q}`;
        }

        if (url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
            valid = false;
        }
    }

    // Redirect based on validation result
    if (valid == false) {
        response.redirect(`store.html?error=true` + url);
    } else {
        // Update product data and redirect to the invoice page
        for (i in qtys) {
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('invoice.html?' + url);
    }
});

// Middleware to log all other requests
app.all('*', function (request, response, next) {
    next();
});

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`Server listening on port 8080`));

// Function to validate the quantity input
function validateQuantity(quantity) {
    if (isNaN(quantity)) {
        return "Not a Number";
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        return "Negative Inventory & Not an Integer";
    } else if (quantity < 0) {
        return "Negative Inventory";
    } else if (!Number.isInteger(quantity)) {
        return "Not an Integer";
    } else {
        return "";
    }
}
