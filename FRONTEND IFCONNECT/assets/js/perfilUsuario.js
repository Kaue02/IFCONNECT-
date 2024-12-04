const imageOptionsModal = document.getElementById('imageOptionsModal');
const viewImageModal = document.getElementById('viewImageModal');
const profileImage = document.getElementById('profileImage');
const profileImageInput = document.getElementById('profileImageInput');
const viewImage = document.getElementById('viewImage');
const closeViewModal = document.getElementById('closeViewModal');
const closeModal = document.getElementById('closeModal');
const bannerImage = document.getElementById('bannerImage');
const bannerImageInput = document.getElementById('bannerImageInput');
const previewImage = document.createElement('img');
const sendPhotoButton = document.createElement('button');
const modalOverlay = document.getElementById('modalOverlay');
const addDetailsModal = document.getElementById('addDetailsModal');
const addDetailsModalOverlay = document.getElementById('addDetailsModalOverlay');
const addDetailsButton = document.getElementById('addDetailsButton');
const closeAddDetailsModal = document.getElementById('closeAddDetailsModal');
const submitDetailsButton = document.getElementById('submitDetailsButton');

function checkLogin() {
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return cookieValue;
    }
}

window.onload = async () => {
    checkLogin();
    await loadUserProfile();
};

sendPhotoButton.textContent = 'Enviar Foto';
sendPhotoButton.style.marginTop = '10px';
sendPhotoButton.style.display = 'none';

const modalContent = imageOptionsModal.querySelector('.modal-content');
modalContent.appendChild(previewImage);
modalContent.appendChild(sendPhotoButton);

function openModal() {
    modalOverlay.style.display = 'block';
    imageOptionsModal.style.display = 'block';
    setTimeout(() => {
        imageOptionsModal.classList.add('show');
    }, 10);
}

function closeModalFunc() {
    imageOptionsModal.classList.remove('show');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        imageOptionsModal.style.display = 'none';
    }, 300);
}

function closeViewModalFunc() {
    viewImageModal.style.display = 'none';
}

function resetModal() {
    previewImage.src = '';
    sendPhotoButton.style.display = 'none';
    modalContent.childNodes.forEach(child => {
        if (child.nodeType === 1 && child !== previewImage && child !== sendPhotoButton) {
            child.style.display = 'block';
        }
    });
}

profileImage.addEventListener('click', () => {
    openModal();
    viewImage.src = profileImage.src;
});

bannerImage.addEventListener('click', () => {
    openModal();
    viewImage.src = bannerImage.src;
});

document.getElementById('viewPhoto').addEventListener('click', () => {
    viewImageModal.style.display = 'flex';
});

closeViewModal.addEventListener('click', closeViewModalFunc);
closeModal.addEventListener('click', closeModalFunc);

function loadImage(input, isProfileImage) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            modalContent.childNodes.forEach(child => {
                if (child.nodeType === 1 && child !== previewImage && child !== sendPhotoButton) {
                    child.style.display = 'none';
                }
            });
            previewImage.src = e.target.result;
            sendPhotoButton.style.display = 'block';
            previewImage.style.maxWidth = isProfileImage ? '50%' : '100%';
        }
        reader.readAsDataURL(file);
    }
}

profileImageInput.addEventListener('change', () => {
    loadImage(profileImageInput, true);
});

bannerImageInput.addEventListener('change', () => {
    loadImage(bannerImageInput, false);
});

document.getElementById('uploadPhoto').addEventListener('click', () => {
    const activeImage = viewImage.src === profileImage.src ? profileImageInput : bannerImageInput;
    activeImage.click();
});

async function uploadImage(imageFile, isProfileImage) {
    const userId = getCookie('userId');
    const formData = new FormData();
    formData.append('file', imageFile);

    const arquivoTipo = isProfileImage ? 'fotoPerfil' : 'fotoBanner';

    try {
        const response = await fetch(`http://localhost:8080/upload/${userId}/${arquivoTipo}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar a imagem.');
        }

        const data = await response.text();

        return data;
    } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
    }
}

sendPhotoButton.addEventListener('click', async () => {
    const activeImageInput = viewImage.src === profileImage.src ? profileImageInput : bannerImageInput;
    const activeImage = viewImage.src === profileImage.src ? profileImage : bannerImage;

    const uploadedImageResponse = await uploadImage(activeImageInput.files[0], activeImage === profileImage);

    if (uploadedImageResponse) {
        activeImage.src = URL.createObjectURL(activeImageInput.files[0]);
        closeModalFunc();
        resetModal();
    }
});

async function saveBio(bioValue) {
    const userId = getCookie('userId');

    try {
        const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bio: bioValue }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar a biografia.');
        }

    } catch (error) {
        console.error('Erro ao enviar biografia:', error);
    }
}

const editBioIcon = document.querySelector('.sobre_mim_icone_editar');
const bioContainer = document.getElementById('bioContainer');
const bioText = document.getElementById('bioText');
const bioInput = document.getElementById('bioInput');
const saveBioButton = document.getElementById('saveBio');

editBioIcon.addEventListener('click', () => {
    bioText.style.display = 'none';
    bioInput.style.display = 'block';
    saveBioButton.style.display = 'block';

    if (bioText.textContent.trim() === 'Adicione sua biografia...' ||
        bioText.innerHTML.trim() === 'Esta é a sua biografia. Clique no lápis para editar.') {
        bioInput.value = '';
    } else {
        bioInput.value = bioText.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    }
});

bioInput.addEventListener('input', () => {
    bioInput.style.height = 'auto';
    bioInput.style.height = `${bioInput.scrollHeight}px`;
});

saveBioButton.addEventListener('click', async () => {
    const bioValue = bioInput.value.trim();

    if (!bioValue) {
        bioText.innerHTML = 'Adicione sua biografia...';
    } else {
        bioText.innerHTML = bioValue.replace(/\n/g, '<br>');
    
        await saveBio(bioValue);
    }
    bioInput.style.display = 'none';
    saveBioButton.style.display = 'none';
    bioText.style.display = 'block';
});

async function loadUserProfile() {
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

        const usernameDisplay = document.getElementById('nome_usuario');
        usernameDisplay.textContent = `${userProfile.nome} -`;

        const userTypeText = document.getElementById('idTipoUsuario');
        const userTypeIcon = document.getElementById('tipoUsuarioIcone');

        if (userTypeText && userTypeIcon) {
            if (userProfile.tipoUsuario === 'PROFESSOR') {
                userTypeText.textContent = 'Professor';
                userTypeIcon.src = 'assets/icons/iconeChapeuProfessor.svg';
                userTypeIcon.classList.add('icone_para_cima');
            } else {
                userTypeText.textContent = 'Estudante';
                userTypeIcon.src = 'assets/icons/iconeChapeuEstudante.svg';
                userTypeIcon.classList.remove('icone_para_cima');
            }
        } else {
            console.error('Elementos de tipo de usuário não encontrados.');
        }

        const profilePicUrl = userProfile.fotoPerfil ? `http://localhost:8080/uploads/${userProfile.fotoPerfil}` : 'assets/img/imgDefaultPerfil.svg';
        profileImage.src = profilePicUrl;

        const feedProfileIcon = document.getElementById('iconePerfil');
        if (feedProfileIcon) {
            feedProfileIcon.src = profilePicUrl;
        }

        localStorage.setItem('userProfilePic', profilePicUrl);
        
        bannerImage.src = userProfile.fotoBanner ? `http://localhost:8080/uploads/${userProfile.fotoBanner}` : 'assets/img/imgDefaultBanner.svg';

        bioText.innerHTML = userProfile.bio ? userProfile.bio.replace(/\n/g, '<br>') : 'Adicione sua biografia...';
        bioInput.value = userProfile.bio || '';

        const details = {
            celular: userProfile.celular || '',
            emailContato: userProfile.emailContato || '',
            pronomes: userProfile.pronomes || '',
            materiaPreferida: userProfile.materia || '',
            curso: userProfile.curso || ''
        };

        updateDetailsDisplay(details);

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

function openAddDetailsModal() {
    addDetailsModalOverlay.style.display = 'block';
    addDetailsModal.style.display = 'block';

    setTimeout(() => {
        addDetailsModal.classList.add('show');
        addDetailsModal.style.bottom = '0';
        modalOverlay.style.opacity = '1';
    }, 10);
}

closeAddDetailsModal.addEventListener('click', () => {
    addDetailsModal.classList.remove('show');
    addDetailsModal.style.bottom = '-100%';

    modalOverlay.style.opacity = '0';

    setTimeout(() => {
        addDetailsModalOverlay.style.display = 'none';
        addDetailsModal.style.display = 'none';
        addDetailsModal.style.bottom = '';
        modalOverlay.style.opacity = '';
    }, 300);
});

addDetailsButton.addEventListener('click', openAddDetailsModal);

submitDetailsButton.addEventListener('click', () => {
    const details = [];
    for (let i = 1; i <= 5; i++) {
        const option = document.getElementById(`option${i}`);
        if (option.checked) {
            details.push(option.id);
        }
    }
    
    closeAddDetailsModal.click();
});

submitDetailsButton.addEventListener('click', async () => {
    const details = {};
    const detailElements = [
        { id: 'numeroCelular', key: 'celular' },
        { id: 'emailContato', key: 'emailContato' },
        { id: 'pronomeUsuario', key: 'pronomes' },
        { id: 'materiaFavoritaUsuario', key: 'materia' },
        { id: 'cursoUsuario', key: 'curso' }
    ];

    detailElements.forEach(detail => {
        const input = document.getElementById(detail.id);
        if (input.value.trim() !== '') {
            details[detail.key] = input.value.trim();
        }
    });

    await sendUserDetails(details);
    closeAddDetailsModal.click();
    updateDetailsDisplay(details);
});

async function sendUserDetails(details) {
    const userId = getCookie('userId');

    try {
        const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar os detalhes.');
        }

    } catch (error) {
        console.error('Erro ao enviar detalhes:', error);
    }
}

function updateDetailsDisplay(details) {
    const detailsContainer = document.getElementById('itensDetalhes');
    detailsContainer.innerHTML = ''; 

    const hasDetails = Object.values(details).some(value => value.trim() !== '');

    if (hasDetails) {
    
        Object.entries(details).forEach(([key, value]) => {
            if (value.trim() !== '') { 
                const detailDiv = document.createElement('div');
                detailDiv.classList.add('formato_detalhes');

                const icon = document.createElement('img');
                icon.classList.add('formato_detalhes_icone');

                switch (key) {
                    case 'celular':
                        icon.src = 'assets/icons/celular.svg';
                        break;
                    case 'emailContato':
                        icon.src = 'assets/icons/email.svg';
                        break;
                    case 'pronomes':
                        icon.src = 'assets/icons/pronome.svg';
                        break;
                    case 'materiaPreferida':
                        icon.src = 'assets/icons/materiaFavorita.svg';
                        break;
                    case 'curso':
                        icon.src = 'assets/icons/curso.svg';
                        break;
                    default:
                        icon.src = '';
                }

                const text = document.createElement('p');
                text.classList.add('formato_detalhes_texto');
                text.textContent = `- ${value}`;

                detailDiv.appendChild(icon);
                detailDiv.appendChild(text);
                detailsContainer.appendChild(detailDiv);
            }
        });
    } else {
        detailsContainer.innerHTML = 'Ainda não há detalhes sobre este perfil';
    }
}

    const backButton = document.getElementById('botaoVoltar');

        backButton.addEventListener('click', () => {
            window.location.href = 'feed.html';
        });