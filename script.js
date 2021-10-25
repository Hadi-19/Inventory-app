onclicki=()=>{
    //console.log('button clicked');
    fetch('/products',{method:'GET',headers:{'Content-Type':'Application/json'}}).then(res=>res.json())
    .then(res=>{
        
        const tbody=document.querySelector('tbody');
       
       
        tbody.innerHTML="";
        res.products.forEach(product => {
            
            tbody.innerHTML+=`\
            <tr>\
            <td class="id">${product.id}</td>\
            <td><input type="text" class="name" value="${product.name}"></td>\
            <td><input type="number" min="1" class="qte" value="${product.qte}"></td>\
            <td><input type="number" min="1" class="price" value="${product.price}">DA</td>\
            <td><button class="update-button" onclick="updateHandler(this)">Update</button>\
            <button class="delete-button" onclick="deleteHandler(this)">Delete</button> <span id="invalid-update"></span>\
            </td>\
        </tr>\
       
        `
        });
        
    })
        
}


const createForm=document.querySelector('#create-form');
createForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const invalidName=document.querySelector('#invalid-name');
    const invalidQte=document.querySelector('#invalid-qte');
    const invalidPrice=document.querySelector('#invalid-price');
    
    
    
    const createInput=document.querySelector('#create-input');
    const name=createInput.value.trim();
    const qteInput=document.querySelector('#qte');
    const qte=+qteInput.value;
    const priceInput=document.querySelector('#price');
    const price= +priceInput.value;
    
    
    
    if(qte>0 && name &&price>=0){
       

        fetch('/products',{method:'POST',headers:{'Content-Type':'Application/json'},body:JSON.stringify({name,qte,price})}).then(res=>{
           
             return  res.text();})
            .then(res=>{
                console.log(res);
                onclicki();
            })
    }
    
        else if(qte<=0 &&!name&&price<0){
            console.log('qte ,name and price are invalid');
            invalidName.style.opacity="1";
            invalidQte.style.opacity="1";
            invalidPrice.style.opacity="1";
        //  invalidName.style.animationName="opacityChange";
        // invalidQte.style.animationName="opacityChange";

            setTimeout(()=>{
                invalidName.style.transition=" opacity 5s ease-out"
        invalidQte.style.transition=" opacity 5s ease-out"
        invalidPrice.style.transition=" opacity 5s ease-out"
                invalidName.style.opacity="0";
                invalidQte.style.opacity="0";
                invalidPrice.style.opacity="0";
            },3000)
            setTimeout(()=>{
                invalidName.style.transition=" none"
        invalidQte.style.transition="none"
        invalidPrice.style.transition="none"
            },8000)
        
        

        }




        else if(qte<=0 &&!name){
          
            invalidName.style.opacity="1";
            invalidQte.style.opacity="1";
            
        
            setTimeout(()=>{
                invalidName.style.transition=" opacity 5s ease-out"
        invalidQte.style.transition=" opacity 5s ease-out"
       
                invalidName.style.opacity="0";
                invalidQte.style.opacity="0";
                
            },3000)
            setTimeout(()=>{
                invalidName.style.transition=" none"
        invalidQte.style.transition="none"
       
            },8000)
        
        

        }
        else if(qte<=0 &&price<0){
           
            
            invalidQte.style.opacity="1";
            invalidPrice.style.opacity="1";
      

            setTimeout(()=>{
                
        invalidQte.style.transition=" opacity 5s ease-out"
        invalidPrice.style.transition=" opacity 5s ease-out"
               
                invalidQte.style.opacity="0";
                invalidPrice.style.opacity="0";
            },3000)
            setTimeout(()=>{
                
        invalidQte.style.transition="none"
        invalidPrice.style.transition="none"
            },8000)
        
        

        }
        else if(!name&&price<0){
           
            invalidName.style.opacity="1";
           
            invalidPrice.style.opacity="1";
       

            setTimeout(()=>{
                invalidName.style.transition=" opacity 5s ease-out"
      
                invalidPrice.style.transition=" opacity 5s ease-out"
                invalidName.style.opacity="0";
                
                invalidPrice.style.opacity="0";
            },3000)
            setTimeout(()=>{
                invalidName.style.transition=" none"
       
                 invalidPrice.style.transition="none"
            },8000)
        
        

        }
        else if(!name){
            console.log('invalid name');
            invalidName.style.opacity="1";
            setTimeout(()=>{
                invalidName.style.transition=" opacity 5s ease-out"
        
                invalidName.style.opacity="0";

            },3000)
            setTimeout(()=>{
                invalidName.style.transition=" none"
        
            },8000)
        }
        else if(qte<=0){
            invalidQte.style.opacity="1";
        
    
            setTimeout(()=>{               
            invalidQte.style.transition=" opacity 5s ease-out"                
            invalidQte.style.opacity="0";
            },3000)

            setTimeout(()=>{
            invalidQte.style.transition="none"
            },8000)
            
            
        }
        else if(price<0){
            invalidPrice.style.opacity="1";
        
    
            setTimeout(()=>{               
            invalidPrice.style.transition=" opacity 5s ease-out"                
            invalidPrice.style.opacity="0";
            },3000)

            setTimeout(()=>{
            invalidPrice.style.transition="none"
            },8000)
            
            
        }
})




updateHandler=(target)=>{
    
  //  const invalidUpdate=document.querySelector('#invalid-update')
    
    const tr=target.parentNode.parentNode;
    const tds= tr.childNodes
   
    const id= tds[1].innerHTML;
    const name=tds[3].firstChild.value.trim();
    const qte=+tds[5].firstChild.value;
    const price=+tds[7].firstChild.value;
    const invalidUpdate=tds[9].lastElementChild;
    
   
    if(name && qte>0 &&price>=0){
       
        fetch('/products/'+id,{method:'PUT',headers:{'Content-Type':'Application/json'},body:JSON.stringify({name,qte,price})})
        .then(res=>{
           
            return  res.text();})
        .then(res=>{
            console.log(res);
            onclicki();
        })
    }
    else {

            if(!name && qte<=0 && price<0){
                invalidUpdate.innerHTML="invalid name, price and quantity"
            }
           else if(!name && qte<=0 ){
                invalidUpdate.innerHTML="invalid name and quantity"
            }
           else if(!name && price<0 ){
                invalidUpdate.innerHTML="invalid name and price"
            }
           else if(price<0 && qte<=0 ){
                invalidUpdate.innerHTML="invalid price and quantity"
            }
            else if(!name){
                invalidUpdate.innerHTML="invalid name"
            }
           else if(price<0 ){
                invalidUpdate.innerHTML="invalid price"
            }
            else{
                invalidUpdate.innerHTML="invalid quantity"
            }

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
deleteHandler=(target)=>{
    
    
    const tr=target.parentNode.parentNode;
    const tds= tr.childNodes
   
    const id= tds[1].innerHTML;
    /*const name=tds[3].firstChild.value;
    const qte=+tds[5].firstChild.value;*/
  
    fetch('/products/'+id,{method:'DELETE',headers:{'Content-Type':'Application/json'}}).then(res=>{
       
         return  res.text();})
        .then(res=>{
            console.log(res);
            onclicki();
        })

}
/*
`\
            <tr>\
            <td class="id">${product.id}</td>\
            <td><input type="text" class="name" value="${product.name}"></td>\
            <td><input type="text" class="qte" value="${product.qte}"></td>\
            <td><button class="update-button">Update</button>\
            <button class="delete-button">Delelte</button>\
            </td>\
        </tr>\
        `
        */