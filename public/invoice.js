// Variables initialization
let extendedPrices = [];
let extendedPrice = 0;
let subtotal = 0;
let taxAmount = 0;
let shipping = 0;

// Extract order information from URL parameters
let params = (new URL(document.location)).searchParams;
let order = [];

// Populate order array with quantities from URL parameters
params.forEach((value, key) => {
    if (key.startsWith('prod')) {
        order.push(parseInt(value));
    }
});

// Generate item rows dynamically
generateItemRows();

// Calculate subtotal
// Calculate tax
let tax = subtotal * 0.0575;

// Determine shipping price
if (subtotal <= 50) {
    shipping = 2;
} else if (subtotal <= 100) {
    shipping = 5;
} else {
    shipping = subtotal * 0.05;
}

// Calculate total
let total = tax + subtotal + shipping;

// Update footer row values in the HTML
document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
document.getElementById("shipping_cell").innerHTML = "$" + shipping.toFixed(2);
document.getElementById("total_cell").innerHTML = "$" + total.toFixed(2);

// Function to validate quantity
// Returns a string if not a number, negative, not an integer, or a combination of both
// If no errors in quantity, returns an empty string
function validateQuantity(quantity) {
    if (isNaN(quantity)) {
        return "Please Enter a Number";
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        return "Please Enter a Positive Integer";
    } else if (quantity < 0) {
        return "Please Enter a Positive Number";
    } else if (!Number.isInteger(quantity)) {
        return "Please Enter an Integer";
    } else {
        return "";
    }
}

// Generate item rows based on product data
function generateItemRows() {
    let table = document.getElementById("invoiceTable"); // Get the invoice table

    let hasErrors = false; // Flag to check for errors

    // Loop through each product
    for (let i = 0; i < products.length; i++) {
        let item = products[i]; // Get product information
        let itemQuantity = order[i]; // Get quantity from order array

        // Validate quantity
        let validationMessage = validateQuantity(itemQuantity);

        // Handle errors, if any
        if (validationMessage !== "") {
            hasErrors = true;
            let row = table.insertRow(); // Insert a new row
            row.insertCell(0).insertHTML = item.card; // Insert card information
            row.insertCell(1).innerHTML = validationMessage; // Display validation message
        } else if (itemQuantity > 0) {
            // Update variables
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            // Create a new row and insert product information
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name="img">`;
            row.insertCell(1).innerHTML = item.card;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$" + extendedPrice.toFixed(2);
        }
    }
}
