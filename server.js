
const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv');
const data = require('./data/productData.json');
const path = './data/productData.json';
const cartData = require('./data/cartData.json');
const cityList = require('./data/cities.json');
const userCart = require('./data/product_cart_data.json');
const addressCart = require('./data/selectedData.json');
const addressList = require('./data/addressData.json');
const placedItem = require('./data/placed-item.json')

const bodyParser = require('body-parser'); 



const app = express();
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended: true

}));

app.use(bodyParser.json());

const { writeFile } = require('fs');



app.get('/', (req, res) => {
    try{ 
        res.send(data);
    }
    catch{
        message = 'Data not Found'
        res.send(message);
    }
});

//for data post
app.post('/addData', (req, res) => {
    try{
        const postData = req.body;
        productData = data;
        data.push(postData); 
        writeFile('./data/productData.json', JSON.stringify(data), 'utf8', ()=> console.log(JSON.stringify(data)));
        // appendFile('./data/productData.json', JSON.stringify(postData), 'utf8', ()=> console.log(JSON.stringify(data)))
        res.send(data).status(200);
    }catch{
        message = 'Not able to add product'

        res.send(message).status(400);
    } 
});

//add to cart
app.post('/cart', async (req, res)=> {
    try{
        let indexOfItem;
        let cartValue;
 
        const cartItem = req.body.item;
        //assigning CartData.json file data to a array 
        let cartList = cartData; 
        //Step 1: ^ 
        // Step 2: Below code gives value only if item already exist in cartData.json file.
        //It will return two values 1: Boolean, 2: Index of Item
        cartList.filter(x => { 
            if(x.product_id == cartItem.product_id) {
                console.log('x:'+ x.product_id, 'cartItem:' + cartItem.product_id )
                console.log(x.product_id == cartItem.product_id)
                return cartValue = true,  indexOfItem = cartList.indexOf(x);
                 
            }else if(x.product_id !== cartItem.product_id){
                return cartValue != cartValue
            }else{
                return 0;
            }
        })
       console.log('indexofItem: ' + indexOfItem, 'Boolean Value ' + cartValue)

        //Step 3: 

        //Condition 
        if(cartValue && cartList[indexOfItem].productQuantity >= 1){
            console.log('Line 112: cartValue == true && productQuantity >=1')
            cartList[indexOfItem].productQuantity += 1;
            await writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Cart List is updated with incrementation of productQuantity'))  
        }
        //Step 4: if cartValue is false  && productQuantity >=1
        // then it will create a new key in the object with initial value of 1 and push to cartList
        else if(cartValue == undefined || cartValue == false){
            console.log('Line 120: cartValue == false && productQuantity == undefined')
            cartItem.productQuantity = 1;
            cartList.push(cartItem)   
            await writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Cart list updated with new object'))
        } 
        res.status(200).json(cartData)
    }
    catch{ 
        res.send('Cart List not updated');
    }
})

//remove whole items from cart 
app.post('/cart-remove', async(req, res)=>{
    try{
        const delItem = await req.body.id;
        // console.log(delItem)
        let cartList = cartData;
        let cartID;
        cartList.map(x =>{ 
            cartID = x.product_id == delItem;  
            if(cartID){ 
                cartList.splice(cartList.indexOf(x), 1);
            } 
        }) 
        await writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Item removed'))
        res.send(cartList).status(200)


    }catch{
        res.send('error found').status(400)
    }
})

//remove a product quantity from cart 
app.post('/cart-remove-item', async (req, res)=>{
    try{
        const itemId = req.body.product_id;
        let cartList = cartData;
        console.log(itemId)
        cartList.map((el)=> { 
            if(el.product_id == itemId){
                console.log('132: Condition true')
                if(el.productQuantity >1){
                    console.log('134: product quantity > 1')
                    el.productQuantity -= 1;
                    console.log('136: Decremented the item by 1 = 1--')
                }else{
                    cartList.splice(cartList.indexOf(el), 1);
                    console.log('139: Whole Item removed')
                }
                
                
            }else{
                console.log('element not found');
            }
        })
        await writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Item removed'))
        res.send('Item removed')
    }catch{
        res.send('Error').status(400)
    }
})

//get cart value 
app.get('/cart-item', async(req, res)=>{
    try{ 
        if(cartData){  
            let cart = cartData.sort((a,b)=>{
                return a.product_id < b.product_id ? -1 : 1;
            }) 
            res.send(cart);
        }
    }catch{
        msg = "ERROR"
        res.send(msg).status(400)
    }
})

//BuyNow API
app.post('/buy-now', async(req, res)=>{
    try{
        const cartList = cartData;
        const cartItem = req.body.item;
        // if(cartList.includes(cartItem.product_id)){
        //   res.send('Data exists');
        //  }else{ 
        //     cartItem.productQuantity = 1;
        //     cartList.push(cartItem)
        //     await writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Line 196: New Item add to cart for BuyNow'))
        // }
        let item = cartList.find(el => el.product_id == cartItem.product_id)
        if(item){
            res.send('Data exists');
        }else{
            console.log('Line 192: productQuantity not exist');
            cartItem.productQuantity = 1;
            cartList.push(cartItem)
            writeFile('./data/cartData.json', JSON.stringify(cartList), 'utf8', ()=> console.log('Line 196: New Item add to cart for BuyNow'))
        }

    }catch{
        let ERROR = 'error'
        res.send(ERROR).status(400)
    }
})


//API for comments

app.post('/productComments', async(req, res)=>{
    try{ 
    }catch{ 
    }
})

//Address storing 
app.post('/user-address', async(req, res)=>{
    try{
        const date = new Date().getTime();
        const location = req.body.item;
        const addressData = addressList
        location.id = 100 + date + Math.random() 
        addressData.push(location) 
        if(location){
            await writeFile('./data/addressData.json', JSON.stringify(addressData), 'utf8', ()=> console.log('address added'))
            res.send('Address added').status(200)
        }
    }catch{
        res.send('check error').status(400) 
    }
})

//Get Address 
app.get('/address', async(req, res)=>{
    try{
        const addressData = addressList;
        if(addressData != ''){
            res.send(addressData).status(200)
        }
    }catch{
        res.send('Error').status(400)
    }
})

//delete address
app.post('/remove-address', async(req, res)=>{
    try{
        const addressData = addressList;
        const addressId = req.body.id; 
        let address;
        addressData.find(el => { 
           if(el.id === addressId){
               address = el
           }  
        })  
        console.log(address); 
        if(address){
            addressData.splice(addressData.indexOf(address), 1) 
            await writeFile('./data/addressData.json', JSON.stringify(addressData), 'utf8', ()=> console.log('Address Removed'))
            res.send('Address Removed').status(200)
        }else{
            console.log('Value is not removed');
        }
    }catch{
        msg = "Error";
        res.send(msg).status(400)
    }
})

//update address 
app.post('/update-address', async(req, res)=>{
    try{
        const addressData = addressList;
        const updatedAddress = req.body.item;
        addressData.splice(addressData.indexOf(updatedAddress), 1);
        addressData.push(updatedAddress);
        setTimeout(()=>{
            writeFile('./data/addressData.json', JSON.stringify(addressData), 'utf8', ()=> console.log('Address Removed'))
        }, 500)
    }catch{
        msg = "Error"
        res.send(msg).status(400)
    }
})


//user-cart-data  
app.post('/cart-data', async(req, res)=>{
    try{
        const productDataItem = req.body.productData; 
        await writeFile('./data/product_cart_data.json', JSON.stringify(productDataItem), 'utf8', ()=> console.log('Data Added'))
         res.send('data update on cart').status(200)
    }catch(error){ 
        res.send(error).status(400)
    }
})

//select address data
app.post('/selected-address', async(req, res)=>{
    try{
        const addressDataItem = req.body.addressData; 
        await writeFile('./data/selectedData.json', JSON.stringify(addressDataItem), 'utf8', ()=> console.log('Data Added'))
         res.send('data update on cart').status(200)
    }catch(error){ 
        res.send(error).status(400)
    }
})


//get Address| product Data  
app.get('/viewCart', async(req, res)=>{
    try{
        add = []
        const addressData = addressCart;
        const productData = userCart;
        add = [ addressData ] 
        res.send({productData, add}).status(200) 
    }catch(err){
        res.send(err).status(400)
    }
})

//add payment type in product section
app.post('/payment-option', async(req, res)=>{
    try{
        const paymentOption = req.body.type;
        const productData = userCart;
        const addressData = addressCart;
        const placedItems = placedItem;
        let placedItem = {
            paymentMethod : paymentOption,
            productDetails: productData,
            addressDetails: addressData
        }                                 
        placedItems.push(placedItem)
        
        await writeFile('data/placed-item.json', JSON.stringify(placedItems), 'utf8', ()=> console.log('Data Added'))
        res.send(placedItem).status(200)
    }catch(err){
        res.status(400)
    }
})
//send cities 
app.get('/cities', async(req, res)=>{
    const city = cityList;  
    res.send(city).status(200)
})

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running ');
});