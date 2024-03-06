function registerUser() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const getInputUser = document.getElementById('username').value.trim();
        const getInputPassword = document.getElementById('password').value.trim();
        const getInputConfirmPassword = document.getElementById('confirm-password').value.trim();

        if (!getInputUser || !getInputPassword || !getInputConfirmPassword) {
            alert(`Please enter all the required fields to register.`);
            return;
        }

        if (getInputPassword === getInputConfirmPassword) {

            const requestBody = {
                name: getInputUser,
                password: getInputPassword
            };
    
            fetch('http://localhost/user/insert', {
                method: 'POST',
                body: JSON.stringify(requestBody),
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 500) {
                        alert('Already registered user.');
                        throw new Error('User already registered');
                    }  
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                alert(`Success register.`);
                window.location.href = '../html/login.html';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                window.location.href = '../html/register.html';
            });
        } else {
            alert(`Passwords must be the same.`);
            throw new Error('Passwords do not match');
        }
    });
}

function login() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const getInputUser = document.getElementById('username').value.trim();
        const getInputPassword = document.getElementById('password').value.trim();

        const requestBody = {
            name: getInputUser,
            password: getInputPassword
        };

        fetch('http://localhost/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const token = data.message.token;

            localStorage.setItem('token', token);

            window.location.href = '../html/home.html';
            return token;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert(`Unregistered user.`);
            window.location.href = '../html/login.html';
        });
    });
}
