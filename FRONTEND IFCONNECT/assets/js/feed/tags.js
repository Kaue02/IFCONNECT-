const modalTags = document.getElementById('modalTags');
const abrirModalTags = document.getElementById('tagId');
const fecharModalTags = document.getElementById('fecharModalTags');
const btnPesquisarTag = document.getElementById('btnPesquisarTag');
const btnCriarTag = document.getElementById('btnCriarTag');
const inputCriarTag = document.getElementById('inputCriarTag');
const inputPesquisaTag = document.getElementById('inputPesquisaTag');
const tagsList = document.getElementById('tagsList');
const contadorTags = document.getElementById('contadorTags');
const colorPickerDiv = document.getElementById('inputCorTag');
const colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.style.display = 'none';

let tags = [];
let tagsSelecionadas = [];
let tagsParaRemover = []; 

let tagsExibidas = false;

abrirModalTags.addEventListener('click', function() {
    modalTags.style.display = 'block';
    tagsExibidas = false;
    esconderInstrucoesEButton();
});

fecharModalTags.addEventListener('click', function() {
    modalTags.style.display = 'none';
    esconderInstrucoesEButton();
});

document.getElementById('btnCriarTag').addEventListener('click', async function() {
    const tagName = inputCriarTag.value.trim();
    const tagColor = colorPickerDiv.style.backgroundColor;

    if (tagName !== "" && tagColor) {
        const novaTag = { nome: tagName, cor: tagColor };

        try {
            const response = await fetch('http://localhost:8080/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaTag),
                credentials: 'include',
            });

            if (response.ok) {
                const tagCriada = await response.json();
                
                tags.push(tagCriada);

                exibirTags(tags);
                tagsExibidas = true;
                mostrarInstrucoesEButton();
                inputCriarTag.value = '';
                colorPickerDiv.style.backgroundColor = '#000000';
            } else {
                console.error('Erro ao criar tag');
            }
        } catch (error) {
            console.error('Erro na criação da tag:', error);
        }
    } else {
        console.error('Nome ou cor inválidos');
    }
});




btnPesquisarTag.addEventListener('click', async function() {
    const pesquisaTermo = inputPesquisaTag.value.trim().toLowerCase();

    if (pesquisaTermo !== "") {
        try {
            const response = await fetch(`http://localhost:8080/tags?query=${pesquisaTermo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const tagsFiltradas = await response.json();
                exibirTags(tagsFiltradas);
                mostrarInstrucoesEButton(tagsFiltradas);
            } else {
                console.error('Erro ao buscar tags');
            }
        } catch (error) {
            console.error('Erro ao buscar tags:', error);
        }
    } else {
        exibirTags(tags);
        esconderInstrucoesEButton();
    }
});


let debounceTimeout;

inputPesquisaTag.addEventListener('input', function() {
    const pesquisaTermo = inputPesquisaTag.value.trim().toLowerCase();

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async function() {
        if (pesquisaTermo !== "") {
            try {
                const response = await fetch(`http://localhost:8080/tags?query=${pesquisaTermo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const tagsFiltradas = await response.json();
                    exibirTags(tagsFiltradas);
                    mostrarInstrucoesEButton(tagsFiltradas);
                } else {
                    console.error('Erro ao buscar tags');
                }
            } catch (error) {
                console.error('Erro ao buscar tags:', error);
            }
        } else {
            exibirTags(tags);
            esconderInstrucoesEButton();
        }
    }, 100);
});

function exibirTags(tagsExibir = tags) {
    tagsList.innerHTML = '';

    if (tagsExibir.length > 0) {
        tagsExibir.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tagss');
            tagElement.style.backgroundColor = tag.cor;

            if (isLightColor(tag.cor)) {
                tagElement.classList.add('light');
            } else {
                tagElement.classList.add('dark');
            }

            tagElement.textContent = tag.nome;

            tagElement.addEventListener('click', function() {
                const tagName = tag.nome;
                const tagId = tag.id;

                if (tagsSelecionadas.includes(tagId)) {
                    tagsSelecionadas = tagsSelecionadas.filter(t => t !== tagId);
                    tagElement.classList.remove('selected');
                } else {
                    tagsSelecionadas.push(tagId);
                    tagElement.classList.add('selected');
                }
            });

            tagsList.appendChild(tagElement);
        });

        mostrarInstrucoesEButton();
    } else {
        esconderInstrucoesEButton();
    }
}


function isLightColor(color) {
    if (!color) {
        return true;
    }

    if (color === '#000000') {
        return false;
    }

    const rgb = convertToRgb(color);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
}


function convertToRgb(color) {

    if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
        return hexToRgb(color);
    } else if (/^rgb\(\d+, \d+, \d+\)$/i.test(color)) {
        const rgbValues = color.match(/\d+/g);
        return {
            r: parseInt(rgbValues[0]),
            g: parseInt(rgbValues[1]),
            b: parseInt(rgbValues[2])
        };
    }
    console.error('Formato de cor inválido:', color);
    return { r: 255, g: 255, b: 255 };
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}


window.addEventListener('click', function(event) {
    if (event.target === modalTags) {
        modalTags.style.display = 'none';
        esconderInstrucoesEButton();
    }
});

document.body.appendChild(colorInput);

colorPickerDiv.addEventListener('click', function() {
    colorInput.click();
});

colorInput.addEventListener('input', function() {
    const selectedColor = colorInput.value;
    colorPickerDiv.style.backgroundColor = selectedColor;
});

colorPickerDiv.style.backgroundColor = '#000000';

const btnConfirmarTags = document.getElementById('btnConfirmarTags');
btnConfirmarTags.addEventListener('click', function() {

    atualizarContadorTags();
    modalTags.style.display = 'none';
    esconderInstrucoesEButton();
});

function atualizarTextoBotaoRemover() {
    if (tagsParaRemover.length > 0) {
        btnConfirmarTags.textContent = `Remover ${tagsParaRemover.length} tags`;
        btnConfirmarTags.style.display = 'inline';
    } else {
        btnConfirmarTags.textContent = 'Confirmar Seleção';
    }
}

function atualizarContadorTags() {
    const totalSelecionadas = tagsSelecionadas.length;

    contadorTags.textContent = `${totalSelecionadas}+`;

    if (totalSelecionadas > 0) {
        iconeContadorTags.style.display = 'inline-flex';
    } else {
        iconeContadorTags.style.display = 'none';
    }
}

const iconeContadorTags = document.getElementById('iconeContadorTags');
const modalRemoverTags = document.getElementById('modalRemoverTags');
const tagsRemoverList = document.getElementById('tagsRemoverList');

iconeContadorTags.addEventListener('click', function() {
    tagsRemoverList.innerHTML = ''; 

    tagsSelecionadas.forEach(tagId => {
        const tagObj = tags.find(tag => tag.id === tagId); 

        let tagColor = '#B0B0B0';

        if (tagObj && tagObj.cor) {
            tagColor = tagObj.cor;
        } else {
            console.warn(`Tag sem cor definida: ${tagId}`);
        }

        const tagElement = document.createElement('div');
        tagElement.classList.add('tagRemoveItem');
        tagElement.textContent = tagObj ? tagObj.nome : 'Tag não encontrada'; // Exibir o nome da tag
        tagElement.style.backgroundColor = tagColor;

        if (isLightColor(tagColor)) {
            tagElement.classList.add('light');
        } else {
            tagElement.classList.add('dark');
        }

        const removeIcon = document.createElement('span');
        removeIcon.classList.add('tag_button');
        removeIcon.innerHTML = '&minus;';

        removeIcon.addEventListener('click', function() {
            if (!tagsParaRemover.includes(tagId)) {
                tagsParaRemover.push(tagId);
                tagElement.classList.add('marked-for-removal');
                atualizarBotaoRemover();
            } else {
                tagsParaRemover = tagsParaRemover.filter(tag => tag !== tagId);
                tagElement.classList.remove('marked-for-removal');
                atualizarBotaoRemover();
            }
        });

        tagElement.appendChild(removeIcon);
        tagsRemoverList.appendChild(tagElement);
    });

    if (modalRemoverTags.style.display === 'block') {
        modalRemoverTags.style.display = 'none';
    } else {
        modalRemoverTags.style.display = 'block';
        const rect = iconeContadorTags.getBoundingClientRect();
        modalRemoverTags.style.top = `${rect.bottom + window.scrollY}px`;
        modalRemoverTags.style.left = `${rect.left + window.scrollX}px`;
    }
});

function mostrarInstrucoesEButton() {
    document.getElementById('instrucaoSelecionarTags').style.display = 'block';
    document.getElementById('btnConfirmarTags').style.display = 'block';
}

function esconderInstrucoesEButton() {
    document.getElementById('instrucaoSelecionarTags').style.display = 'none';
    document.getElementById('btnConfirmarTags').style.display = 'none';
}

function atualizarBotaoRemover() {
    const numTagsParaRemover = tagsParaRemover.length;
    const btnRemover = document.getElementById('btnRemoverTags');

    if (numTagsParaRemover > 0) {
        btnRemover.textContent = `Remover ${numTagsParaRemover} tag${numTagsParaRemover > 1 ? 's' : ''}`;
        btnRemover.style.display = 'inline-block';
    } else {
        btnRemover.style.display = 'none';
    }
}


document.getElementById('btnRemoverTags').addEventListener('click', function() {

    tags = tags.filter(tag => !tagsParaRemover.includes(tag.name));
    tagsSelecionadas = tagsSelecionadas.filter(tag => !tagsParaRemover.includes(tag));
    
    tagsParaRemover = [];
    exibirTags();
    atualizarContadorTags();

    modalRemoverTags.style.display = 'none';
    atualizarBotaoRemover();
});

