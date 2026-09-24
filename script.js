const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, props = {}, ...filhos) {
    const no = document.createElement(tag);
    for (const [chave, valor] of Object.entries(props)) {
        if (valor === undefined || valor === null || valor === false) continue;
        if (chave === 'classe') no.className = valor;
        else if (chave === 'texto') no.textContent = valor;
        else no.setAttribute(chave, valor === true ? '' : valor);
    }
    no.append(...filhos.filter(Boolean));
    return no;
}

/*1. SEUS DADOS — é aqui que você edita quando tiver projeto novo*/

const GITHUB_USUARIO = 'Wallisson531';

// Botões do filtro. O "id" precisa bater com as "categorias" dos projetos.
const filtros = [
    { id: 'todos', rotulo: 'Todos' },
    { id: 'python', rotulo: 'Python' },
    { id: 'html-css', rotulo: 'HTML e CSS' },
];

// Para adicionar um projeto novo, copie um bloco { ... } e mude os textos.
// "aprendizados" é opcional: se preencher, aparece na janela de detalhes.
const projetos = [
    {
        titulo: 'Cantinho do Pet',
        imagem: 'imagem/projeto_pet.png',
        alt: 'Página inicial do projeto Cantinho do Pet',
        descricao: 'Landing page informativa para um pet shop, desenvolvida para colocar em prática meus conhecimentos de HTML e CSS: estrutura semântica, layout responsivo e estilização de seções.',
        tecnologias: ['HTML', 'CSS', 'Git'],
        categorias: ['html-css'],
        recursos: ['Estrutura semântica', 'Layout responsivo', 'Estilização de seções'],
        aprendizados: '',
        codigo: 'https://github.com/Wallisson531/cantinho-do-pet',
        demo: 'https://wallisson531.github.io/cantinho-do-pet/',
    },
    {
        titulo: 'Projeto HelpDesk',
        imagem: 'imagem/HelpDesk.png',
        alt: 'Tela do sistema HelpDesk de chamados de suporte',
        descricao: 'Sistema desktop de gerenciamento de chamados de suporte, desenvolvido em Python com interface gráfica (Tkinter) e banco de dados MySQL. Permite abrir chamados, pesquisar chamados já abertos e resolver chamados.',
        tecnologias: ['Python', 'Tkinter', 'MySQL', 'XAMPP', 'SQL'],
        categorias: ['python'],
        recursos: ['Abrir chamados', 'Pesquisar chamados já abertos', 'Resolver chamados'],
        aprendizados: '',
        codigo: 'https://github.com/Wallisson531/Projeto-HelpDesk',
        demo: '',
    },
    {
        titulo: 'Sistema de Cadastro de Funcionário',
        imagem: 'imagem/projeto_chamadopng.png',
        alt: 'Tela do sistema de cadastro de funcionário',
        descricao: 'Sistema desktop de gerenciamento de cadastro de funcionário, desenvolvido em Python com interface gráfica (Tkinter) e banco de dados SQLite3. Permite cadastrar funcionário, atualizar cadastro e excluir o cadastro.',
        tecnologias: ['Python', 'Tkinter', 'Git', 'SQLite3'],
        categorias: ['python'],
        recursos: ['Cadastrar funcionário', 'Atualizar cadastro', 'Excluir cadastro'],
        aprendizados: '',
        codigo: 'https://github.com/Wallisson531/cadastro_funcionario',
        demo: '',
    },
];

/* ------------------------------------------------------------------
   2. Animação ao rolar (só nos cards, para não cansar)
------------------------------------------------------------------ */
const observadorReveal =
    !reduzMovimento && 'IntersectionObserver' in window
        ? new IntersectionObserver(
              (entradas, observador) => {
                  entradas.forEach((entrada) => {
                      if (entrada.isIntersecting) {
                          entrada.target.classList.add('revelado');
                          observador.unobserve(entrada.target);
                      }
                  });
              },
              { threshold: 0.15 }
          )
        : null;

function ativarReveal(itens) {
    if (!observadorReveal) return;
    itens.forEach((item) => {
        item.classList.add('reveal');
        observadorReveal.observe(item);
    });
}

/* ------------------------------------------------------------------
   3. Cards de projetos gerados a partir da lista
------------------------------------------------------------------ */
function criarTags(tecnologias) {
    return el('ul', { classe: 'tags' }, ...tecnologias.map((t) => el('li', { texto: t })));
}

function criarLinks(projeto, incluirDetalhes) {
    const botaoDetalhes = incluirDetalhes
        ? el('button', { type: 'button', texto: 'Detalhes' })
        : null;
    if (botaoDetalhes) botaoDetalhes.addEventListener('click', () => abrirModal(projeto));

    return el(
        'div',
        { classe: 'project-links' },
        botaoDetalhes,
        el('a', { href: projeto.codigo, target: '_blank', rel: 'noopener', texto: 'Ver código' }),
        projeto.demo &&
            el('a', { href: projeto.demo, target: '_blank', rel: 'noopener', texto: 'Acessar projeto' })
    );
}

function criarCard(projeto) {
    return el(
        'article',
        { classe: 'project-card', 'data-categorias': projeto.categorias.join(' ') },
        el('img', { src: projeto.imagem, alt: projeto.alt, classe: 'project-img', loading: 'lazy' }),
        el(
            'div',
            { classe: 'project-content' },
            el('h3', { texto: projeto.titulo }),
            el('p', { texto: projeto.descricao }),
            criarTags(projeto.tecnologias),
            criarLinks(projeto, true)
        )
    );
}

const gridProjetos = document.getElementById('projetos-grid');
const cardsProjetos = projetos.map(criarCard);

if (gridProjetos) {
    gridProjetos.append(...cardsProjetos);
    ativarReveal(cardsProjetos);
}

/* ------------------------------------------------------------------
   4. Filtro de projetos por tecnologia
------------------------------------------------------------------ */
const areaFiltros = document.getElementById('filtros');

if (areaFiltros && gridProjetos) {
    filtros.forEach((filtro) => {
        areaFiltros.append(
            el('button', {
                type: 'button',
                classe: 'filtro',
                'data-filtro': filtro.id,
                'aria-pressed': filtro.id === 'todos' ? 'true' : 'false',
                texto: filtro.rotulo,
            })
        );
    });

    areaFiltros.addEventListener('click', (e) => {
        const botao = e.target.closest('button[data-filtro]');
        if (!botao) return;

        const escolhido = botao.dataset.filtro;

        areaFiltros.querySelectorAll('button').forEach((b) => {
            b.setAttribute('aria-pressed', String(b === botao));
        });

        cardsProjetos.forEach((card) => {
            const categorias = card.dataset.categorias.split(' ');
            card.hidden = !(escolhido === 'todos' || categorias.includes(escolhido));
        });
    });
}

/* ------------------------------------------------------------------
   5. Modal de detalhes do projeto (usa a tag <dialog> do HTML)
------------------------------------------------------------------ */
const modal = document.getElementById('modal-projeto');

function abrirModal(projeto) {
    if (!modal) return;

    const botaoFechar = el('button', {
        type: 'button',
        classe: 'modal-fechar',
        'aria-label': 'Fechar janela',
    }, '×');
    botaoFechar.addEventListener('click', () => modal.close());

    const recursos = projeto.recursos || [];

    const corpo = el(
        'div',
        { classe: 'modal-corpo' },
        botaoFechar,
        el('img', { src: projeto.imagem, alt: projeto.alt, classe: 'modal-img' }),
        el(
            'div',
            { classe: 'modal-texto' },
            el('h3', { id: 'modal-titulo', texto: projeto.titulo }),
            el('p', { texto: projeto.descricao }),
            recursos.length > 0 && el('h4', { texto: 'Destaques' }),
            recursos.length > 0 &&
                el('ul', { classe: 'lista-destaques' }, ...recursos.map((r) => el('li', { texto: r }))),
            projeto.aprendizados && el('h4', { texto: 'O que aprendi' }),
            projeto.aprendizados && el('p', { texto: projeto.aprendizados }),
            criarTags(projeto.tecnologias),
            criarLinks(projeto, false)
        )
    );

    modal.replaceChildren(corpo);
    modal.showModal();
    document.body.classList.add('sem-rolagem');
}

if (modal) {
    // Clicar fora da janela (no fundo escuro) também fecha
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
    // O Esc já fecha sozinho; aqui só destravamos a rolagem da página
    modal.addEventListener('close', () => document.body.classList.remove('sem-rolagem'));
}

/* ------------------------------------------------------------------
   6. Repositórios do GitHub (API pública, sem login)
------------------------------------------------------------------ */
function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

async function buscarRepositorios() {
    const CHAVE = 'repos-github';
    const DEZ_MINUTOS = 10 * 60 * 1000;

    // A API do GitHub limita ~60 pedidos por hora sem login,
    // então guardamos a resposta por 10 minutos.
    try {
        const salvo = JSON.parse(sessionStorage.getItem(CHAVE));
        if (salvo && Date.now() - salvo.hora < DEZ_MINUTOS) return salvo.dados;
    } catch (e) {}

    const resposta = await fetch(
        `https://api.github.com/users/${GITHUB_USUARIO}/repos?sort=updated&per_page=30`
    );
    if (!resposta.ok) throw new Error('GitHub respondeu ' + resposta.status);
    const dados = await resposta.json();

    try {
        sessionStorage.setItem(CHAVE, JSON.stringify({ hora: Date.now(), dados }));
    } catch (e) {}

    return dados;
}

function criarCardRepo(repo) {
    return el(
        'article',
        { classe: 'repo-card' },
        el(
            'h3',
            {},
            el('a', { href: repo.html_url, target: '_blank', rel: 'noopener', texto: repo.name })
        ),
        el('p', { texto: repo.description || 'Sem descrição.' }),
        el(
            'ul',
            { classe: 'repo-meta' },
            repo.language && el('li', { texto: repo.language }),
            repo.stargazers_count > 0 && el('li', { texto: '★ ' + repo.stargazers_count }),
            el('li', { texto: 'Atualizado em ' + formatarData(repo.pushed_at) })
        )
    );
}

async function carregarRepositorios() {
    const area = document.getElementById('repos-grid');
    if (!area) return;

    try {
        const repos = (await buscarRepositorios()).filter((r) => !r.fork).slice(0, 6);

        if (repos.length === 0) {
            area.replaceChildren(el('p', { classe: 'estado', texto: 'Nenhum repositório público encontrado.' }));
            return;
        }

        const cards = repos.map(criarCardRepo);
        area.replaceChildren(...cards);
        ativarReveal(cards);
    } catch (erro) {
        console.error('Erro ao carregar repositórios:', erro);
        area.replaceChildren(
            el('p', {
                classe: 'estado',
                texto: 'Não consegui carregar os repositórios agora. Você pode vê-los direto no meu perfil do GitHub.',
            })
        );
    }
}

carregarRepositorios();

/* ------------------------------------------------------------------
   7. Botão "copiar e-mail"
   (o e-mail fica no atributo data-email da <section id="contato">)
------------------------------------------------------------------ */
const secaoContato = document.getElementById('contato');
const EMAIL = (secaoContato && secaoContato.dataset.email) || '';

const botaoCopiar = document.getElementById('copiar-email');

if (botaoCopiar) {
    const textoOriginal = botaoCopiar.textContent;

    botaoCopiar.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            botaoCopiar.textContent = 'E-mail copiado!';
        } catch (erro) {
            // Se o navegador bloquear a cópia, mostramos o endereço para copiar na mão
            botaoCopiar.textContent = EMAIL;
        }
        setTimeout(() => {
            botaoCopiar.textContent = textoOriginal;
        }, 2500);
    });
}

/* ------------------------------------------------------------------
   8. Formulário de contato com validação
------------------------------------------------------------------ */
const form = document.getElementById('form-contato');

if (form) {
    const status = document.getElementById('form-status');

    // Cada regra devolve '' (tudo certo) ou a mensagem de erro
    const regras = {
        nome: (v) => (v.length >= 2 ? '' : 'Digite seu nome (mínimo de 2 letras).'),
        email: (v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.',
        mensagem: (v) => (v.length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.'),
    };

    function mostrarStatus(texto, tipo) {
        status.textContent = texto;
        status.className = 'form-status ' + (tipo || '');
    }

    function validarCampo(nome) {
        const campo = form.elements[nome];
        const erro = regras[nome](campo.value.trim());
        document.getElementById('erro-' + nome).textContent = erro;
        campo.setAttribute('aria-invalid', String(Boolean(erro)));
        return !erro;
    }

    Object.keys(regras).forEach((nome) => {
        const campo = form.elements[nome];
        campo.addEventListener('blur', () => validarCampo(nome));
        // Depois de um erro, revalida enquanto a pessoa digita
        campo.addEventListener('input', () => {
            if (campo.getAttribute('aria-invalid') === 'true') validarCampo(nome);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const resultados = Object.keys(regras).map(validarCampo); // valida todos de uma vez
        if (resultados.includes(false)) {
            form.querySelector('[aria-invalid="true"]').focus();
            mostrarStatus('Corrija os campos destacados.', 'erro');
            return;
        }

        const dados = new FormData(form);
        if (dados.get('_gotcha')) return; // robô: ignora em silêncio

        const endereco = form.getAttribute('action');
        const formspreeConfigurado = !endereco.includes('SEU_ID');

        // Sem Formspree configurado: abre o programa de e-mail já preenchido
        if (!formspreeConfigurado) {
            const assunto = encodeURIComponent('Contato pelo portfólio - ' + dados.get('nome'));
            const corpo = encodeURIComponent(
                dados.get('mensagem') + '\n\nDe: ' + dados.get('nome') + ' (' + dados.get('email') + ')'
            );
            window.location.href = 'mailto:' + EMAIL + '?subject=' + assunto + '&body=' + corpo;
            mostrarStatus('Abrindo seu programa de e-mail...', 'ok');
            return;
        }

        const botaoEnviar = form.querySelector('[type="submit"]');
        botaoEnviar.disabled = true;
        mostrarStatus('Enviando...', '');

        try {
            const resposta = await fetch(endereco, {
                method: 'POST',
                body: dados,
                headers: { Accept: 'application/json' },
            });
            if (!resposta.ok) throw new Error('Formspree respondeu ' + resposta.status);
            form.reset();
            mostrarStatus('Mensagem enviada! Responderei assim que possível.', 'ok');
        } catch (erro) {
            console.error(erro);
            mostrarStatus('Não foi possível enviar agora. Tente pelo WhatsApp ou copie meu e-mail.', 'erro');
        } finally {
            botaoEnviar.disabled = false;
        }
    });
}

/* ------------------------------------------------------------------
   9. Tema claro/escuro (a escolha fica salva no navegador)
------------------------------------------------------------------ */
const botaoTema = document.getElementById('tema-toggle');

function definirTema(tema) {
    document.documentElement.dataset.theme = tema;
    if (botaoTema) {
        botaoTema.setAttribute(
            'aria-label',
            tema === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'
        );
    }
}

function lerTemaSalvo() {
    try {
        return localStorage.getItem('tema');
    } catch (e) {
        return null;
    }
}

definirTema(lerTemaSalvo() === 'light' ? 'light' : 'dark');

if (botaoTema) {
    botaoTema.addEventListener('click', () => {
        const novo = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        definirTema(novo);
        try {
            localStorage.setItem('tema', novo);
        } catch (e) {}
    });
}

/* ------------------------------------------------------------------
   10. Ano do rodapé + efeito de digitação
------------------------------------------------------------------ */
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

const alvoDigitacao = document.getElementById('digitando');

if (alvoDigitacao && !reduzMovimento) {
    const texto = alvoDigitacao.textContent.trim();

    // Reserva a altura final para a página não "pular" enquanto digita
    alvoDigitacao.style.minHeight = alvoDigitacao.offsetHeight + 'px';
    alvoDigitacao.setAttribute('aria-label', texto); // leitores de tela leem a frase inteira

    const conteudo = el('span', { 'aria-hidden': 'true' });
    const cursor = el('span', { classe: 'cursor', 'aria-hidden': 'true' });

    alvoDigitacao.textContent = '';
    alvoDigitacao.append(conteudo, cursor);

    let i = 0;
    function digitar() {
        conteudo.textContent = texto.slice(0, ++i);
        if (i < texto.length) setTimeout(digitar, 55);
    }
    setTimeout(digitar, 400);
}

/* ------------------------------------------------------------------
   11. Menu mobile
------------------------------------------------------------------ */
const botaoMenu = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-links');

if (botaoMenu && nav) {
    const definirMenu = (aberto) => {
        nav.classList.toggle('aberto', aberto);
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    };

    botaoMenu.addEventListener('click', () => definirMenu(!nav.classList.contains('aberto')));

    // Fecha ao clicar em um link ou ao apertar Esc
    nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) definirMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') definirMenu(false);
    });
}

/* ------------------------------------------------------------------
   12. Destaca no menu a seção que está na tela
------------------------------------------------------------------ */
const linksMenu = document.querySelectorAll('.nav-links a[href^="#"]');
const secoes = [...linksMenu].map((link) => document.querySelector(link.hash)).filter(Boolean);
const hero = document.querySelector('.hero');

if (linksMenu.length && 'IntersectionObserver' in window) {
    const observadorMenu = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;

                const id = entrada.target.id; // o hero não tem id, então limpa todos
                linksMenu.forEach((link) => {
                    const ativo = Boolean(id) && link.hash === '#' + id;
                    link.classList.toggle('ativo', ativo);
                    if (ativo) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        },
        // Só considera a faixa do meio da tela
        { rootMargin: '-40% 0px -55% 0px' }
    );

    secoes.forEach((secao) => observadorMenu.observe(secao));
    if (hero) observadorMenu.observe(hero);
}

/* ------------------------------------------------------------------
   13. Barra de progresso + botão "voltar ao topo"
------------------------------------------------------------------ */
const botaoTopo = el('button', {
    type: 'button',
    classe: 'voltar-topo',
    'aria-label': 'Voltar ao topo',
    texto: '↑',
});
document.body.append(botaoTopo);

botaoTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduzMovimento ? 'auto' : 'smooth' });
});

const barraProgresso = document.getElementById('progresso-barra');
let atualizando = false;

function atualizarRolagem() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = total > 0 ? window.scrollY / total : 0;

    if (barraProgresso) barraProgresso.style.transform = 'scaleX(' + Math.min(1, progresso) + ')';
    botaoTopo.classList.toggle('visivel', window.scrollY > 600);
    atualizando = false;
}

// requestAnimationFrame evita recalcular a cada pixel rolado
window.addEventListener(
    'scroll',
    () => {
        if (!atualizando) {
            atualizando = true;
            requestAnimationFrame(atualizarRolagem);
        }
    },
    { passive: true }
);
atualizarRolagem();