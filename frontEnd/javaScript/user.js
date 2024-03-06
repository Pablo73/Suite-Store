function checkRole() {
        const getToken = localStorage.getItem('token') || '';
        
        const headers = {
        'Content-Type': 'application/json',
        'Authorization': getToken
    };

    fetch('http://localhost/user/role', {
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
        return response.json();
    })
    .then(data => {
        const allowed = JSON.parse(data.message).allowed;

        if(allowed) {
            document.getElementById('adminLink').style.display = 'block';
        } else {
            document.getElementById('adminLink').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function updateTableUser() {
    fetch('http://localhost/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const getTableCategory = document.getElementById('tableUser').getElementsByTagName('tbody')[0];

            while (getTableCategory.firstChild) {
                getTableCategory.removeChild(getTableCategory.firstChild);
            }

            if (data.message.length >= 0) {
                
                data.message.forEach(function (user, index) {
                    const newLine = getTableCategory.insertRow();
                    const newLine1 = newLine.insertCell(0);
                    const newLine2 = newLine.insertCell(1);
                    const newLine3 = newLine.insertCell(2);


                    newLine1.textContent = user.name_user;
                    newLine2.textContent = user.role_user;

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
                            userName: user.name_user
                        };

                        fetch('http://localhost/user/delete', {
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
                            updateTableUser();
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    });
                    newLine3.appendChild(buttonDelete);
                });
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function registerUserAdmin() {
    const getButtonRegister = document.getElementById('saveUser');

    getButtonRegister.addEventListener('click', function () {

        const getInputUser = document.getElementById('userAdmin').value.trim();
        const getInputPassword = document.getElementById('userPassword').value.trim();

        if (!getInputUser || !getInputPassword) {
            alert(`Please enter all the required fields to register.`);
            return;
        }

            const getToken = localStorage.getItem('token') || '';
        
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': getToken
            };

            const requestBody = {
                name: getInputUser,
                password: getInputPassword
            };
    
            fetch('http://localhost/user/insert', {
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
                alert(`Success register.`);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
}