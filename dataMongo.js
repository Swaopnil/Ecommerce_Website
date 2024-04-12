const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./Models/Model01.js");
const cors = require("cors"); // Add parentheses to invoke the cors middleware
var bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors()); // Invoke the cors middleware

mongoose.connect("mongodb+srv://umalkarrenuka:fA4dazZ4V72R9iFm@mongo01.nusyill.mongodb.net/Data-Sign?retryWrites=true&w=majority&appName=Mongo01")
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log("Connection to MongoDB Atlas failed: " + error);
    });

var db = mongoose.connection;
db.on("error", () => console.log("Error in connecting to database"));
db.once("open", () => console.log("Connected to database"));

const PORT = process.env.PORT || 3002;  // Use port from environment variable or default to 3002

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/index.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/index.css');
});
app.get('/product1', (req, res) => {
    res.sendFile(__dirname + '/Product1.html');
});
app.get('/product2', (req, res) => {
    res.sendFile(__dirname + '/Product2.html');
});
app.get('/product3', (req, res) => {
    res.sendFile(__dirname + '/Product3.html');
});
app.get('/product4', (req, res) => {
    res.sendFile(__dirname + '/Product4.html');
});
app.get('/product5', (req, res) => {
    res.sendFile(__dirname + '/Product5.html');
});
app.get('/product6', (req, res) => {
    res.sendFile(__dirname + '/Product6.html');
});
app.get('/product7', (req, res) => {
    res.sendFile(__dirname + '/Product7.html');
});
app.get('/product8', (req, res) => {
    res.sendFile(__dirname + '/Product8.html');
});
app.get('/Orders', async (req, res) => {
    try {
        // Fetch all products from the database
        const allProducts = await Product.find();

        // Render an HTML page with the products table and CSS styles
        let htmlResponse = `
            <html>
            <head>
                <title>Orders</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #F6F6F6;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #8785A2;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        background-color: #FFF;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #FFC7C7;
                        color: #8785A2;
                    }
                    td {
                        color: #333;
                    }
                    .home-btn {
                        margin-bottom: 20px;
                        background-color: #FFE2E2;
                        color: #8785A2;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .home-btn:hover {
                        background-color: #FFC7C7;
                    }
                    .cancel-btn {
                        background-color: #FF6B6B;
                        color: #fff;
                        border: none;
                        padding: 8px 16px;
                        font-size: 14px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s, transform 0.2s;
                    }
                    
                    .cancel-btn:hover {
                        background-color: #FF5252;
                        transform: scale(1.05);
                    }
                    
                    .cancel-btn:active {
                        transform: scale(0.95);
                    }
                    .estimate-column {
                        color: #333;
                    }
                    
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>All Orders</h1>
                    <button class="home-btn" onclick="goToHome()">Home</button>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Estimate</th>
                            <th>Action</th>
                        </tr>`;

        // Loop through all products and add them to the table
        allProducts.forEach(product => {
            // Calculate estimate by adding 5 days to the createdAt timestamp
            const orderDate = new Date(product.createdAt);
            orderDate.setDate(orderDate.getDate() + 5);
            const formattedEstimateDate = orderDate.toDateString();

            htmlResponse += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td class="estimate-column">${formattedEstimateDate}</td>
                    <td><button class="cancel-btn" onclick="cancelOrder('${product._id}')">Cancel Order</button></td>
                </tr>`;
        });

        // Close the table and HTML document
        htmlResponse += `
                    </table>
                </div>
                <script>
                    function goToHome() {
                        window.location.href = '/';
                    }
                    
                    function cancelOrder(orderId) {
                        fetch('/cancelOrder/' + orderId, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (response.ok) {
                                // Reload the page after successful deletion
                                window.location.reload();
                            } else {
                                alert('Failed to cancel order');
                            }
                        })
                        .catch(error => console.error('Error cancelling order:', error));
                    }
                </script>
            </body>
            </html>`;

        // Send the HTML response with the products table and styles
        res.send(htmlResponse);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});





// Assuming you're using Express.js
app.delete('/cancelOrder/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // Logic to delete the order from the database based on orderId
        // For example:
        await Product.findByIdAndDelete(orderId); // Assuming Product is your model for orders
        res.sendStatus(200); // Send a success response
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.sendStatus(500); // Send a server error response
    }
});




app.post('/cart', async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price * req.body.quantity
        };

        const product = await Product.create(userData);
        console.log("Record inserted successfully");

        // // const allProducts = await Product.find();
        // res.redirect('/');
        // // res.json(allProducts); // Send JSON response with all products
        const htmlResponse = `
            <html>
            <head>
                <script>
                    window.onload = function() {
                        alert('Order placed successfully!');
                        // Redirect the user to another page if needed
                        window.location.href = '/';
                    };
                </script>
            </head>
            <body>
                <h1>Order Placed Successfully!</h1>
            </body>
            </html>
        `;

        // Send the HTML response with the popup message
        res.send(htmlResponse);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
