const mongoose =require('mongoose');

const productSchema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    qte:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})


const orderSchema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    costumerName:{
        type:String,
        required:true
    },
    products:[{
        name:{
            type:String,
            required:true
        },
        qte:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
    totalPrice:{
        type:Number,
        required:true
    }

})

const idSchema=new mongoose.Schema({
    currentProductId:Number,
    currentOrderId:Number,
    currentInvoiceId:Number
})


const invoiceSchema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    costumerName:{
        type:String,
        required:true
    },
    products:[{
        name:{
            type:String,
            required:true
        },
        qte:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
    totalPrice:{
        type:Number,
        required:true
    }

})


const Product=mongoose.model('Product',productSchema,'Products');
const Order=mongoose.model('Order',orderSchema,'Orders')
const ID=mongoose.model('ID',idSchema,'ids')
const Invoice=mongoose.model('Invoice',invoiceSchema,'Invoices')

module.exports={
    Product,
    Order,
    ID,
    Invoice
}