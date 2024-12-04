function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';  
        toggleIcon.src = 'assets/icons/olho_visivel.png'; 
    } else {
        passwordField.type = 'password';  
        toggleIcon.src = 'assets/icons/olho_invisivel.png';  
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  

    const matricula = document.querySelector('input[name="matricula"]').value;
    const senha = document.querySelector('input[name="senha"]').value;
    const rememberMe = document.getElementById('rememberMe').checked; 

    let formData = {
        "matricula": matricula,
        "senha": senha
    };
    
    try {
        
        const response = await fetch('http://localhost:8080/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
    
            if (data.id) {  
                
                const cookieDays = rememberMe ? 30 : null; 

                if (cookieDays) {
                    setCookie('userId', data.id, cookieDays);  
                } else {
                    setSessionCookie('userId', data.id); 
                }

                window.location.href = 'feed.html';
            } else {
                alert('Matrícula ou senha incorretos');
            }
        } else {
            alert('Erro no servidor. Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); 
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=None;Secure`;  
}

function setSessionCookie(cname, cvalue) {
    document.cookie = `${cname}=${cvalue};path=/;SameSite=None;Secure`; 
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function logout() {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    window.location.href = 'login.html';
}

window.onload = function() {
    const userId = getCookie('userId');

    if (userId) {

        window.location.href = 'feed.html';
    }
};

const sairConta = document.getElementById('sairConta');
sairConta.addEventListener('click', function(event) {
    event.preventDefault();
    logout();
});