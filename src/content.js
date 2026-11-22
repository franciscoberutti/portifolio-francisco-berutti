export const profile = {
  name: 'Francisco Berutti',
  email: 'fberutti@outlook.com',
  linkedin: 'https://www.linkedin.com/in/franciscoberutti/',
  github: 'https://github.com/franciscoberutti',
  whatsapp: '5531984998300',
  introduction: {
    pt: [
      'Sou estudante de Engenharia de Software na PUC Minas, em Belo Horizonte, com previsão de formatura em 2029. Gosto de desenvolver aplicações web, entender o problema antes de escrever código e testar como as pessoas usam o que construo.',
      'Sou membro fundador da Empresa Júnior de Engenharia de Software e ADS da PUC Minas. Busco uma oportunidade de estágio em desenvolvimento web, produto ou QA para contribuir com uma equipe e aprofundar minha experiência com APIs, testes e entregas iterativas.'
    ],
    en: [
      'I am a Software Engineering student at PUC Minas in Belo Horizonte, Brazil, expecting to graduate in 2029. I enjoy building web applications, understanding the problem before writing code, and testing how people use what I build.',
      'I am a founding member of the Software Engineering and Systems Analysis and Development Junior Enterprise at PUC Minas. I am looking for an internship in web development, product, or QA where I can contribute to a team and deepen my experience with APIs, testing, and iterative delivery.'
    ]
  }
};

export const skills = ['JavaScript', 'React', 'HTML e CSS', 'Node.js', 'APIs REST', 'Git', 'QA e testes', 'Scrum e Kanban'];

export const projects = [
  {
    id: 'agroconecta',
    name: 'AgroConecta',
    start: '2026-02',
    period: '2026 · 1º semestre',
    description: 'Plataforma acadêmica que aproxima produtores rurais de técnicos agropecuários. Trabalhei no cadastro e no perfil de produtores, no fórum e nas telas de chat.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'JSON Server'],
    repository: 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-agroconecta',
    media: { src: '/projects/agroconecta.webp', alt: 'Página inicial do AgroConecta com acesso ao cadastro e à busca de técnicos' }
  },
  {
    id: 'econecta',
    name: 'EConecta',
    start: '2026-08',
    period: '2026 · 2º semestre',
    description: 'Aplicação acadêmica de reciclagem e consumo responsável. Minha frente reúne registro de reciclagem, pontuação, ranking e grupos privados.',
    technologies: ['React', 'JavaScript', 'MongoDB', 'RESTHeart', 'Docker'],
    repository: 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti2-8183100-econecta',
    media: {
      src: '/projects/econecta.webp',
      alt: 'Tela EcoDesafios com formulário de reciclagem, grupos privados e ranking',
      caption: 'EConecta em execução com dados de demonstração.'
    }
  }
];

export const experiences = [
  {
    institution: 'Empresa Júnior de Engenharia de Software e ADS · PUC Minas',
    role: 'Membro fundador',
    period: 'Fevereiro de 2026 – atual',
    description: 'Participo do desenvolvimento do site com React, Node.js e Express, da estruturação de QA e testes e da adoção de Scrum e Kanban.'
  },
  {
    institution: 'PUC Minas · Extensão universitária',
    role: 'Palestrante sobre segurança digital e inteligência artificial',
    period: '2026',
    description: 'Preparei e apresentei, em equipe, uma palestra de cerca de 40 minutos para 47 estudantes do 8º ano ao ensino médio.'
  }
];

