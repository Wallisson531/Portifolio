const reduzMovimento = window.matchMedia('prefers-reduced-motion: reduce)').matches;

/*Ano no roda pe sempre sera atualizado*/
const anoE1 = document.getElementById('ano');
if (anoE1) {
    anoE1.textContent = new  Date().getFullYear();
}

/*Efeito de digitação no subtitulo*/
const alvo = document.getElementById('Digitando');

if (alvo && !reduzMovimento) {
    const texto = alvo.textContent.trim();

    alvo.style.minHeight = alvo.offsetHeight + 'px';
    alvo.setAttribute('arial-label', texto);

    const conteudo = document.createElement('span');
    conteudo.setAttribute('aria-hidden', 'true');

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');

    alvo.textContent = '';
    alvo.append(conteudo, cursor);

    let i = 0;
    function digitar() {
        conteudo.textContent = texto.slice(0, ++i);
        if (i < texto.length) {
            setTimeout(digitar, 55);
        }
    }
    setTimeout(digitar, 400);
}

/*Menu Mobile*/
const container = document.querySelector('.nav-container');
const nav = document.querySelector('nav-links');

if (container && nav) {
    nav.id = 'nav-links';

    const toggle = document.createElement('button');
    toggle.type = 'button';
}