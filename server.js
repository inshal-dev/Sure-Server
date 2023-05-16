
const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv');
const data = require('./data/productData.json');
const path = './data/productData.json';
const cartData = require('./data/cartData.json');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());

const { writeFile } = require('fs');



app.get('/', (req, res) => {
    try{ 
        res.send(data);
    }
    catch{
        res.send('data not found');
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
        res.send('Error').status(400);
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
        res.send('Error').status(400)
    }
})


//API for comments

app.post('/productComments', async(req, res)=>{
    try{



    }catch{

    }
})




let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running ');
});