function registerProduct() {

    const getButtonSaveProduct = document.getElementById('saveProduct');

    getButtonSaveProduct.addEventListener('click', function() {

        const getProductName = document.getElementById('productName').value.trim();
        const getAmoutProduct = parseFloat(document.getElementById('amountProduct').value);
        const getUnitPrice = parseFloat(document.getElementById('unitPriceProduct').value);
        const getCategoryProduct = document.getElementById('categoryProduct').value;

        if(getProductName && 
            getAmoutProduct >= 0 && 
            getUnitPrice > 0 && 
            getCategoryProduct && 
            Number.isInteger(getAmoutProduct)
        ) {

            const getToken = localStorage.getItem('token') || '';
        
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': getToken
            };

            const requestBody = {
                name: getProductName,
                amount: Math.floor(getAmoutProduct),
                price: getUnitPrice,
                nameCategory: getCategoryProduct
            };

            fetch('http://localhost/product/insert', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
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
            .then(() => {
                document.getElementById('productName').value = "";
                document.getElementById('amountProduct').value = "";
                document.getElementById('unitPriceProduct').value = "";
                document.getElementById('categoryProduct').value = "";

                updateTableProduct();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        } else {
            alert(`Please enter a value to register`);
        }
    }) 
}

function updateTableProduct() {
    fetch('http://localhost/product/allProduct')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const getTableProduct = document.getElementById('tableProduct').getElementsByTagName('tbody')[0];

            while (getTableProduct.firstChild) {
                getTableProduct.removeChild(getTableProduct.firstChild);
            }

            if (data.message.length >= 0) {
                
                data.message.forEach(function (product, index) {

                    const newLine = getTableProduct.insertRow();
                    const newLine1 = newLine.insertCell(0);
                    const newLine2 = newLine.insertCell(1);
                    const newLine3 = newLine.insertCell(2);
                    const newLine4 = newLine.insertCell(3);
                    const newLine5 = newLine.insertCell(4);
                    const newLine6 = newLine.insertCell(5);
        
                    newLine1.textContent = product.products_name;
                    newLine2.textContent = index + 1;
                    newLine3.textContent = Math.floor(product.product_amount);
                    newLine4.textContent = `$${product.unit_price}`;
                    newLine5.textContent = product.categories_name;
                    
                    const buttonDelete = document.createElement('button');
        
                    buttonDelete.type = 'button';
                    buttonDelete.textContent = 'Delete';

                    buttonDelete.addEventListener('click', function () {

                        const getToken = localStorage.getItem('token') || '';
        
                        const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': getToken
                    };

                        const requestBody = {
                            name: product.products_name
                        };

                        fetch('http://localhost/product/delete', {
                            method: 'DELETE',
                            headers: headers,
                            body: JSON.stringify(requestBody),
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
                            updateTableProduct();
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    });
                    newLine6.appendChild(buttonDelete);
                });
            }
        });
}

function updateOptionCategory() {

    const getSelectCategory = document.getElementById('categoryProduct');
    fetch('http://localhost/category/allCategory')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message.length >= 0) {
        
                getSelectCategory.innerHTML = "";
        
                data.message.forEach(function(category) {
        
                    const option = document.createElement('option');
                    option.innerText = category.categories_name;
                    
                    getSelectCategory.add(option); 
                })
            }
        });
}