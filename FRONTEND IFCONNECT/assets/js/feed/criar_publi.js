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

document.getElementById('iconeMais').addEventListener('click', function() {
    const opcoes = document.getElementById('opcoes');
    opcoes.style.display = 'flex';
    setTimeout(() => {
        opcoes.classList.add('ativo');
    }, 10);
});

document.querySelector('.fechar_janela_opcoes').addEventListener('click', function() {
    const opcoes = document.getElementById('opcoes');
    opcoes.classList.remove('ativo');
    setTimeout(() => {
        opcoes.style.display = 'none';
    }, 300);
});

function updateModalProfileImage() {
    const profilePic = localStorage.getItem('userProfilePic');
    const modalProfileIcon = document.getElementById('iconePerfilModal');

    if (modalProfileIcon) {
        modalProfileIcon.src = `${profilePic}?t=${new Date().getTime()}`;
    }
}

async function loadUsername() {
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
        

        const usernameDisplay = document.getElementById('nomeUsuarioCriarPubli');
        if (usernameDisplay) {
            usernameDisplay.textContent = userProfile.nome;
        } else {
            console.error('Elemento nome_usuario_criar_publi não encontrado.');
        }

    } catch (error) {
        console.error('Erro ao carregar nome de usuário:', error);
    }
}

function ativarEdicao(paragrafo) {
    if (!paragrafo.isContentEditable) {
        paragrafo.contentEditable = true;
        paragrafo.focus();
        paragrafo.classList.add('editing');

        if (paragrafo.textContent.trim() === 'Compartilhe seus conhecimentos...') {
            paragrafo.textContent = '';
        }

        document.addEventListener('click', function onClickOutside(event) {
            if (!paragrafo.contains(event.target)) {
                paragrafo.contentEditable = false;
                paragrafo.classList.remove('editing');

                if (paragrafo.textContent.trim() === '') {
                    paragrafo.textContent = 'Compartilhe seus conhecimentos...';
                }

                document.removeEventListener('click', onClickOutside);
            }
        });
    }
}

document.getElementById('adicionarPdf').addEventListener('click', function() {
    document.getElementById('pdfInput').click();
});

document.getElementById('pdfInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const pdfPreview = document.getElementById('pdfPreview');

    pdfPreview.innerHTML = '';

    Array.from(files).forEach(file => {
        if (file.type === 'application/pdf') {
            const pdfContainer = document.createElement('div');
            pdfContainer.classList.add('pdf-preview');

            const pdfType = document.createElement('span');
            pdfType.textContent = 'PDF';
            const pdfName = document.createElement('span');
            pdfName.textContent = file.name;

            pdfContainer.appendChild(pdfType);
            pdfContainer.appendChild(pdfName);

            pdfName.style.marginTop = '5px';

            pdfContainer.addEventListener('click', function() {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(file);
                downloadLink.download = file.name;
                downloadLink.click();
            });

            pdfPreview.appendChild(pdfContainer);
        }
    });
});


document.getElementById('adicionarMidia').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

let plyrInstances = [];

function destroyAllPlyrs() {
    plyrInstances.forEach(plyr => plyr.destroy());
    plyrInstances = [];
}

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const mediaPreview = document.getElementById('carousel');
    const bolinhasRolagem = document.getElementById('bolinhasRolagem');
    const countDisplay = document.getElementById('countDisplay');
    const maxFiles = 10;

    if (files.length > maxFiles) {
        alert(`Você pode adicionar no máximo ${maxFiles} arquivos.`);
        return;
    }

    mediaPreview.innerHTML = '';
    bolinhasRolagem.innerHTML = '';

    if (files.length === 0) {
        return;
    }

    mediaPreview.style.display = 'flex';

    destroyAllPlyrs();

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const mediaElement = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
            mediaElement.src = e.target.result;
    
            const itemContainer = document.createElement('div');
            itemContainer.style.flex = '0 0 100%';
    
            if (file.type.startsWith('video/')) {
                mediaElement.controls = true;
                mediaElement.style.width = '100%';
                mediaElement.style.height = '100%';
                mediaElement.style.objectFit = 'contain';
                itemContainer.appendChild(mediaElement);
    
                const plyr = new Plyr(mediaElement, {
                    controls: ['play', 'progress', 'mute', 'volume', 'fullscreen'],
                    autoplay: false,
                    hideControls: false,
                    fullscreen: {
                        enabled: true,
                        fallback: true,
                        iosNative: true,
                        settings: ['quality', 'speed', 'loop']
                    },
                    loop: { active: true }
                });
    
                plyrInstances.push(plyr);
            } else if (file.type.startsWith('image/')) {
                mediaElement.style.width = '100%';
                mediaElement.style.height = '100%';
                mediaElement.style.objectFit = 'contain';
                itemContainer.appendChild(mediaElement);
            }
    
            mediaPreview.appendChild(itemContainer);
        };
    
        reader.onerror = function(error) {
            console.error("Erro ao carregar o arquivo:", error);
        };
    
        reader.readAsDataURL(file);
    });
    
    for (let i = 0; i < files.length; i++) {
        const bolinha = document.createElement('div');
        bolinha.classList.add('bolinha');
        bolinhasRolagem.appendChild(bolinha);
    }

    currentIndex = 0;
    updateCarousel();

    countDisplay.style.display = 'none';

    bolinhasRolagem.style.display = 'flex';
});

let currentIndex = 0;
let startX = 0;
let threshold = 50;
let isMoving = false;
let timeoutId;

function showCount() {
    countDisplay.style.display = 'block';
    resetCountDisplayTimeout();
}

function resetCountDisplayTimeout() {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        countDisplay.style.display = 'none';
    }, 5000);
}

function isVideoVisible(videoElement) {
    const rect = videoElement.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    const translateX = -currentIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;

    const totalItems = carousel.children.length;
    countDisplay.textContent = `${currentIndex + 1}/${totalItems}`;

    const bolinhas = document.querySelectorAll('.bolinha');
    bolinhas.forEach((bolinha, index) => {
        bolinha.classList.toggle('active', index === currentIndex);
    });

    plyrInstances.forEach(plyr => plyr.pause());

    const currentItem = carousel.children[currentIndex];
    const currentVideo = currentItem ? currentItem.querySelector('video') : null;

    if (currentVideo && isVideoVisible(currentVideo)) {
        plyrInstances[currentIndex].play();
    }

    if (totalItems > 1) {
        countDisplay.style.display = 'block';
    } else {
        countDisplay.style.display = 'none';
    }
}

let hasInteracted = false;

const carousel = document.getElementById('carousel');
carousel.addEventListener('touchstart', function(event) {
    startX = event.touches[0].clientX;
});

carousel.addEventListener('touchmove', function(event) {
    if (isMoving) return;

    const currentX = event.touches[0].clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > threshold) {
        event.preventDefault();
        isMoving = true;

        if (!hasInteracted) {
            hasInteracted = true;
            if (carousel.children.length > 1) {
                countDisplay.style.display = 'block';
            }
        }

        showCount();

        if (diffX > 0) {
            if (currentIndex < carousel.children.length - 1) {
                currentIndex++;
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
            }
        }
        updateCarousel();
    }
});

carousel.addEventListener('touchend', function() {
    isMoving = false;
});

function checkVideosVisibility() {
    plyrInstances.forEach((plyr, index) => {
        const videoElement = plyr.elements[0];
        if (isVideoVisible(videoElement)) {
            plyr.play();
        } else {
            plyr.pause();
        }
    });
}

window.addEventListener('scroll', checkVideosVisibility);
window.addEventListener('resize', checkVideosVisibility);

countDisplay.style.display = 'none';
