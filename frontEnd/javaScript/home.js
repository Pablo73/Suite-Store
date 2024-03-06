function updateOptionProduct() {

    const getSelectPurchase = document.getElementById('productHome');
    fetch('http://localhost/product/allProduct')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message.length >= 0) {
        
                getSelectPurchase.innerHTML = "";
        
                data.message.forEach(function(product) {
        
                    const option = document.createElement('option');
                    option.innerText = product.products_name;
                    
                    getSelectPurchase.add(option); 
                })
            }
        });
}


function taxPriceAutomatic() {

    const productSelect = document.getElementById('productHome');
    productSelect.addEventListener('change', taxPriceAutomatic);

    fetch('http://localhost/product/allProduct')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message.length >= 0) {
            const selectPurchase = document.getElementById('productHome').value;
            const getPricePurchase = document.getElementById('unitPriceHome');
            const getTaxPurchase = document.getElementById('taxValueHome');

            const selectedValue = selectPurchase;

            data.message.forEach(function(product) {

                if(selectedValue === product.products_name) {

                    getPricePurchase.value = `$${product.unit_price}`;
                    getTaxPurchase.value = `${product.tax}%`;
                }
            })
        }
    });
}


function registerPurchase() {

    const getButtonSavePurchase = document.getElementById('add-product-home');

    getButtonSavePurchase.addEventListener('click', function() {

        const getProductNamePurchase = document.getElementById('productHome').value;
        const getAmountPurchase =  parseFloat(document.getElementById('amountHome').value);
        const getPricePurchase = document.getElementById('unitPriceHome');
        const getTaxPurchase = document.getElementById('taxValueHome');

        if (getProductNamePurchase && getAmountPurchase > 0 && Number.isInteger(getAmountPurchase)) {

        const numberValuePrice = parseFloat(getPricePurchase.value.replace(/[^\d.]/g, ''), 10);

        const numberValueTax = parseFloat(getTaxPurchase.value.replace('%', ''));

        const valuePrice = getAmountPurchase * numberValuePrice;

        const valueTax = (numberValuePrice / 100) * numberValueTax;

        const priceTotalItem = valuePrice + valueTax;
        
        fetch('http://localhost/product/allProduct')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message.length >= 0) {

                var numberValueAvailableQuantity = 0
                
                data.message.forEach((product) => {
        
                    if (product.products_name === getProductNamePurchase) {
                        numberValueAvailableQuantity = product.product_amount;
                    }
                })

                if (numberValueAvailableQuantity < getAmountPurchase) {
                    alert(`We do not have that quantity in stock. Change the quantity to complete the purchase.`);
                    return; 
                }
        
                const existingPurchase = JSON.parse(localStorage.getItem('purchase')) || [];
        
                const newPurchase = {
                    nameProduct: getProductNamePurchase,
                    amount: getAmountPurchase,
                    taxValueHome: getTaxPurchase.value,
                    unitPriceHome: getPricePurchase.value,
                    availableQuantity: parseInt(numberValueAvailableQuantity),
                    tax: `$${valueTax.toFixed(2)}`,
                    total: `$${priceTotalItem.toFixed(2)}`
                };
        
                existingPurchase.push(newPurchase);
        
                localStorage.setItem('purchase', JSON.stringify(existingPurchase))

                somarQuantidadePorProduto(getProductNamePurchase, numberValueAvailableQuantity);

                updateTablePurchase();
            }
        });

        } else {
            alert(`Please enter a value to register`);
       
        }
    }) 
}

function updateTablePurchase() {

    const getAllPurchase = JSON.parse(localStorage.getItem('purchase')) || [];
    const getTablePurchase = document.getElementById('tableHome').getElementsByTagName('tbody')[0];
    const getTotalPurchaseValue = document.getElementById('totalHome');
    const getTotalTaxValue = document.getElementById('taxHome');

    while (getTablePurchase.firstChild) {
        getTablePurchase.removeChild(getTablePurchase.firstChild);
    }

    if (getAllPurchase.length > 0) {

        var totalPurchaseValue = 0;
        var totalTaxValue = 0;

        getAllPurchase.forEach(function(purchase, index) {

            const newLine = getTablePurchase.insertRow();
            const newLine1 = newLine.insertCell(0);
            const newLine2 = newLine.insertCell(1);
            const newLine3 = newLine.insertCell(2);
            const newLine4 = newLine.insertCell(3);
            const newLine5 = newLine.insertCell(4);

            newLine1.textContent = purchase.nameProduct;
            newLine2.textContent = purchase.unitPriceHome;
            newLine3.textContent = purchase.amount;

            const numberValuePrice = parseFloat(purchase.unitPriceHome.replace(/[^\d.]/g, ''), 10);

            const numberValueTax = parseFloat(purchase.taxValueHome.replace('%', ''));

            const numberValueAmount = parseFloat(purchase.amount);

            const totalValueOfEachProduct = numberValueAmount * numberValuePrice;

            newLine4.textContent = `$${totalValueOfEachProduct.toFixed(2)}`;

            const buttonDelete = document.createElement('button');

            buttonDelete.type = 'button';
            buttonDelete.textContent = 'Delete';

            buttonDelete.addEventListener('click', function() {
                deleteLocalStorage('purchase', newLine.rowIndex -1)
            });
            newLine5.appendChild(buttonDelete);

            totalPurchaseValue += totalValueOfEachProduct;

            const cashValueOfTheTax = (numberValuePrice / 100) * numberValueTax;

            totalTaxValue += cashValueOfTheTax;
            
        })

        getTotalPurchaseValue.value = `$ ${totalPurchaseValue.toFixed(2)}`;
        getTotalTaxValue.value = `$ ${totalTaxValue.toFixed(2)}`
    }
    
}

function finishPurchase() {

    const getButtonFinish = document.getElementById('finish-home');
    const getButtonancel = document.getElementById('cancel-home');

    getButtonFinish.addEventListener('click', function() {

        const getTotalPurchaseValue = document.getElementById('totalHome').value;
        const getTotalTaxValue = document.getElementById('taxHome').value;

        const getAllPurchase = JSON.parse(localStorage.getItem('purchase')) || [];

        const messageAlert = JSON.stringify(getAllPurchase, null, 2);

        alert(`Carinho de compra: ${messageAlert}`);
        
        const objectPurchase = [];
        const somas = {};
        
        const getToken = localStorage.getItem('token') || '';
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': getToken
        };
    
        getAllPurchase.forEach((item) => {
            const { nameProduct, amount } = item;
    
            if (!somas[nameProduct]) {
                somas[nameProduct] = {
                    nameProduct,
                    amount: 0,
                };
                objectPurchase.push(somas[nameProduct]);
            }
            somas[nameProduct].amount += amount;
        });

        const numberValuePrice = parseFloat(getTotalPurchaseValue.replace(/[^\d.]/g, ''), 10);
        const numberValueTax = parseFloat(getTotalTaxValue.replace(/[^\d.]/g, ''), 10);

        const requestBodyTotal = {
            totalPrice: numberValuePrice,
            totalTax: numberValueTax,
        };

        fetch('http://localhost/order/total', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBodyTotal),
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403) {
                        alert('You do not have the required role to perform this action.');
                        throw new Error('Permission denied');
                    } else if (response.status === 401) {
                        alert('Expired token.');
                        window.location.href = '../html/login.html';
                        throw new Error('Unauthorized');
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }
                return response.json();
            })
            .then(data => {
                
                const orderId = data.message.lastInsertedId;

                newObjectRequest  = {
                    objectPurchase: objectPurchase,
                    orderId: orderId,
                }
               
                fetch('http://localhost/order/item', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(newObjectRequest ),
                })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 403) {
                            alert('You do not have the required role to perform this action.');
                            throw new Error('Permission denied');
                        } else if (response.status === 401) {
                            alert('Expired token.');
                            window.location.href = '../html/login.html';
                            throw new Error('Unauthorized');
                        } else {
                            throw new Error('Network response was not ok');
                        }
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
       
            localStorage.removeItem('purchase');

            document.getElementById('totalHome').value = "0.00";
            document.getElementById('taxHome').value = "0.00";

            updateTablePurchase()
    })
        
    getButtonancel.addEventListener('click', function() {
        localStorage.removeItem('purchase');
        window.location.reload(true);
    })
}

function deleteLocalStorage(key, valueIndex) {
    const currentItems = JSON.parse(localStorage.getItem(key)) || [];

    const newArray = currentItems.filter((_, i) => i !== valueIndex);

    localStorage.setItem(key, JSON.stringify(newArray));

    window.location.reload(true);
}

function somarQuantidadePorProduto(getProductNamePurchase, numberValueAvailableQuantity) {
    const purchase = JSON.parse(localStorage.getItem('purchase')) || [];

    const resultado = [];
    const somas = {};

    purchase.forEach((item) => {
        const { nameProduct, amount } = item;

        if (!somas[nameProduct]) {
            somas[nameProduct] = {
                nameProduct,
                amount: 0,
            };
            resultado.push(somas[nameProduct]);
        }
        somas[nameProduct].amount += amount;
    });

    const isStockSufficient = resultado.every((value) => {
        if (value.nameProduct === getProductNamePurchase && value.amount > numberValueAvailableQuantity) {
            handleInsufficientStock(value.nameProduct);
            return false;
        }
        return true;
    });

    if (!isStockSufficient) {
        const purchase = JSON.parse(localStorage.getItem('purchase')) || [];
        const newArray = purchase.slice(0, -1);
        localStorage.setItem('purchase', JSON.stringify(newArray));
    }

    function handleInsufficientStock(productName) {
        alert(`We do not have enough stock for ${productName}. Change the quantity to complete the purchase.`);
    }
}

  
  


