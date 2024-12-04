document.addEventListener('DOMContentLoaded', function () {
    const fazerPublicacaoBtn = document.getElementById('fazerPublicacao');
    const userId = getCookie('userId');
    const fileInput = document.getElementById('fileInput');
    const modal = document.getElementById('modalCriarPublicacao');

    fazerPublicacaoBtn.addEventListener('click', async function () {
        const textoPublicacaoElement = document.getElementById('textoPubli');
        if (!textoPublicacaoElement) {
            console.error('Elemento textoPubli não encontrado!');
            return;
        }

        const textoPublicacao = textoPublicacaoElement.textContent.trim();
        if (!textoPublicacao || textoPublicacao === 'Compartilhe seus conhecimentos...') {
            console.error('Texto da publicação está vazio');
            return;
        }

        const tags = tagsSelecionadas;
        const imagens = [];
        const videos = [];
        let documento = null;

        if (fileInput.files.length > 0) {
            for (let file of fileInput.files) {
                if (file.type.startsWith('image/')) {
                    imagens.push(file);
                } else if (file.type.startsWith('video/')) {
                    videos.push(file);
                }
            }
        }

        const inputDocumento = document.getElementById('pdfInput');
        if (inputDocumento && inputDocumento.files.length > 0) {
            documento = inputDocumento.files[0];
        }

        const dadosCriacao = {
            texto: textoPublicacao,
            idTags: tagsSelecionadas,
            
        };

        const formData = new FormData();
        formData.append('dadosCriacao', JSON.stringify(dadosCriacao));
        

        if (imagens.length > 0) {
            imagens.forEach(imagem => {
                formData.append('imagens', imagem);
            });
        }

        if (videos.length > 0) {
            videos.forEach(video => {
                formData.append('videos', video);
            });
        }

        if (documento) {
            formData.append('documento', documento);
        }

        try {
            const response = await fetch(`http://localhost:8080/publicacao/${userId}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const responseData = await response.json();

            if (response.ok) {
                exibirPublicacaoFeed(responseData);
                modal.style.display = 'none';
            } else {
                alert('Erro ao criar publicação');
            }
            
        } catch (error) {
            console.error('Erro ao enviar publicação:', error);
        }
    });
});

function inicializarCarrossel(carrosselElement, mediaItems, countDisplay) {
    let currentIndex = 0;
    let hideTimeout;
    let hasInteracted = false;

    function showCount() {
        if (!hasInteracted) return;
        if (countDisplay) {
            countDisplay.style.display = 'block';

            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hideCount, 5000);
        }
    }

    function hideCount() {
        if (countDisplay) {
            countDisplay.style.display = 'none';
        }
    }

    function updateCarousel() {
        const translateX = -currentIndex * 100;
        carrosselElement.style.transform = `translateX(${translateX}%)`;

        const totalItems = carrosselElement.children.length;

        if (countDisplay) {
            countDisplay.textContent = `${currentIndex + 1}/${totalItems}`;
        }

        plyrInstances.forEach(plyr => plyr.pause());

        const currentItem = carrosselElement.children[currentIndex];
        const currentVideo = currentItem ? currentItem.querySelector('video') : null;

        if (currentVideo && isVideoVisible(currentVideo)) {
            plyrInstances[currentIndex].play();
        }

        showCount();
    }

    let startX = 0;
    let isMoving = false;
    const threshold = 50;

    carrosselElement.addEventListener('touchstart', function (event) {
        startX = event.touches[0].clientX;

        if (!hasInteracted) {
            hasInteracted = true;
            showCount();
        }
    });

    carrosselElement.addEventListener('touchmove', function (event) {
        if (isMoving) return;

        const currentX = event.touches[0].clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > threshold) {
            event.preventDefault();
            isMoving = true;

            if (diffX > 0 && currentIndex < mediaItems.length - 1) {
                currentIndex++;
            } else if (diffX < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
        }
    });

    carrosselElement.addEventListener('touchend', function () {
        isMoving = false;
    });

    hideCount();
    updateCarousel();
}

async function criarCabecalhoPublicacao(publicacao) {
    const userId = getCookie('userId');
    
    const cabecalho = document.createElement('div');
    cabecalho.classList.add('formato_publication_cabecalho');

    const divIconeNome = document.createElement('div');
    divIconeNome.classList.add('div_icone_nome');
    
    const perfilIcon = document.createElement('img');
    perfilIcon.classList.add('icone_perfil_publicacoes');
    perfilIcon.alt = "Ícone de perfil do Usuário";
    perfilIcon.id = 'iconePerfilPublicações';

    const profilePic = localStorage.getItem('userProfilePic');
    perfilIcon.src = `${profilePic}?t=${new Date().getTime()}`;

    const nomePerfil = document.createElement('p');
    nomePerfil.classList.add('nome_perfil_pubicacaoes');
    nomePerfil.id = 'nomePerfil';

    const tipoUsuario = document.createElement('p');
    tipoUsuario.classList.add('tipo_usuario');
    
    const iconeTipoUsuario = document.createElement('img');
    iconeTipoUsuario.classList.add('img_icone_tipo_usuario');

    divIconeNome.appendChild(perfilIcon);
    divIconeNome.appendChild(nomePerfil);
    divIconeNome.appendChild(tipoUsuario);
    divIconeNome.appendChild(iconeTipoUsuario);

    if (publicacao.tags && publicacao.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('iconeContadorTags');
        tagsContainer.innerHTML = `  
            <span id="contadorTags" class="contador_tags">+${publicacao.tags.length}</span>
            <img src="assets/icons/adicionarTags.svg" class="tag_contador">
        `;
        tagsContainer.style.display = 'inline-block';
        divIconeNome.appendChild(tagsContainer);
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
        nomePerfil.textContent = userProfile.nome;

        if (userProfile.tipoUsuario === 'PROFESSOR') {
            tipoUsuario.textContent = 'Professor';
            iconeTipoUsuario.src = 'assets/icons/iconeChapeuProfessor.svg';
        } else {
            tipoUsuario.textContent = 'Estudante';
            iconeTipoUsuario.src = 'assets/icons/iconeChapeuEstudante.svg';
        }

        const countDisplay = document.createElement('div');
        countDisplay.id = 'countDisplay';
        countDisplay.classList.add('count_display');
        countDisplay.innerHTML = '0 itens';
        divIconeNome.appendChild(countDisplay);

    } catch (error) {
        console.error('Erro ao carregar nome de usuário:', error);
    }

    cabecalho.appendChild(divIconeNome);
    
    return cabecalho;
}

function abrirModalRemoverTags(tags) {
    const modal = document.getElementById('modalRemoverTags');
    const containerTags = document.getElementById('tagsRemoverList');

    containerTags.innerHTML = '';

    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag_item');
        tagElement.textContent = tag;
        containerTags.appendChild(tagElement);
    });

    modal.style.display = 'block';
}

