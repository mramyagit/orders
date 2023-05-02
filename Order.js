const mongoose = require("mongoose");

// Model for a Customers
mongoose.model("Order", {
    CustomerId: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    BookId: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    initialDate: {
        type: Date,
        require: true
    },
    deliveryDate: {
        type: Date,
        require: true
    }
});