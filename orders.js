const selecte =document.querySelector('#create-order-input')
const orderQte=document.querySelector('#order-qte')
const tbody=document.querySelector('tbody.first');

selecte.innerHTML=`<option  value="-----">-------------</option>`

// f property example "laptop":{qte:10,price:50000}
const  f={};
// copienames contains the property names of f object
let copieNames=[]

function IndexHandler(x) {
  
  for(let i=0;i<x.children.length;i++){
    x.children[i].childNodes[1].innerHTML=`${i+1}`;
    
  }
}
function summ(){
  
  const amount=document.querySelectorAll('.price')

  let sum=0;
  for(let a of amount){
    sum+=+a.value;
    
  }
  total.innerHTML="The total amount is: "+sum+" DA"
  return sum;
}
const getProductNamesAndQTes=()=>{
fetch('/productsnamesandqtes',{method:'GET',headers:{'Content-Type':'Application/json'}}).then(res=>res.json())
    .then(res=>{
        
       
    
        selecte.innerHTML=""
        
        
       res.forEach(product => {
           
       
        selecte.innerHTML+=`<option  value="${product[0]}">${product[0]}</option>`
      
        f[product[0]]={qte:product[1].toString(),price:product[2]}
    

       });
      
       
       
       
       
      
       orderQte.max=f[selecte.value].qte
      
       copieNames=[...Object.keys(f)]
     
    })
  
  }
 getProductNamesAndQTes();

 const getProductQTes=(name,qte)=>{
              
  const quantityWarning=document.querySelectorAll('.qte-warn')
  const last=quantityWarning[quantityWarning.length-1]
  
   last.innerHTML="Less than 5 items will be remaining"
 
  fetch('/productqtes/'+name,{method:'GET',headers:{'Content-Type':'Application/json'}}).then(res=>res.json())
    .then(res=>{
      result=res-qte
      if(result<5){


        last.style.opacity="1";
        
            setTimeout(()=>{
                last.style.transition=" opacity 5s ease-out"
       
                last.style.opacity="0";
            },3000)
            setTimeout(()=>{
                
        last.style.transition="none"
            },8000)
            console.log("less than 5");
      }
    })

 }    


 const selecteChange= ()=>{
    
  
  orderQte.value="1"
  orderQte.max=f[selecte.value].qte
   
   
}
//dd();



const subform = document.querySelector('#sub-form')
let currentSubId=1



const handleSubSubmit=(e)=>{
  e.preventDefault();
  
  const name=document.querySelector('#create-order-input').value
  const qte=document.querySelector('#order-qte').value
 
  
  if(name && name!=="----------" &&qte>0){
     //const myaw= Array.from(tbody.children).indexOf(document.querySelector('#id').parentNode)
      tbody.innerHTML+=`\
      <tr class="row" >\
      <td id="id"></td>\
      <td><input type="text" class="name" value="${name}" readonly></td>\
      <td><input type="number" min="1" class="qte" value="${qte}" max="${f[name].qte}" onchange="changeHandler(this)"></td>\
      <td><input type="number" min="1" class="price" value="${f[name].price*qte}"  readonly>DA</td>\
      <td><button class="update-button" onclick="updateQteHandler(this)">Update</button>\
      <button class="delete-button" onclick="deleteHandler(this)">Delete</button> </td>\
      <td><span class="qte-warn" id="invalid-update"></span>\
      </td>\
  </tr>`
    // show amount and total
const thead=document.querySelector('thead.first')
const total=document.querySelector('#total')

  if(tbody.children.length===1){
    total.style.display="block";
    thead.style.display="table-header-group"

   
  }
 summ()
 
 // console.log(document.querySelector('#id').parentNode);
 //console.log(Array.from(tbody.children).indexOf(document.querySelector('#id').parentNode));
currentSubId++;
IndexHandler(tbody);
  
getProductQTes(name,qte); 


selecte.innerHTML=""
        
copieNames=copieNames.filter(namee=>namee!==name)      
if(copieNames[0]){
  

            for(let namee of copieNames){
              
              
            selecte.innerHTML+=`<option  value="${namee}">${namee}</option>`
              
            }
            orderQte.value="1"
            orderQte.max=f[selecte.value].qte
            
            
           
                }
                else{
                  selecte.innerHTML=`<option  value="----------">----------</option>`
                }
              }
    else if(!qte){
      selecte.innerHTML=""
        
    
if(copieNames[0]){
  

            for(let namee of copieNames){
              
              
            selecte.innerHTML+=`<option  value="${namee}">${namee}</option>`
              
            }
            orderQte.value="1"
            orderQte.max=f[selecte.value].qte
            
            
    }
  
    }
    else{
  
      selecte.innerHTML=`<option  value="----------">----------</option>`
    }
 
}
subform.addEventListener('submit',handleSubSubmit)




const updateQteHandler=(target)=>{
  //const invalidUpdate=document.querySelector('#invalid-update')
    
    const tr=target.parentNode.parentNode;
    const tds= tr.childNodes
  
    //const id= tds[1].innerHTML;
    //const name=tds[3].firstChild.value.trim();
    const qte=+tds[5].firstChild.value;
   // tds[5].firstChild.value=qte+"";
    //tds[5].firstChild.setAttribute('value',qte);
    console.log(qte)
    tds[5].firstChild.setAttribute('value',qte);
    const invalidUpdate=tds[11].firstChild;
    //const price=+tds[7].firstChild.value;
    if(!qte){
      invalidUpdate.innerHTML="invalid quantity"
  

    invalidUpdate.style.opacity="1";
    setTimeout(()=>{
      invalidUpdate.style.transition=" opacity 5s ease-out"

      invalidUpdate.style.opacity="0";

    },3000)
    setTimeout(()=>{
      invalidUpdate.style.transition=" none"

    },8000)
  }
 

}

const changeHandler=(target)=>{
  

  const tr=target.parentNode.parentNode;
  const tds= tr.childNodes
 
  let amount=tds[7].firstChild;
  const name=tds[3].firstChild.value.trim();
  //const qte=+tds[5].firstChild.value;
  let qte=+target.value;
  
  
  
  //const price=+tds[7].firstChild.value;
  const price=f[name].price;
  amount.value=price*qte+"";
  
  target.value=qte+"";
  summ();
}

const deleteHandler=(target)=>{
  const tr=target.parentNode.parentNode;
  const tbody=tr.parentNode;
  const tds= tr.childNodes
  
    
  const name=tds[3].firstChild.value.trim();
  copieNames.push(name)
  
  selecte.innerHTML=""
        
       
  if(copieNames[0]){
    
  
              for(let namee of copieNames){
                
                
              selecte.innerHTML+=`<option  value="${namee}">${namee}</option>`
                
              }
              orderQte.value="1"
              orderQte.max=f[selecte.value].qte
              
              
             
  }
  else{
    selecte.innerHTML=`<option  value="----------">----------</option>`
  }         
              
    
  tr.remove();
  IndexHandler(tbody)
  summ();
  const thead=document.querySelector('thead.first')
const total=document.querySelector('#total')

  if(tbody.children.length<1){
    total.style.display="none";
    thead.style.display="none"

   
  }
  currentSubId--;
}


const getOrdersList=()=>{
  fetch('/orderslist',{method:'GET',headers:{'Content-Type':'Application/json'}}).then(res=>res.json())
  .then(res=>{
      
      const tbody2=document.querySelector('tbody.second');
     
      
      tbody2.innerHTML="";
      res.orders.forEach((order,index) => {
          
          tbody2.innerHTML+=`\
          <tr>\
          <td>${order.id}</td>\
          <td>${order.costumerName}</td>\
          <td> \  
              <table class="third fourth" style="text-align: center; " border="1">\                
                     
              </table>\
          </td>\
          <td>${order.totalPrice} DA</td>\
          <td><button onclick="deleteOrder(this)">delete</button><button data-modal-target="#modal1" onmouseenter="showOrder(this)">Show</button></td>\        
          </tr>`
          const innerTable=document.querySelectorAll('table.fourth')[index]
          order.products.forEach((product)=>{
            innerTable.innerHTML+=` <tr >\
            <td style="width: 100px;">${product.name}</td>\
            <td style="width: 100px;">${product.qte}</td>\
            <td style="width: 100px;">${product.price} DA</td>\
        </tr>`
          })

      })
    })


  
                
}
const deleteOrder=(target)=>{
  const tr=target.parentNode.parentNode;
    const tds= tr.childNodes
   
    const id= tds[1].innerHTML;
    /*const name=tds[3].firstChild.value;
    const qte=+tds[5].firstChild.value;*/
  
    fetch('/orderslist/'+id,{method:'DELETE',headers:{'Content-Type':'Application/json'}}).then(res=>{
       
         return  res.text();})
        .then(res=>{
            console.log(res);
            getProductNamesAndQTes();
            getOrdersList();
        })
}
const orderForm=document.querySelector('#create-order-form');
const handleOrderSubmit=(e)=>{
  e.preventDefault();
  const costumerName=document.querySelector('#costumer-name').value.trim();
  const invalidCostumerName=document.querySelector('#invalid-costumer-name')
  const thead=document.querySelector('thead.first')
const total=document.querySelector('#total')
  const totalPrice=summ();
  if(!costumerName){
    invalidCostumerName.style.opacity="1";
    setTimeout(()=>{
      invalidCostumerName.style.transition=" opacity 5s ease-out"

      invalidCostumerName.style.opacity="0";

    },3000)
    setTimeout(()=>{
      invalidCostumerName.style.transition=" none"

    },8000)
    return false
  }

  if(tbody.children.length>0)
  
  {
   
  //ordered products array
  let products=[]
  let name,price,qte;

  let errors=false;
 
    for(let i=0;i<tbody.children.length;i++){
      name=tbody.children[i].children[1].firstElementChild.value;
      qte=+tbody.children[i].children[2].firstElementChild.value;
      price=+tbody.children[i].children[3].firstElementChild.value;
      
      products.push({name,qte,price})
      

      if(qte<=f[name].qte &&qte>0){
      /*  */
      }
    else{
      console.log("order is bigger than stock or negative value");
      errors=true
      
    }
     

      

    }
    if(!errors){

      for(let i=0;i<tbody.children.length;i++){
        fetch('/product/'+name,{method:'PUT',headers:{'Content-Type':'Application/json'},body:JSON.stringify({qte:f[name].qte-qte})})
      .then(res=>{
         
          return  res.text();})
      .then(res=>{
          console.log(res);
          
      })

      }
    
    fetch('/orderslist',{method:'POST',headers:{'Content-Type':'Application/json'},body:JSON.stringify({costumerName,products,totalPrice})}).then(res=>{
           
      return  res.text();})
     .then(res=>{
         console.log(res);
        tbody.innerHTML=""
        total.style.display="none";
        thead.style.display="none"
      getProductNamesAndQTes();
         getOrdersList();
     })
    }
    }
    else{console.log('cannot send the order');}
  }
 

orderForm.addEventListener('submit',handleOrderSubmit)

function addInvoice(x=false){
  

   return x;


}

const showOrder=(target)=>{

    const orderInfos=document.querySelector('#order-info');


    const modalID=+target.parentNode.parentNode.children[0].innerHTML;
    const modalCostumerName=target.parentNode.parentNode.children[1].innerHTML;
    const modalTotalPrice=+target.parentNode.parentNode.children[3].innerHTML.split(' ')[0];
    const modalProducts=target.parentNode.parentNode.children[2].children[0].children

    const invoiceProducts=[]

    
    


  
    orderInfos.innerHTML=""

    orderInfos.innerHTML+=`\
  <div class="modal" id="modal1">\
    <div class="modal-header">\
      <div class="title">Order infos</div>\
      <button data-close-button class="close-button">&times;</button>\
    </div>\
    <div class="modal-body">\
    <div> Order ID: ${modalID}</div>\
      <div> Client name: ${modalCostumerName}</div>\
      <div><table border="1" style=" border-collapse: collapse;"><thead><tr><th>name</th><th>quantity</th><th>price</th></tr></thead><tbody id="uuu"></tbody></table></div>\
      <div> Amount to pay: ${modalTotalPrice} DA</div>\
      <div>\
        <button id="zz"onclick="">Confirm order (invoice)</button>\
        <button data-close-button class="close-button"> Cancel</button>\
      </div>\
    </div>\  
</div>`

const table=document.querySelector('#uuu');





for(let i=0;i<modalProducts.length;i++){
 table.innerHTML+=`\
  <tr>\
    <td>${modalProducts[i].firstElementChild.children[0].innerHTML}</td>\
    <td>${modalProducts[i].firstElementChild.children[1].innerHTML}</td>\
    <td>${modalProducts[i].firstElementChild.children[2].innerHTML}</td>\    
  </tr>`
  invoiceProducts.push({name:modalProducts[i].firstElementChild.children[0].innerHTML,
                        qte:modalProducts[i].firstElementChild.children[1].innerHTML,
                        price:+modalProducts[i].firstElementChild.children[2].innerHTML.split(' ')[0]
  })
 
  
   
  
}

document.querySelector('#zz').addEventListener('click',(e)=>{
  fetch('/invoiceslist',{method:'POST',headers:{'Content-Type':'Application/json'},body:JSON.stringify({costumerName:modalCostumerName,products:invoiceProducts,totalPrice:modalTotalPrice})}).then(res=>{
       
    return  res.text();})
   .then(res=>{console.log(res);


    fetch('/orderslistinvoiced/'+modalID,{method:'DELETE',headers:{'Content-Type':'Application/json'}}).then(res=>{
       
      return  res.text();})
     .then(res=>{
         console.log(res);
        
         getOrdersList();

         e.target.parentNode.parentNode.parentNode.classList.remove('active')
         var overlay = document.getElementById('overlay')
         overlay.classList.remove('active')
     })
         
    
  })

})

var newScript = document.createElement('script');
var oldScript=document.querySelector('script[src="./modal.js"]')

/*if(!script){
  s.type = 'text/javascript';
s.src="./modal.js"
try {
 
  document.body.appendChild(s);
} catch (e) {
  
 console.log(e);
}
}*/
//else{
  oldScript.remove();
  newScript.type = 'text/javascript';
  newScript.src="./modal.js"
  try {
   
    document.body.appendChild(newScript);
  } catch (e) {
    
   console.log(e);
  }

 

//}


//target.onmouseenter=null;
}



/* <button data-modal-target="#modal1">Open Modal</button>\*/


//<script defer src="./modal.js"></script>

