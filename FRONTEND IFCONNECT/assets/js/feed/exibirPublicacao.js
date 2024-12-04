async function exibirPublicacaoFeed(publicacao) {
    const feed = document.getElementById('feedPublicacoes');

    const publicacaoElemento = document.createElement('div');
    publicacaoElemento.classList.add('publicacao');

    const publicacaoCabecalho = await criarCabecalhoPublicacao(publicacao);
    
    publicacaoElemento.appendChild(publicacaoCabecalho);

    publicacaoElemento.innerHTML += `  
        <div class="texto_da_publicacao" id="textoDaPublicacao">
            <p class="texto_da_publicacao_p">${publicacao.texto}</p>
        </div>
    `;

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media_preview');
    mediaContainer.id = 'mediaPreview';

    const carrossel = document.createElement('div');
    carrossel.classList.add('carousel');
    carrossel.id = 'carousel';

    const allMediaItems = [];

    if (publicacao.fotoNomes && publicacao.fotoNomes.length > 0) {
        publicacao.fotoNomes.forEach(foto => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');
            const img = document.createElement('img');
            img.src = `http://localhost:8080/uploads/publicacao/${foto}`;
            img.style.width = '100%';
            mediaItem.appendChild(img);
            allMediaItems.push(mediaItem);
        });
    }

    if (publicacao.videoNomes && publicacao.videoNomes.length > 0) {
        publicacao.videoNomes.forEach(video => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('media-item');
            const videoElement = document.createElement('video');
            videoElement.src = `http://localhost:8080/uploads/publicacao/${video}`;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            mediaItem.appendChild(videoElement);
            allMediaItems.push(mediaItem);
        });
    }

    allMediaItems.forEach(item => carrossel.appendChild(item));

    mediaContainer.appendChild(carrossel);

    if (publicacao.pdfNome) {
        const pdfContainer = document.createElement('div');
        pdfContainer.classList.add('pdf-preview');
    
        const pdfType = document.createElement('p');
        pdfType.textContent = 'PDF';
        pdfType.style.fontWeight = 'bold';
        pdfContainer.appendChild(pdfType);
    
        const pdfName = document.createElement('p');
        pdfName.textContent = publicacao.pdfNome;
        pdfContainer.appendChild(pdfName);
    
        pdfContainer.addEventListener('click', async function () {
            try {
                const response = await fetch(`http://localhost:8080/publicacao/arquivo/${publicacao.pdfNome}`);
                if (!response.ok) {
                    throw new Error('Erro ao obter o arquivo PDF');
                }
        
                const blob = await response.blob();
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = publicacao.pdfNome;
                downloadLink.click();
            } catch (error) {
                console.error('Erro no download do PDF:', error);
            }
        });
        
        mediaContainer.appendChild(pdfContainer);
    }

    publicacaoElemento.appendChild(mediaContainer);

const opcoesPublicacao = document.createElement('div');
opcoesPublicacao.classList.add('opcoes_publicacao');
opcoesPublicacao.innerHTML = `
    <div class="like_coment">
        <div class="like">
            <img src="assets/icons/curtida.svg" class="icones_publi" id="like-icon" data-liked="false">
            <p class="num_like" id="numLike">${publicacao.numLikesElement || 0}</p>
        </div>
        <div class="comentarios_div">
            <img src="assets/icons/comentarios.svg" class="icones_publi" id="idComentarios">
            <p class="num_comentarios">${publicacao.numComentarios || 0}</p>
        </div>
    </div>
    <div class="icone_enviar">
        <img src="assets/icons/enviar.svg" class="icones_publi_enviar">
    </div>
`;

const comentariosBtn = opcoesPublicacao.querySelector('#idComentarios');
comentariosBtn.setAttribute('data-id', publicacao.id);

comentariosBtn.addEventListener('click', function (event) {
    const idPublicacao = event.target.getAttribute('data-id');
    abrirComentarios(idPublicacao);
});

publicacaoElemento.appendChild(opcoesPublicacao);

const linhaSeparaPubli = document.createElement('div');
linhaSeparaPubli.classList.add('linha_separa_publi');
linhaSeparaPubli.id = 'linhaSeparaPubli';

feed.appendChild(publicacaoElemento);
feed.appendChild(linhaSeparaPubli);

const userId = getCookie('userId');
const publicacaoId = publicacao.id;

const likeDiv = opcoesPublicacao.querySelector('.like');
const likeIcon = likeDiv.querySelector('#like-icon');
const numLikesElement = likeDiv.querySelector('#numLike');

numLikesElement.textContent = publicacao.likesQuant || 0;

const isLiked = publicacao.likes.some(like => like.idUsuario === userId);
likeIcon.setAttribute('data-liked', isLiked ? 'true' : 'false');
likeIcon.src = isLiked ? 'assets/icons/likeVermelho.png' : 'assets/icons/curtida.svg';

likeIcon.addEventListener('click', async () => {
    const isLiked = likeIcon.getAttribute('data-liked') === 'true';
    const method = isLiked ? 'DELETE' : 'POST';

    const data = {
        idUsuario: userId,
        idPublicacao: publicacaoId
    };

    try {
        
        const response = await fetch(`http://localhost:8080/likes`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Erro ao processar like:', errorResponse);
            throw new Error('Erro ao atualizar o like.');
        }

        const newLikesData = await response.json();
        numLikesElement.textContent = newLikesData.quantidadeLikes || 0;

        likeIcon.src = isLiked ? 'assets/icons/curtida.svg' : 'assets/icons/likeVermelho.png';
        likeIcon.setAttribute('data-liked', !isLiked);
    } catch (error) {
        console.error('Erro ao processar like:', error);
    }
});



const comentariosModal = document.getElementById('comentarios');
    const setaVoltarComent = document.getElementById('setaVoltarComent');
    const fazComentarioComenta = document.getElementById('fazComentarioComenta');
    const textoPadraoComentario = 'Adicione um comentário...';
        
    async function abrirComentarios(id) {
        const comentariosModal = document.getElementById('comentarios');
        
        if (comentariosModal.classList.contains('ativo')) {
            return;
        }
    
        comentariosModal.classList.add('ativo');
        comentariosModal.setAttribute('data-id-publicacao', id);
        
        const comentariosConteudo = document.querySelector('.comentarios_conteudo');
        comentariosConteudo.removeAttribute('data-carregado');

        await carregarComentarios(id);
        comentariosConteudo.setAttribute('data-carregado', 'true');
    }
    
    function fecharComentarios() {
        comentariosModal.classList.remove('ativo');
    }

    document.addEventListener('click', function (event) {
        if (event.target.id === 'idComentarios') {
            const idPublicacao = event.target.getAttribute('data-id');
            abrirComentarios(idPublicacao);
            atualizarFotoPerfilComentario();
        }
    });

    setaVoltarComent.addEventListener('click', fecharComentarios);

    function ativarEdicaoComentario(paragrafoComentario) {
        if (!paragrafoComentario.isContentEditable) {
            paragrafoComentario.contentEditable = true;
            paragrafoComentario.focus();
            paragrafoComentario.classList.add('editing');

            if (paragrafoComentario.textContent.trim() === textoPadraoComentario) {
                paragrafoComentario.textContent = ''; 
            }
            setTimeout(() => {
                document.addEventListener('click', function onClickOutsideComentario(event) {
                    if (!paragrafoComentario.contains(event.target)) {
                        paragrafoComentario.contentEditable = false;
                        paragrafoComentario.classList.remove('editing');

                        if (paragrafoComentario.textContent.trim() === '') {
                            paragrafoComentario.textContent = textoPadraoComentario;
                        }

                        document.removeEventListener('click', onClickOutsideComentario);
                    }
                });
            }, 0);
        }
    }

    fazComentarioComenta.addEventListener('click', function () {
        ativarEdicaoComentario(fazComentarioComenta);
    });

    const enviaComentario = document.getElementById('enviaComentario');
if (!enviaComentario.hasAttribute('data-listener')) {
    enviaComentario.addEventListener('click', async () => {
    
        const comentarioTexto = document.getElementById('fazComentarioComenta').innerText.trim();
        if (comentarioTexto === "") {
            console.error("Comentário vazio. Não é possível enviar.");
            return;
        }

        const idUsuario = getCookie('userId');
        const publicacaoId = comentariosModal.getAttribute('data-id-publicacao');

        const dadosComentario = {
            idUsuarioComentario: idUsuario,
            idPublicacao: publicacaoId,
            texto: comentarioTexto
        };

        enviaComentario.disabled = true;

        try {
            const response = await fetch('http://localhost:8080/comentarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosComentario)
            });

            if (response.ok) {
                const comentarioCriado = await response.json();

                if (comentarioCriado && comentarioCriado.id) {
                    adicionarComentarioNoDOM(comentarioCriado);
                }
            } else {
                console.error('Erro ao criar comentário');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
        } finally {
            enviaComentario.disabled = false;
        }
    });

    enviaComentario.setAttribute('data-listener', 'true');
}

    
    async function adicionarComentarioNoDOM(comentario) {
        const comentariosConteudo = document.querySelector('.comentarios_conteudo');
    
        const comentarioExistente = comentariosConteudo.querySelector(`#comentario_${comentario.id}`);
        if (comentarioExistente) {
            
            return;
        }
    
        const profilePic = localStorage.getItem('userProfilePic');
        const divComentario = document.createElement('div');
        divComentario.classList.add('comentario_comentario');
        divComentario.id = `comentario_${comentario.id}`;
    
        divComentario.innerHTML = `
            <div class="perfil_comentario">
                <img src="${profilePic}" class="perfil_conteudo" id="perfilConteudo" alt="imagem de perfil">
            </div>
            <div class="nome_tempo_comentario">
                <div class="nome_tempo">
                    <p class="comentario_nome_usuario" id="comentarioNomeUsuario"></p>
                    <p class="comentario_tempo" id="tempocomentario"> 3 sem</p> 
                </div>
                <div class="comentario">${comentario.texto}</div>
            </div>
        `;
        comentariosConteudo.appendChild(divComentario);
    
        await loadUsernameComentario();
    
        const userName = localStorage.getItem('userName');
        const usernameComentario = divComentario.querySelector('#comentarioNomeUsuario');
        if (usernameComentario && userName) {
            usernameComentario.textContent = userName;
        }
    
        document.getElementById('fazComentarioComenta').textContent = textoPadraoComentario;
    }
    
    
async function loadUsernameComentario() {
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
        
        localStorage.setItem('userName', userProfile.nome);
    } catch (error) {
        console.error('Erro ao carregar nome de usuário:', error);
    }
}


function atualizarFotoPerfilComentario() {
    const profilePic = localStorage.getItem('userProfilePic');
    
    const perfilComentarioImg = document.getElementById('PerfiComentario');
    if (perfilComentarioImg && profilePic) {
        perfilComentarioImg.src = profilePic;
    } else {
        console.error('Imagem de perfil não encontrada ou não definida no localStorage');
    }

    perfilComentarioImg.src = profilePic || 'caminho/para/imagem/default.jpg'; 

}

async function carregarComentarios(idPublicacao) {
    const comentariosConteudo = document.querySelector('.comentarios_conteudo');
    comentariosConteudo.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:8080/comentarios/${idPublicacao}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar comentários.');
        }

        const comentarios = await response.json();

        comentarios.forEach(comentario => {
            const comentarioExistente = comentariosConteudo.querySelector(`#comentario_${comentario.id}`);
            if (!comentarioExistente) {
        
                adicionarComentarioNoDOM(comentario);
            } 
        });

    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

inicializarCarrossel(carrossel, allMediaItems);

}