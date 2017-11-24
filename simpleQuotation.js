//Data for the whole form
clienteSeleccionado = "";
productosSeleccionados = [];
preciosProductosSeleccionados = [];
cantidadesProductosSeleccionados = [];
totalesProductosSeleccionados = [];
grandTotal = 0;

mostrarClientes = false;
mostrarIdCliente = false;
clienteIngresadoPorTeclado = true;
idCliente = "";

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
        clienteSeleccionado = "";
        clientesFiltrados = filtrarClientes(entry);
        mostrarClientesFiltrados(clientesFiltrados, entry);
        });
}

function filtrarClientes(entry) {
    return clientes.filter((cliente) => {return cliente.nombre.includes(entry);});
  }

function mostrarClientesFiltrados(clientesFiltrados, entry) {
    const clientesFiltradosSection = document.getElementById("listaDeClientes");
    clientesFiltradosSection.innerHTML = "";
    if(entry==""){
        clientesFiltradosSection.className = "list-invisible";
        return;
    }
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
    product.className = 'col-sm-4 product';
    const inputProd = document.createElement("input");
    inputProd.type = "text";
    inputProd.className = "entry";
    inputProd.id = "inputProd"+index;
    inputProd.value = "";

    productosSeleccionados.push("");
    product.appendChild(inputProd);
    //Placeholder for the filtered products:
    const filteredProducts = document.createElement("div");
    filteredProducts.id = "filteredProducts"+index;
    filteredProducts.className = 'list-invisible';
    product.appendChild(filteredProducts);
    
    //Create the quantity placeholder
    const quantity = document.createElement("div");
    quantity.className = 'col-sm-2 product';
    const inputCant = document.createElement("input");
    inputCant.type = "number";
    inputCant.className = "entry";
    inputCant.id = "inputCant"+index;
    inputCant.value = 0;
    cantidadesProductosSeleccionados.push(0);
    quantity.appendChild(inputCant);

    //Create and initialize the price placeholder
    const price = document.createElement("div");
    price.className = 'col-sm-2';
    price.id = "prodPrice"+index;
    price.innerHTML = 0;
    preciosProductosSeleccionados.push(0);
  
    //Create and initialize the item total placeholder
    const total = document.createElement("div");
    total.className = 'col-sm-2';
    total.id = "prodTotal"+index
    total.innerHTML = 0;
    totalesProductosSeleccionados.push(0);

    //Create the removeItemButtom placeholder
    const removeItemButtom = document.createElement("buttom");
    removeItemButtom.className = 'btn btn-primary btn-sm';  
    removeItemButtom.innerHTML = 'Remove item';
    removeItemButtom.nodeType = 'buttom';
    removeItemButtom.onclick = function() {removeItem(index)};

    //Assemble the elements
    itemRow.appendChild(product);
    itemRow.appendChild(quantity);
    itemRow.appendChild(price);
    itemRow.appendChild(total);
    itemRow.appendChild(removeItemButtom);

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
        productosSeleccionados[index] = "";
        productosFiltrados = filtrarProductos(entry);
        mostrarProductosFiltrados(productosFiltrados, index, entry);
        });
}

function filtrarProductos(entry){
    return productos.filter((producto) => {return producto.nombre.includes(entry);});
}

function mostrarProductosFiltrados(productosFiltrados, index, entry){
    const targetId = "filteredProducts"+index;
    const productosFiltradosSection = document.getElementById(targetId);
    productosFiltradosSection.innerHTML = "";

    if(entry==""){
        productosFiltradosSection.className = "list-invisible";
        return;
    }
    const list = document.createElement("ul");
    productosFiltrados.forEach((producto) =>{
        const listItemElem = document.createElement("li");
        listItemElem.innerHTML = producto.nombre;
        listItemElem.onclick = function() {seleccionarProducto(producto, index)};
        list.appendChild(listItemElem);
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

    //In case quantity entered first:
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
    console.log(grandTotal);
    /*if(totalesProductosSeleccionados.length>0){
        grandTotal = totalesProductosSeleccionados.reduce((x, y) => x + y);
    } else */

    grandTotal = totalesProductosSeleccionados.length>0 ? totalesProductosSeleccionados.reduce((x, y) => x + y) : 0 
    
    document.getElementById("grandTotal").innerHTML = grandTotal;
    console.log(grandTotal);
}

function removeItem(index) {

    var parent = document.getElementById("items");

    const targetId = "itemRow"+index; 
    var child = document.getElementById(targetId);  
    parent.removeChild(child);
    
    //Form Arrays:
    console.log("AL REMOVER:")
    console.log("productosSeleccionados: "+productosSeleccionados);
    productosSeleccionados.splice(index,1);
    console.log("productosSeleccionados: "+productosSeleccionados);
    console.log("cantidadesProductosSeleccionados: "+cantidadesProductosSeleccionados);
    cantidadesProductosSeleccionados.splice(index,1);
    console.log("cantidadesProductosSeleccionados: "+cantidadesProductosSeleccionados);
    console.log("preciosProductosSeleccionados: "+preciosProductosSeleccionados);
    preciosProductosSeleccionados.splice(index,1);
    console.log("preciosProductosSeleccionados: "+preciosProductosSeleccionados);
    console.log("totalesProductosSeleccionados: "+totalesProductosSeleccionados);
    totalesProductosSeleccionados.splice(index,1);
    console.log("totalesProductosSeleccionados: "+totalesProductosSeleccionados);
    updateGrandTotal();
}