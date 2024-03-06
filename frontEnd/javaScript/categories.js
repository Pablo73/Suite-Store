function registerCategory() {
    const getButtonSaveCategory = document.getElementById('saveCategory');

    getButtonSaveCategory.addEventListener('click', function () {
        const getCategoryName = document.getElementById('categoryName').value.trim();
        const getTaxCategory = document.getElementById('taxCategory').value;

        if (!isNaN(getTaxCategory) && getCategoryName && parseFloat(getTaxCategory) >= 0) {

            const parsedTaxCategory = parseFloat(getTaxCategory);

            const getToken = localStorage.getItem('token') || '';
        
            const headers = {
            'Content-Type': 'application/json',
            'Authorization': getToken
            };

            const requestBody = {
                name: getCategoryName,
                tax: parsedTaxCategory
            };

            fetch('http://localhost/category/insert', {
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

                document.getElementById('categoryName').value = "";
                document.getElementById('taxCategory').value = "";

                updateTableCategory();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });
        } else {
            alert(`Please enter a value to register`);
        }
    });
}

function updateTableCategory() {
    fetch('http://localhost/category/allCategory')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const getTableCategory = document.getElementById('tableCategory').getElementsByTagName('tbody')[0];

            while (getTableCategory.firstChild) {
                getTableCategory.removeChild(getTableCategory.firstChild);
            }

            if (data.message.length >= 0) {
                
                data.message.forEach(function (category, index) {
                    const newLine = getTableCategory.insertRow();
                    const newLine1 = newLine.insertCell(0);
                    const newLine2 = newLine.insertCell(1);
                    const newLine3 = newLine.insertCell(2);
                    const newLine4 = newLine.insertCell(3);


                    newLine1.textContent = category.categories_name;
                    newLine2.textContent = index + 1;
                    newLine3.textContent = `${category.tax}%`;

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
                            name: category.categories_name
                        };

                        fetch('http://localhost/category/delete', {
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
                            updateTableCategory();
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    });
                    newLine4.appendChild(buttonDelete);
                });
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

