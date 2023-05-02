// Load Express
const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
require("./Order.js");

const Order = mongoose.model("Order");

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://192.168.1.2:27017/ordersDb', () => {
    console.log("Database connected");
});

//get Service
app.get('/', (req, res) => {
    res.send("This is order service");
})

app.post('/order', async (req, res) => {
    // this is our create function
    var newOrder = {
        CustomerId: mongoose.Types.ObjectId(req.body.CustomerId),
        BookId: mongoose.Types.ObjectId(req.body.BookId),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    // create a new order 
    var savOrder = new Order(newOrder);
    savOrder.save().then(() => {
        console.log('New Order created')
    }).catch((err) => {
        console.log(err)
    })
    res.send('New order added to database');
})


app.get("/orders", (req, res) => {
    Order.find().then((orders) => {
        res.json(orders);
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})

app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if (order) {

            //     axios.get("http://127.0.0.1:4646/customer/6450c9df9eb8929ab8d23f9b").then((response) => {
            //         var orderObject = { customerName: response.data.name, bookTitle: "" }
            //         axios.get("http://127.0.0.1:4545/book/6450c54b555ca1b5d923e5cf").then((response) => {
            //             orderObject.bookTitle = response.data.title
            //             res.json(orderObject)
            //         });

            //     });

            // } else {
            //     res.send('Invalid Order')



            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://customers:4646/customer/' + order.CustomerId,
                headers: {}
            };

            axios.request(config)
                .then((response) => {
                    var orderObject = { customerName: response.data.name, bookTitle: "" }


                    let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: 'http://books:4545/book/' + order.BookId,
                        headers: {}
                    };

                    axios.request(config)
                        .then((response) => {
                            orderObject.bookTitle = response.data.title
                            res.json(orderObject)
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            res.send('Invalid Order')
        }

    }).catch(err => {
        if (err) {
            console.log(err.response.data);
            throw err;
        }
    })
})

app.delete("/order/:id", (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(() => {
        res.send("Order Deleted Successfully");
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
})
// listen
app.listen(4747, () => {
    console.log("Up and Running!! - Orders Service");
})
