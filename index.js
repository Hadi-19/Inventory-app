const express =require('express');
const app=express();
const mongoose=require('mongoose');
const { Product, Order, ID ,Invoice} = require('./database/models');
require('dotenv').config()
//const dbURI='mongodb+srv://hadi:2001@test-cluster1-0pkky.mongodb.net/gestion-stock?retryWrites=true&w=majority';
const dbURI=process.env.DB_URI


mongoose.connect(dbURI,{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=>{
    console.log('Mongo DB connected...')
    app.listen(3001,()=>console.log('listening'))
}).then(()=>{

    mongoose.connection.db.collection('ids').countDocuments((err,count)=>{
        if(err){console.log(err);}
        if(count===0){
            console.log('first time');
            let currentIDS=ID({currentProductId:0,currentOrderId:0,currentInvoiceId:0}).save(function(err,data){console.log('indexes initied');})
    
        }
        else{console.log('not the first time');}
    })

})
.catch(err => console.log(err+"\n can't connect to mongoDB"));






/*let products=[
    {
        id:1,
        name:"laptop",
        qte:10,
        price:100000.00
    },
    {
        id:2,
        name:"USB",
        qte:50,
        price:1500.00
    }
]*/
let currentProductId;

/*let orders=[
    {
        id:1,
        costumerName:"hadi",
        products:[
            {
                name:"laptop",
                qte:2,
                price:200000
            },
            {
                name:"USB",
                qte:12,
                price:18000
            }
        ],
        totalPrice:218000
    },
    {
        id:2,
        costumerName:"moncef",
        products:[
            {
                name:"laptop",
                qte:3,
                price:300000
            },
            {
                name:"USB",
                qte:10,
                price:15000
            }
        ],
        totalPrice:315000
    }
]*/
//let orders=[]
let currentOrderId;
let currentInvoiceId;



app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static('./'));

app.use((req,res,next)=>{
    ID.find({},function(err,ids){
        currentProductId=ids[0].currentProductId;
        currentOrderId=ids[0].currentOrderId;
        currentInvoiceId=ids[0].currentInvoiceId;
       
    }).then(()=>{next();})
    .catch(err=>console.log(err))
   
})



app.get('/products',(req,res)=>{
    Product.find({},function(err,products){
       
        if(err) throw err;  
        res.json({products:products})
    })
    
})

app.post('/products',(req,res)=>{

   
    
   
   const name=req.body.name;
   const qte=req.body.qte;
   const price=req.body.price;
 
   Product.find({},function(err,products){
    if(err) throw err; 
    else{

    for(let product of products){
        if(name===product.name){
            res.send('already exists')
           
            return false
            
            
           
            
        }
    }
  
    
 
    if(name && qte>0 && price>=0 ){
        
        ID.updateOne({},{$inc:{currentProductId:1}}).then(()=>{
          currentProductId++;  
         let newProduct=Product({id:currentProductId,name,qte,price}).save(function(err,data){
             if(err) throw err;
            
             res.send('successfully created product')
         });
       
 
        })
        .catch(err=>console.log(err))
     
    
    }
    else{
          res.send('invalid inputs') }
       
    }

    
})
   
  
})
app.put('/products/:id',(req,res)=>{
   
    const name=req.body.name;
    const qte=req.body.qte;
    const price=req.body.price;
    const id=+req.params.id;
  
   if(name &&qte>0 && price>=0){
    

        Product.find({},function(err,products){
            if(err) throw err; 
            
       
            for(let produit of products){
                if(name===produit.name && id!==produit.id){
                    Product.updateOne({id},{qte,price}).then().catch(err=>console.log(err))
                    res.send('successfully updated product except name because it already exists')
                    return false
                }
            }
            Product.updateOne({id:id},{name,qte,price}).then().catch(err=>console.log(err))
    
    
        

    
     res.send('successfully updated product')
        
})
            
}
    else{
        res.send('invalid inputs')
    }

 })

 app.put('/product/:name',(req,res)=>{
    // res.json({products:products})
  
    const qte=+req.body.qte;
   
    const name=req.params.name;
  Product.findOne({name:name},function(err,product){
    if (err) throw err;
    const id=product.id
   
    if(qte!==product.qte && qte<product.qte &&qte>=0){
       
        if(qte===0){
            ID.updateOne({},{currentProductId:--currentProductId}).then(()=>{
                Product.deleteOne({name},function(err){
                    if(err) throw err
                    
        
                    Product.find().countDocuments((err,count)=>{
                        if(err) throw err
                      
                        for(let i=id;i<=count;i++){
                           
                        Product.updateOne({id:i+1},{id:i}).then().catch(err=>console.log(err))
                        }
                    })
                    res.send('successfully deleted product')
        
                })
            }).catch(err=>console.log(err))
       

     }
     else{
        Product.updateOne({name},{qte},function(err,data){if(err)throw err})
         
        res.send(' product quantity decreased')}
 
     }
     else{
         res.send('invalid order')
     }


  })
    
   /* else{
        res.send('false order')
    }*/
    
    
    
    
        

  
 })
 app.delete('/products/:id',(req,res)=>{
   
    
    let id=+req.params.id;
    ID.updateOne({},{currentProductId:--currentProductId}).then(()=>{
        Product.deleteOne({id},function(err){
            if(err) throw err
            

            Product.find().countDocuments((err,count)=>{
                if(err) throw err
              
                for(let i=id;i<=count;i++){
                   
                Product.updateOne({id:i+1},{id:i}).then().catch(err=>console.log(err))
                }
            })
            res.send('successfully deleted product')

        })
    }).catch(err=>console.log(err))
  
  

    })

 //--------------Orders-----------------
 app.get('/orders',(req,res)=>{
     res.sendFile('./orders.html',{root:__dirname})
 })
 app.get('/productsnamesandqtes',(req,res)=>{
    
    Product.find({},function(err,products){
       
        if(err) throw err;  

        let productsProperties=products.map(product=>{
            return [product.name,product.qte,product.price];
        })

        res.json(productsProperties)
       
    })
 })
 app.get('/productqtes/:name',(req,res)=>{
    const name=req.params.name;
       
    Product.find({name:name},function(err,product){
        
        if(err) throw err; 
       
        res.json(product[0].qte) 
    })

    
 })

 app.get('/orderslist',(req,res)=>{
    Order.find({},function(err,orders){
       
        if(err) throw err;  
        res.json({orders})   
    })
   
})
app.post('/orderslist',(req,res)=>{
    
    const costumerName=req.body.costumerName;
    const products=req.body.products;
    const totalPrice=req.body.totalPrice;
   
    
    if(costumerName && products.length>0 && totalPrice>=0){
        
     ID.updateOne({},{$inc:{currentOrderId:1}}).then(()=>{
         currentOrderId++;   
        let newOrder=Order({id:currentOrderId,costumerName,products,totalPrice}).save(function(err,data){
            if(err) throw err;
            
            res.send('successfully created order')
        });
      

       })
       .catch(err=>console.log(err))

    }
    else{
       res.send('invalid order')
   }
 })
app.delete('/orderslist/:id',(req,res)=>{
   
    const id=+req.params.id;
   

   
     ID.updateOne({},{currentOrderId:--currentOrderId}).then(()=>{
        Order.findOneAndDelete({id},function(err,order){
            if(err) throw err
            order.products.forEach(orderedProduct=>{
                Product.findOne({name:orderedProduct.name},(err,product)=>{
                    if(err) throw err
                    if(product){

                       
                        Product.updateOne({name:product.name},{$inc:{qte:orderedProduct.qte}}).then().catch(err=>console.log(err))
                    }
                    else{

                        ID.updateOne({},{$inc:{currentProductId:1}}).then(()=>{
                            currentProductId++;  
                           let newProduct=Product({id:currentProductId,name:orderedProduct.name,qte:orderedProduct.qte,price:orderedProduct.price/orderedProduct.qte}).save(function(err,data){
                               if(err) throw err;
                              
                              
                           });
                         
                   
                          })
                          .catch(err=>console.log(err))
                       
                    }
                })
            })

            

            Order.find().countDocuments((err,count)=>{
                if(err) throw err
              
                for(let i=id;i<=count+1;i++){
                   
                Order.updateOne({id:i+1},{id:i}).then(()=>{console.log('index updated for '+i);}).catch(err=>console.log(err))
                }
            })
            res.send('successfully deleted order')

        })
    }).catch(err=>console.log(err))
 })


 app.delete('/orderslistinvoiced/:id',(req,res)=>{
   
    const id=+req.params.id;
   

   
     ID.updateOne({},{currentOrderId:--currentOrderId}).then(()=>{
        Order.findOneAndDelete({id},function(err,order){
            if(err) throw err
            

            

            Order.find().countDocuments((err,count)=>{
                if(err) throw err
              
                for(let i=id;i<=count+1;i++){
                   
                Order.updateOne({id:i+1},{id:i}).then(()=>{console.log('index updated for '+i);}).catch(err=>console.log(err))
                }
            })
            res.send('successfully deleted order')

        })
    }).catch(err=>console.log(err))
 })



 //--------------Factures(invoices)-------------------------------
 app.get('/invoices',(req,res)=>{
    res.sendFile('./invoices.html',{root:__dirname})
})
 app.get('/invoiceslist',(req,res)=>{
    Invoice.find({},function(err,invoices){
       
        if(err) throw err;  
        res.json({invoices})   
    })
   
})
app.post('/invoiceslist',(req,res)=>{
    
    const costumerName=req.body.costumerName;
    const products=req.body.products;
    const totalPrice=req.body.totalPrice;
   
    
    if(costumerName && products.length>0 && totalPrice>=0){
        
     ID.updateOne({},{$inc:{currentInvoiceId:1}}).then(()=>{
         currentInvoiceId++;   
        let newInvoice=Invoice({id:currentInvoiceId,costumerName,products,totalPrice}).save(function(err,data){
            if(err) throw err;
            
            res.send('successfully created invoice')
        });
      

       })
       .catch(err=>console.log(err))

    }
    else{
       res.send('invalid invoice')
   }
 })

 app.use((req,res)=>{
    res.status(404).send("Error 404 ")
  })

