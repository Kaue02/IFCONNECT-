function ajustarLargura(caixa) {
    const larguraMaxima = 325;
    const larguraInicial = 100;
    const distanciaDoIcone = 10; 

    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre';
    span.style.font = getComputedStyle(caixa).font;
    span.innerText = caixa.value;

    document.body.appendChild(span);
    const larguraTexto = span.offsetWidth;
    document.body.removeChild(span);

    let novaLargura = larguraInicial;

    if (larguraTexto > larguraInicial) {
        novaLargura = Math.min(larguraTexto + distanciaDoIcone, larguraMaxima);
    }

    caixa.style.width = novaLargura + 'px';
}

function checkLogin() {
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html'; 
    }
    
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


function loadProfileImage() {
    const profilePic = localStorage.getItem('userProfilePic');
    const feedProfileIcon = document.getElementById('iconePerfil');

    if (profilePic && feedProfileIcon) {
        feedProfileIcon.src = `${profilePic}?t=${new Date().getTime()}`;
    }
}

function updateFeedProfileImage() {
    const profilePic = localStorage.getItem('userProfilePic');
    const feedProfileIcon = document.getElementById('iconePerfil');
    
    if (feedProfileIcon) {
        feedProfileIcon.src = `${profilePic}?t=${new Date().getTime()}`;
    }
}

window.onload = function() {
    checkLogin();
    loadProfileImage();
    loadProfileImageOnly();
    loadUsername();
    carregarPublicacoes();

    const feedPublicacoes = document.getElementById('feedPublicacoes');
    feedPublicacoes.innerHTML = '';
    feedPublicacoes.classList.add('in-view');

    const path = window.location.pathname;
    definirIconeAtivo(path);

    document.getElementById('iconePerfil').addEventListener('click', function() {
        window.location.href = 'perfilUsuario.html';
    });

    document.querySelector('.icone_amizade').addEventListener('click', function() {
        trocarConteudo('amizade');
        definirIconeAtivo('amizade');
    });

    document.querySelector('.icone_notificacao').addEventListener('click', function() {
        trocarConteudo('notificacoes');
        definirIconeAtivo('notificacoes');
    });

    document.querySelector('.icone_home').addEventListener('click', function() {
        trocarConteudo('feed');
        definirIconeAtivo('feed');
    });

    const caixaPesquisa = document.querySelector(".caixa_pesquisa");
    const iconePesquisa = document.querySelector(".icone_pesquisa");

    iconePesquisa.addEventListener("click", function() {
        caixaPesquisa.classList.toggle("ativo");
        if (caixaPesquisa.classList.contains("ativo")) {
            caixaPesquisa.focus();
        }
    });

    document.addEventListener("click", function(event) {
        if (!document.querySelector(".div_pesquisa").contains(event.target) && caixaPesquisa.classList.contains("ativo")) {
            caixaPesquisa.classList.remove("ativo");
        }
        
        if (!menuLateral.contains(event.target) && !menuHamburguer.contains(event.target)) {
            menuLateral.classList.remove('ativo');
        }
    });

    function trocarConteudo(tipo) {
        feedPublicacoes.classList.remove('in-view');
        
        if (tipo === 'amizade') {
            feedPublicacoes.innerHTML = `
                <div class="mensagem-centralizada">
                    <p>Você ainda não tem nenhum amigo.</p>
                </div>`;
        } else if (tipo === 'notificacoes') {
            feedPublicacoes.innerHTML = `
            <div class="notificacoes">
                <div class="notificacoes_cabecalho">
                    <p class="notificacoes_cabecalho_titulo">Notificações</p> 
                </div>
                <div class="novas_notificacoes">
                    <p class="novas_notificacoes_p">Novas</p>
                    <div class="notificacao">
                        <div class="notificacao_perfil">
                            <img src="assets/img/perfillinkedin.jpeg" class="notificacao_perfil_img">
                        </div>
                        <div class="notificacao_texto">
                            <p class="notificacao_texto_notificacao"><strong>Isaque Limax</strong> enviou uma mensagem para <strong>Bate-papo geral</strong> no grupo <strong>grupo que</strong>: Boa tarde bando de</p>
                            <p class="noticacao_tempo">4 h</p> 
                        </div>
                        <img src="assets/icons/tresPontos.svg" class="notificacao_texto_reticencias">
                    </div>
                    <div class="notificacao_1">
                        <div class="notificacao_perfil">
                            <img src="assets/img/BenioPubli.png" class="notificacao_perfil_img">
                        </div>
                        <div class="notificacao_texto">
                            <p class="notificacao_texto_notificacao"><strong>Claudius Cruz</strong> comentou na publicação de <strong>Z K sports</strong></p>
                            <p class="noticacao_tempo">37 min</p> 
                        </div>
                        <img src="assets/icons/tresPontos.svg" class="notificacao_texto_reticencias">
                    </div>
                </div>
                <div class="novas_notificacoes">
                    <p class="novas_notificacoes_p">Anteriores</p>
                    <div class="notificacao">
                        <div class="notificacao_perfil">
                            <img src="assets/img/profile_original.png" class="notificacao_perfil_img">
                        </div>
                        <div class="notificacao_texto">
                            <p class="notificacao_texto_notificacao"><strong>Tom Holand</strong> enviou uma mensagem para <strong>Bate-papo</strong> no grupo <strong>Miranhas</strong>: Oi Gente!</p>
                            <p class="noticacao_tempo">4 d</p> 
                        </div>
                        <img src="assets/icons/tresPontos.svg" class="notificacao_texto_reticencias">
                    </div>
                    <div class="notificacao_1">
                        <div class="notificacao_perfil">
                            <img src="assets/img/artworks-000112491959-5mn71l-t500x500.jpg" class="notificacao_perfil_img">
                        </div>
                        <div class="notificacao_texto">
                            <p class="notificacao_texto_notificacao"><strong>Elisvaldo</strong> comentou na sua publicação <strong>Sobre meu TCC</strong></p>
                            <p class="noticacao_tempo"> Há 2 semanas</p> 
                        </div>
                        <img src="assets/icons/tresPontos.svg" class="notificacao_texto_reticencias">
                    </div>
                </div>
            </div>`;
        } /* else {

            feedPublicacoes.innerHTML = '';  // Limpa o conteúdo
            feedPublicacoes.classList.remove('in-view');
            
        } */  else if (tipo === 'feed') {
            if (publicacoesCache.length > 0) {
                
                publicacoesCache.forEach(publicacao => {
                    exibirPublicacaoFeed(publicacao);
                });
            } else {
                
                carregarPublicacoes();
            }
        }  
        
        setTimeout(() => {
            feedPublicacoes.classList.add('in-view');
        }, 10);
    }
    
    function definirIconeAtivo(tipo) {
        const icones = document.querySelectorAll('.cabecalho_navegacao img');
        const linhas = document.querySelectorAll('.icones_linha_abaixo'); 

        icones.forEach(icone => {
            icone.classList.remove('active');
        });

        linhas.forEach(linha => {
            linha.classList.remove('active'); 
        });

        if (tipo === 'amizade') {
            document.querySelector('.icone_amizade').classList.add('active');
            document.querySelector('.icones_linha_abaixo:nth-child(5)').classList.add('active');
        } else if (tipo === 'notificacoes') {
            document.querySelector('.icone_notificacao').classList.add('active');
            document.querySelector('.icones_linha_abaixo:nth-child(7)').classList.add('active');
        } else {
            document.querySelector('.icone_home').classList.add('active');
            document.querySelector('.icones_linha_abaixo:nth-child(1)').classList.add('active');
        }
    }

    const menuHamburguer = document.querySelector('.hamburguer');
    const menuLateral = document.getElementById('menuLateral');
    const menuFechar = document.getElementById('menuFechar');

    menuHamburguer.addEventListener('click', function() {
        menuLateral.classList.toggle('ativo'); 
    });

    menuFechar.addEventListener('click', function() {
        menuLateral.classList.remove('ativo'); 
    });

    caixaPesquisa.addEventListener('input', function() {
        ajustarLargura(this);
    });

    async function loadProfileImageOnly() {
        const userId = getCookie('userId');
        if (!userId) {
            console.error('ID do usuário não encontrado.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/user/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error('Falha ao carregar o perfil.');
            }
    
            const userProfile = await response.json();
            const profilePicUrl = userProfile.fotoPerfil ? `http://localhost:8080/uploads/${userProfile.fotoPerfil}` : 'assets/icons/iconePerfil.svg';

            const feedProfileIcon = document.getElementById('iconePerfil');
            if (feedProfileIcon) {
                feedProfileIcon.src = profilePicUrl;
            }
            localStorage.setItem('userProfilePic', profilePicUrl);
    
        } catch (error) {
            console.error('Erro ao carregar a imagem de perfil:', error);
        }
    }
};

document.querySelector('.icone_criar_pub').addEventListener('click', function() {
    updateModalProfileImage();
    loadUsername();
    const modal = document.getElementById('modalCriarPublicacao');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('ativo');
    }, 10);
});

document.getElementById('fecharCriarPubli').addEventListener('click', function() {
    const modal = document.getElementById('modalCriarPublicacao');
    modal.classList.remove('ativo');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalCriarPublicacao');
    if (event.target === modal) {
        modal.classList.remove('ativo');

        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }
});

    let paginaAtual = 0;
    const limite = 10;
    let publicacoesCache = [];

function carregarPublicacoes() {
    
    paginaAtual++;
    
    fetch(`http://localhost:8080/publicacao/maisPublicacoes/${paginaAtual}?limite=${limite}`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(publicacoes => {
        if (publicacoes.length > 0) {
            publicacoes.forEach(publicacao => {
                exibirPublicacaoFeed(publicacao);
            });
        } else {
            console.log('Não há mais publicações.');
        }
    })
    .catch(error => console.error('Erro ao carregar publicações:', error));
}

function verificarRolagem() {

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        carregarPublicacoes();
    }
}

window.addEventListener('scroll', verificarRolagem);

carregarPublicacoes(); 

function logout() {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    window.location.href = 'login.html';
}

const sairConta = document.getElementById('sairConta');
sairConta.addEventListener('click', function(event) {
    event.preventDefault();
    logout();
});




