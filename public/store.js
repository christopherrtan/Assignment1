// Extract query parameters from the URL
let params = (new URL(document.location)).searchParams;

// Initialize variables for error handling and order information
let error;
let order = [];

// Retrieve error status from query parameters
error = params.get('error');

// Populate the order array with item amounts from previous attempts
params.forEach((value, key) => {
    if (key.startsWith('prod')) {
        order.push(parseInt(value));
    }
});

// Display error message if an error is present
if (error === 'true') {
    document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger">Quantity Error - Please Fix!</h2><br>`;
}

// Loop through each product in the array and generate product cards dynamically
for (let i = 0; i < products.length; i++) {
    // Construct HTML for the product card
    document.querySelector('.row').innerHTML +=
        `<div class="col-md-6 product_card mb-4">
        <div class="card">
            <div class="text-center">
                <img src="${products[i].image}" class="card-img-top border-top" alt="Product Image">
            </div>
            <div class="card-body">
                <h5 class="card-title">${products[i].card}</h5>
                <p class="card-text">
                    Price: $${(products[i].price).toFixed(2)}<br>
                    Available: ${products[i].qty_available}<br>
                    Total Sold: ${products[i].total_sold}
                </p>
                
                <!-- Input for quantity with validation -->
                <input type="text" placeholder="0" name="quantity_textbox" id="${[i]}" class="form-control mb-2" 
                    oninput="validateQuantity(this)" value="${order[i] !== 0 && order[i] !== undefined ? order[i] : ''}" 
                    onload="validateQuantity(this)">
                <p id="invalidQuantity${[i]}" class="text-danger"></p>
            </div>
        </div>
    </div>`;

    // Run the validation function for each input element
    validateQuantity(document.getElementById(`${[i]}`));
}

// Validation function to generate and display validation messages
function validateQuantity(quantity) {
    // Initialize variables and convert the quantity value to a number
    let valMessage = '';
    let quantityNumber = Number(quantity.value);

    // Display the validation message in the corresponding element
    document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = "validationMessage";

    // Check for various validation conditions and set the validation message
    if (isNaN(quantityNumber)) {
        valMessage = "Please Enter a Number";
    } else if (quantityNumber < 0 && !Number.isInteger(quantityNumber)) {
        valMessage = "Please Enter a Positive Integer";
    } else if (quantityNumber < 0) {
        valMessage = "Please Enter a Positive Value";
    } else if (!Number.isInteger(quantityNumber)) {
        valMessage = "Please Enter an Integer";
    } else if (quantityNumber > products[quantity.id]['qty_available']) {
        valMessage = "Not Enough Items in Stock!";
    } else {
        valMessage = '';
    }

    // Display the validation message in the corresponding element
    document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = valMessage;
}
