//Variables for the whole form
clienteSeleccionado = "";
productosSeleccionados = [];
preciosProductosSeleccionados = [];
cantidadesProductosSeleccionados = [];
totalesProductosSeleccionados = [];
grandTotal = 0;

clientesFiltrados = [];
productosFiltrados = [];

//Data:
const productos = [
    { id: 1, nombre: 'Leche KLIM polvo 1Kg', precio: 50000, existencia: 300 },
    { id: 2, nombre: 'Quinchoncho La Lucha 500 gr', precio: 23000, existencia: 300 },
    { id: 3, nombre: 'Chimo caja 25 gr', precio: 10000, existencia: 300 },
    { id: 4, nombre: 'Jugo de Jemgibre 500 ml', precio: 50000, existencia: 300 },
    { id: 5, nombre: 'Cacao molido 500 gr', precio: 50000, existencia: 300 },
    { id: 6, nombre: 'Coco rallado 500 gr', precio: 50000, existencia: 300 },
    { id: 7, nombre: 'Ajo en polvo 250 gr', precio: 50000, existencia: 300 },
    { id: 8, nombre: 'Perejil 1kg', precio: 50000, existencia: 300 },
    { id: 9, nombre: 'Berenjena molida 500 gr', precio: 50000, existencia: 300 },
    { id: 10, nombre: 'Bollos de pollo 1kg', precio: 50000, existencia: 300 },
    { id: 11, nombre: 'Azucar morena 1kg', precio: 50000, existencia: 300 }
  ];
  
const clientes = [
    { id: 1, nombre: 'Bodega El Cantinflas'},
    { id: 2, nombre: 'Ferreteria El Tornillo'},
    { id: 3, nombre: 'Abastos Su Compra'},
    { id: 4, nombre: 'Telas Para Cortar'},
    { id: 5, nombre: 'Taller Te Lo Reparo'},
    { id: 6, nombre: 'Humberto Medina'},
    { id: 7, nombre: 'Casa del Fumador'},
    { id: 8, nombre: 'Pasteles PasteLar'},
    { id: 9, nombre: 'Makro'},
    { id: 10, nombre: 'Ferretotal'},
  ]

function chequearInputCliente(){
    const cliente = document.getElementById('cliente');
    const keyup$ = Rx.Observable.fromEvent(cliente, 'keyup')
      .map(i => i.currentTarget.value)
      .debounceTime(750)
      .subscribe(entry => {
          if(entry!==""){
            clienteSeleccionado = "";
            clientesFiltrados = filtrarClientes(entry);
            mostrarClientesFiltrados(clientesFiltrados, entry);
          }        
        });
}

function filtrarClientes(entry) {
    return clientes.filter((cliente) => {return cliente.nombre.includes(entry);});
  }

function mostrarClientesFiltrados(clientesFiltrados, entry) {
    const clientesFiltradosSection = document.getElementById("listaDeClientes");
    clientesFiltradosSection.innerHTML = "";
    const list = document.createElement("ul");
    clientesFiltrados.forEach((cliente) =>{
        const listItem = document.createElement("li");
        listItem.innerHTML = cliente.nombre;
        listItem.onclick = function() {seleccionarCliente(cliente)};
        list.appendChild(listItem);
    });
    clientesFiltradosSection.appendChild(list);
    clientesFiltradosSection.className = "list-visible";
  }

function seleccionarCliente(selected){
    const clientesFiltradosSection = document.getElementById("listaDeClientes");
    clientesFiltradosSection.className = "list-invisible";
    clientesFiltradosSection.innerHTML = "";
    document.getElementById("cliente").value = selected.nombre;
    clienteSeleccionado = selected.nombre;
}

function addItem() {

    const itemsSection = document.getElementById("items");

    const index = productosSeleccionados.length;

    //Create the item row  
    const itemRow = document.createElement("div");
    itemRow.className = 'row item-row';
    itemRow.id = "itemRow"+index;

    //Create the product placeholder
    const product = document.createElement("div");
    product.className = 'col-sm-5 product';
    product.id = "product"+index;
    const inputProd = document.createElement("input");
    inputProd.type = "text";
    inputProd.className = "entry";
    inputProd.id = "inputProd"+index;
    inputProd.value = "";
    inputProd.required = true;

    productosSeleccionados.push("");
    product.appendChild(inputProd);
    //Placeholder for the filtered products:
    const filteredProducts = document.createElement("div");
    filteredProducts.id = "filteredProducts"+index;
    filteredProducts.className = 'list-invisible';
    product.appendChild(filteredProducts);
    
    //Create the quantity placeholder
    const quantity = document.createElement("div");
    quantity.className = 'col-sm-1 product';
    quantity.id = "quantity"+index;
    const inputCant = document.createElement("input");
    inputCant.type = "number";
    inputCant.className = "text-right entry";
    inputCant.id = "inputCant"+index;
    inputCant.value = 0;
    inputCant.required = true;
    cantidadesProductosSeleccionados.push(0);
    quantity.appendChild(inputCant);

    //Create and initialize the price placeholder
    const price = document.createElement("div");
    price.className = 'col-sm-1 text-right price';
    price.id = "prodPrice"+index;
    price.innerHTML = 0;
    preciosProductosSeleccionados.push(0);
  
    //Create and initialize the item total placeholder
    const total = document.createElement("div");
    total.className = 'col-sm-1 text-right price';
    total.id = "prodTotal"+index
    total.innerHTML = 0;
    totalesProductosSeleccionados.push(0);

    //Create the removeItemButtom placeholder
    const remItemDiv = document.createElement("div");
    remItemDiv.className = 'col-sm-3 ri-buttom';
    const removeItemButtom = document.createElement("buttom");
    removeItemButtom.className = 'btn btn-primary btn-sm';  
    removeItemButtom.innerHTML = 'Remove item';
    removeItemButtom.nodeType = 'buttom';
    removeItemButtom.onclick = function() {removeItem(index)};
    remItemDiv.appendChild(removeItemButtom);

    //Assemble the elements
    itemRow.appendChild(product);
    itemRow.appendChild(quantity);
    itemRow.appendChild(price);
    itemRow.appendChild(total);
    itemRow.appendChild(remItemDiv);

    itemsSection.appendChild(itemRow);

    //Call for inputs event attachers:
    chequearInputProducto(index);
    inputCant.onchange = function() {actualizarCantidad(inputCant.value, index)};
}

function chequearInputProducto(index){
    const targetInput = "inputProd"+index;
    const productoElem = document.getElementById(targetInput);
    const keyup$ = Rx.Observable.fromEvent(productoElem, 'keyup')
      .map(i => i.currentTarget.value)
      .debounceTime(750)
      .subscribe(entry => {
        if(entry==""){
          productosSeleccionados[index] = "";
          productosFiltrados = filtrarProductos(entry);
          mostrarProductosFiltrados(productosFiltrados, index, entry);
        }
        });
}

function filtrarProductos(entry){
    return productos.filter((producto) => {return producto.nombre.includes(entry);});
}

function mostrarProductosFiltrados(productosFiltrados, index, entry){
    const targetId = "filteredProducts"+index;
    const productosFiltradosSection = document.getElementById(targetId);
    productosFiltradosSection.innerHTML = "";
    const list = document.createElement("ul");
    productosFiltrados.forEach((producto) =>{
        //Check if product already selected:
        const test = productosSeleccionados.findIndex((item) => {
            return item == producto.nombre;
         });
        if(test == -1){
            const listItemElem = document.createElement("li");
            listItemElem.innerHTML = producto.nombre;
            listItemElem.onclick = function() {seleccionarProducto(producto, index)};
            list.appendChild(listItemElem);
        }  
    });
    productosFiltradosSection.appendChild(list);
    productosFiltradosSection.className = "list-visible";
}

function seleccionarProducto(selected, index) {
    //Empty and hide the filtered products list:
    const targetList = "filteredProducts"+index;
    const productosFiltradosSection = document.getElementById(targetList);
    productosFiltradosSection.innerHTML = "";
    productosFiltradosSection.className = "list-invisible";
    //Product update:
    const targetInputProduct = "inputProd"+index;
    document.getElementById(targetInputProduct).value = selected.nombre;
    //Form Array:
    productosSeleccionados[index] = selected.nombre;
    //Price update:
    const targetInputPrice = "prodPrice"+index;
    document.getElementById(targetInputPrice).innerHTML = selected.precio;
    //Form Array:
    preciosProductosSeleccionados[index] = selected.precio;
    
    //If no quantity entered yet, set it to 1
    inputCantId = "inputCant"+index;
    inputQuantityElem = document.getElementById(inputCantId);
    if(inputQuantityElem.value==0){
        inputQuantityElem.value = 1;
        cantidadesProductosSeleccionados[index] = 1;
    }
    targetTotalId = "prodTotal"+index;
    productTotalElem = document.getElementById(targetTotalId);
    totalesProductosSeleccionados[index] = cantidadesProductosSeleccionados[index]*preciosProductosSeleccionados[index];
    productTotalElem.innerHTML = totalesProductosSeleccionados[index];
    updateGrandTotal();
}

//Up to now cant only after product selection
function actualizarCantidad(cantidad, index){
    //Form Array:
    cantidadesProductosSeleccionados[index] = cantidad;
    //Row total:
    targetId = "prodTotal"+index;
    productTotalElem = document.getElementById(targetId);
    totalesProductosSeleccionados[index] = cantidad*preciosProductosSeleccionados[index];
    productTotalElem.innerHTML = totalesProductosSeleccionados[index];
    updateGrandTotal();
}

function updateGrandTotal() {
    grandTotal = totalesProductosSeleccionados.length>0 ? totalesProductosSeleccionados.reduce((x, y) => x + y) : 0 
    document.getElementById("grandTotal").innerHTML = grandTotal;
}

function removeItem(index) {
    
    const parentElem = document.getElementById("items");
    const targetId = "itemRow"+index; 
    const targetRowElem = document.getElementById(targetId);
    
    //Given that some item(s) might be removed previously,
    //the received index might differ from the target index.
    //We need to find the target index and we do it before actually
    //removing the targetRowElem.

    //1.- Find the target index:
    const itemsChildNodes = parentElem.childNodes;
    const refId = "itemRow"+index;
          
    var targetIndex;
    for (var i = 0; i < itemsChildNodes.length; i++) {
        if(itemsChildNodes[i+1].id == refId){
            targetIndex = i;
            break;
        }
    }

    //Now we can finally remove the HTML element:
    parentElem.removeChild(targetRowElem);

    //2.-  And update the form arrays and recalculate grandTotal:
    productosSeleccionados.splice(targetIndex,1);
    cantidadesProductosSeleccionados.splice(targetIndex,1);
    preciosProductosSeleccionados.splice(targetIndex,1);
    totalesProductosSeleccionados.splice(targetIndex,1);
    updateGrandTotal();
}