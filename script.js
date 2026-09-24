const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/*1. Ano do rodapé sempre atualizado*/

const anoEl = document.getElementById('ano');
if (anoEl) {
    anoEl.textContent = new Date().getFullYear();
}


/*2. Efeito de digitação no subtítulo do hero*/
const alvo = document.getElementById('digitando');

if (alvo && !reduzMovimento) {
    const texto = alvo.textContent.trim();

    // Reserva a altura final para a página não "pular" enquanto digita
    alvo.style.minHeight = alvo.offsetHeight + 'px';
    alvo.setAttribute('aria-label', texto); // leitores de tela leem a frase inteira

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


/*3. Menu mobile (botão hambúrguer criado via JS)*/

const container = document.querySelector('.nav-container');
const nav = document.querySelector('.nav-links');

if (container && nav) {
    nav.id = 'nav-links';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nav-links');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    container.append(toggle);

    function definirMenu(aberto) {
        nav.classList.toggle('aberto', aberto);
        toggle.setAttribute('aria-expanded', String(aberto));
        toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }

    toggle.addEventListener('click', () => {
        definirMenu(!nav.classList.contains('aberto'));
    });

    // Fecha ao clicar em um link ou ao apertar Esc
    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) definirMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') definirMenu(false);
    });
}


/*4. Destaca no menu a seção que está na tela*/

const links = document.querySelectorAll('.nav-links a[href^="#"]');
const secoes = [...links]
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);
const hero = document.querySelector('.hero');

if (links.length && 'IntersectionObserver' in window) {
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;

                const id = entrada.target.id;
                links.forEach((link) => {
                    const ativo = Boolean(id) && link.hash === '#' + id;
                    link.classList.toggle('ativo', ativo);
                    if (ativo) {
                        link.setAttribute('aria-current', 'true');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            });
        },
        
        { rootMargin: '-40% 0px -55% 0px' }
    );

    secoes.forEach((secao) => observador.observe(secao));
    if (hero) observador.observe(hero);
}

/*5. Botão "voltar ao topo"*/

const botaoTopo = document.createElement('button');
botaoTopo.type = 'button';
botaoTopo.className = 'voltar-topo';
botaoTopo.setAttribute('aria-label', 'Voltar ao topo');
botaoTopo.textContent = '↑';
document.body.append(botaoTopo);

window.addEventListener(
    'scroll',
    () => botaoTopo.classList.toggle('visivel', window.scrollY > 600),
    { passive: true }
);

botaoTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduzMovimento ? 'auto' : 'smooth' });
});