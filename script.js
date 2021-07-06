const alert = document.querySelector(".alert");
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const grocery = document.querySelector(".grocery-items");
const submitBtn = document.querySelector(".submit-btn");;
const clearAllBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editId = "";

// Event listeners
form.addEventListener("submit",addItem);

clearAllBtn.addEventListener("click", function(){
    let items = document.querySelectorAll(".items");
    if(items.length > 0){
        items.forEach(function(item){
            removeFromLocalStorage(item.dataset.id);
            grocery.removeChild(item);
        });
        displayAlert("All items deleted");
        clearAllBtn.classList.remove("show");
    }
});

window.addEventListener("DOMContentLoaded", setupItems);

//Functions
function addItem(i){
    let value = input.value; 
    let id = new Date().getTime();
    i.preventDefault();

    if(value.length > 0 && !editFlag){    
        createElement(id,value);
        displayAlert("Item added");
        clearAllBtn.classList.add("show");
        form.reset();
        addToLocalStorage(id,value);
    }else if(value && editFlag){
        editElement.textContent = value;
        displayAlert("Item Edited");
        editLocalStorage(editId,value);
        setBackToDefault();
    }else{
        displayAlert("Please enter value");
    }
}

function deleteFunction(item){
    let element = item.currentTarget.parentElement.parentElement;
    let id = element.dataset.id;
    element.remove();
    displayAlert("Item deleted");
    if(grocery.childElementCount <= 0){
        clearAllBtn.classList.remove("show");
    }
    setBackToDefault();
    removeFromLocalStorage(id);
};

function editItem(item){ 
    let element = item.currentTarget.parentElement.parentElement;
    editElement = item.currentTarget.parentElement.previousElementSibling;
    input.value = editElement.textContent;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "Edit";
}

function displayAlert(string){
    alert.classList.add("show");
    alert.textContent = string;
    setTimeout(() => {
        alert.classList.remove("show");
    }, 1000);  
}

function createElement(id,value){
    let article = document.createElement("article");
    article.dataset.id = id;
    article.classList.add("items");
    article.innerHTML = 
    `<p>${value}</p>
    <div>
        <button class="edit-btn">
        <img src="Edit.png"></button>
        <button class="delete-btn">
        <img src="delete.png"></button>
    </div>`
    // Adding functionality to buttons
    const delBtn = article.querySelector(".delete-btn");
    const editBtn = article.querySelector(".edit-btn");
    delBtn.addEventListener("click",deleteFunction);
    editBtn.addEventListener("click",editItem);
    // Adding functionality to buttons ends
    grocery.appendChild(article);
    clearAllBtn.classList.add("show");
}

function setBackToDefault(){
    editFlag = false;
    editId = "";
    input.value = ""; 
    submitBtn.textContent = "Submit";
}

// Local storage
function addToLocalStorage(id,value){
    let grocery = {id,value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if (item.id != id) {
            return item;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items = getLocalStorage();

    items = items.map(function(item){
        if (item.id == id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage(){
   return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

//Setup
function setupItems(){
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item){
            createElement(item.id,item.value);
        });    
    }
}

