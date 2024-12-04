function flipCard() {
    const card = document.querySelector('.flip-card');
    const paragrafo = document.getElementById('paragrafo_aluno');
    
    card.classList.toggle('flipped');
    
    setTimeout(() => {
        if (card.classList.contains('flipped')) {
            paragrafo.textContent = "Professor"; 
        } else {
            paragrafo.textContent = "Aluno"; 
        }
    }, 400); 
}


function togglePasswordVisibility(passwordFieldId, toggleIconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';  
        toggleIcon.src = 'assets/icons/olho_visivel.png';  
    } else {
        passwordField.type = 'password'; 
        toggleIcon.src = 'assets/icons/olho_invisivel.png'; 
    }
}

    document.querySelector('.botao_cadastrar').addEventListener('click', function(event) {
    event.preventDefault(); 

    const nomeUsuario = document.querySelector('input[name="nomeUsuario"]').value;
    const emailAcademico = document.querySelector('input[name="emailAcademico"]').value;
    const matricula = document.querySelector('input[name="matricula"]').value;
    const senha = document.querySelector('input[name="senha"]').value;
    const confirmarSenha = document.querySelector('input[name="confirmarSenha"]').value;

    let nomeUsuarioProfessor = null;
    let emailAcademicoProfessor = null;
    let matriculaSIAPE = null;
    let senhaBack = null;
    let confirmarSenhaBack = null;

    const cardFlipped = document.querySelector('.flip-card').classList.contains('flipped');
    if (cardFlipped) {
        nomeUsuarioProfessor = document.querySelector('input[name="nomeUsuarioProfessor"]').value;
        emailAcademicoProfessor = document.querySelector('input[name="emailAcademicoProfessor"]').value;
        matriculaSIAPE = document.querySelector('input[id="inputSIAPE"]').value;
        senhaBack = document.querySelector('input[id="passwordBack"]').value;
        confirmarSenhaBack = document.querySelector('input[id="confirmPasswordBack"]').value;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (cardFlipped && senhaBack !== confirmarSenhaBack) {
        alert('As senhas no verso não coincidem!');
        return;
    }

    const formData = {
        nome: cardFlipped ? nomeUsuarioProfessor : nomeUsuario,
        email: cardFlipped ? emailAcademicoProfessor : emailAcademico,
        matricula: cardFlipped ? matriculaSIAPE : matricula,
        senha: cardFlipped ? senhaBack : senha,
        tipoUsuario: cardFlipped ? "Professor" : "Aluno"
    };

    fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json().then(data => {
        if (response.status === 201) {
            alert('Cadastro realizado com sucesso! Agora faça seu login');
            
            clearFormInputs();

            window.location.href = 'login.html'; 
        } else {
            alert('Erro ao cadastrar: ' + data.message);
        }
    }))
    .catch(error => {
        console.error('Erro: ', error);
        alert('Ocorreu um erro ao processar o cadastro.');
    });
});

function clearFormInputs() {
    
    document.querySelector('input[name="nomeUsuario"]').value = '';
    document.querySelector('input[name="emailAcademico"]').value = '';
    document.querySelector('input[name="matricula"]').value = '';
    document.querySelector('input[name="senha"]').value = '';
    document.querySelector('input[name="confirmarSenha"]').value = '';

    document.querySelector('.flip-card-back input[placeholder="Nome de Usuário"]').value = ''; 
    document.querySelector('.flip-card-back input[placeholder="E-mail Acadêmico"]').value = ''; 
    document.querySelector('input[id="inputSIAPE"]').value = ''; 
    document.querySelector('input[id="passwordBack"]').value = ''; 
    document.querySelector('input[id="confirmPasswordBack"]').value = ''; 
}


