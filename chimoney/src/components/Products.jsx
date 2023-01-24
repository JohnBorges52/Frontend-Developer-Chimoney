import React from 'react';
import "../style/products.scss";
import  { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Notification from './Notification';

import ItemContainer from './ItemContainer';
import TopNav from './TopNav';


export default function Products() {

  const pageSize = 15;
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [range, setRange] = useState({
    initial: 1,
    final: 15
  })
  const [shoppingCart, setShoppingCart] = useState([]);
  const [qty, setQty] = useState(1)

  const [isNotification, setIsNotification] = useState(false)

  const handleChange = (event, value) => {
    setCurrentPage(value);
    setRange({initial:((value * pageSize)-pageSize - 1), final: value * pageSize})
    
  };

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-API-KEY': '5fa47041cf1bca32b11f72a3bac177bcbec210479c06821401b5e3501ca7e262'
    }
  };

  const getItems = () => {

    fetch('https://api.chimoney.io/v0.2/info/assets', options)
      .then(response => response.json())
      .then(response => setItems(response.data.giftCardsRLD.content))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    const data = localStorage.getItem('cart');
    if(data){
      setShoppingCart(JSON.parse(data))
    }
    getItems();
    
  }, [])


  useEffect(()=>{
    // localStorage.setItem("cart", JSON.stringify(shoppingCart))
  },[shoppingCart])

  const addItem = (itemId, itemName, itemQuantity) => {
    const product = [itemId, itemName, itemQuantity]
    if(shoppingCart.length === 0){
      setShoppingCart([...shoppingCart, product])
    } else{
        const isInside = shoppingCart.filter(item => item[0] === itemId);
        if(isInside.length ===0){
          setShoppingCart([...shoppingCart, product])
        } else{
          shoppingCart.map(element => {
            if(element[0]=== itemId){
              element[2]++
            }
          })
        }
    }
    localStorage.setItem("cart", JSON.stringify(shoppingCart))
}

const addNotification = () =>{

  const element = document.getElementById("animation");
  console.log(element)
  
  if(element.classList.contains("animationBounce")){
    
    element.classList.remove("animationBounce");
    console.log("I removeD", element)
    setInterval(()=>{
      element.classList.add("animationBounce");
    },20)

  } else{
    element.classList.contains("animationBounce")
    element.classList.add("animationBounce");
  }
}





  return (
    <div className='products-main-container'>
      <TopNav />
    <div className='products-browser-container'>
      
      <Notification 
      message={"You added this item to your cart"}
      isCart={false}
      />
    

    {items.map((element, index) => {
        if (index >= range.initial && index <= range.final) {
          return (
            <ItemContainer 
            key={element.productId} 
            image={element.img} 
            imgalt={element.name} 
            description={element.productName} 
            price={element.senderFee} 
            currency={element.senderCurrencyCode} 
            type={element.type} 
            country={element.country.name} 
            redeem={element.description} 
            addItem={()=> {addItem(element.productId, element.name, 1); addNotification()}} 
            onDelete={()=> {console.log(shoppingCart)}}
            quantity={qty}
            productPage={true}
            />
          )
        }
      })}
    </div>

      <div className='pagination-container'>
      <Stack spacing={2}>
        <Pagination count={Math.ceil(items.length / pageSize)} size="small" color="secondary" page={currentPage} onChange={handleChange}/>
      </Stack>

      </div>
    </div>
  )
}
