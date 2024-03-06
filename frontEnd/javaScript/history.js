function detailsTable() {

    const getToken = localStorage.getItem('token') || '';
        
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': getToken
    };

      
      fetch('http://localhost/order/allOrder', {
          method: 'GET',
          headers: headers,
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
            return response.text();
        })
        .then(data => {

            if (data.trim() === '') {
                return;
            }

            const jsonData = JSON.parse(data);
            
            const getTableHistory = document.getElementById('tableHistory').getElementsByTagName('tbody')[0];
    
            while (getTableHistory.firstChild) {
                getTableHistory.removeChild(getTableHistory.firstChild);
            }
        
            if (jsonData.message && jsonData.message.length > 0) {
        
                jsonData.message.forEach(function(history, index) {
        
                    const newLine = getTableHistory.insertRow();
                    const newLine1 = newLine.insertCell(0);
                    const newLine2 = newLine.insertCell(1);
                    const newLine3 = newLine.insertCell(2);
                    const newLine4 = newLine.insertCell(3);
        
                    newLine1.textContent = index + 1;
                    newLine2.textContent = `$${history.tax_order}`;
                    newLine3.textContent = `$${history.total_order}`;
        
                    const buttonView = document.createElement('button');
        
                    buttonView.type = 'button';
                    buttonView.textContent = 'View';
        
                    buttonView.addEventListener('click', function() {

                        const getToken = localStorage.getItem('token') || '';

                        const request = {
                            orderId: history.order_id
                        };

                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': getToken
                        };
                        
                        fetch('http://localhost/order/allOrderItem', {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(request),
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

                                const detailTable = document.getElementById('detailTable');
                                const getHistoryTable = document.getElementById('historyTable');
                                
                                getHistoryTable.style.display = 'none';
                                detailTable.style.display = 'block';

                                const getTableDetails = document.getElementById('tableDetails').getElementsByTagName('tbody')[0];
                
                                while (getTableDetails.firstChild) {
                                    getTableDetails.removeChild(getTableDetails.firstChild);
                                }
                            
                                data.message.forEach(function(details, index) {

                                    valorTax = (details.unit_price / 100) * details.tax;
                                    valorTotal = (details.order_item_amount  * details.unit_price) +  valorTax
                            
                                    const newLine = getTableDetails.insertRow();
                                    const newLine1 = newLine.insertCell(0);
                                    const newLine2 = newLine.insertCell(1);
                                    const newLine3 = newLine.insertCell(2);
                                    const newLine4 = newLine.insertCell(3);
                                    const newLine5 = newLine.insertCell(4);
                                    const newLine6 = newLine.insertCell(5);
                                    const newLine7 = newLine.insertCell(6);
                            
                                    newLine1.textContent = index + 1;
                                    newLine2.textContent = details.product_name;
                                    newLine3.textContent = Math.floor(details.order_item_amount);
                                    newLine4.textContent = `$${details.unit_price}`;
                                    newLine5.textContent = `$${valorTax.toFixed(2)}`;
                                    newLine6.textContent = details.category_name;
                                    newLine7.textContent = `$${valorTotal.toFixed(2)}`;
                                 })
    
                            })
                    });
                    newLine4.appendChild(buttonView);
                });
            } 
    })
}