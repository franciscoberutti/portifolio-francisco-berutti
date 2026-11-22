import { experiences, profile, projects, skills } from './content.js';

export const shortcuts = [
  { command: 'sobre', label: 'sobre' },
  { command: 'projetos', label: 'projetos' },
  { command: 'experiencia', label: 'experiência' },
  { command: 'skills', label: 'skills' },
  { command: 'contato', label: 'contato' },
  { command: 'help', label: 'help' }
];

export const contacts = [
  { name: 'email', label: profile.email, href: 'mailto:' + profile.email },
  { name: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
  { name: 'whatsapp', label: 'WhatsApp', href: profile.whatsapp && 'https://wa.me/' + profile.whatsapp },
  { name: 'github', label: 'GitHub', href: profile.github }
].filter(({ href }) => href);

const aliases = {
  about: 'sobre',
  projects: 'projetos',
  experience: 'experiencia',
  experiencias: 'experiencia',
  contact: 'contato'
};

const commands = {
  help: { usage: 'help', description: 'Mostra os comandos disponíveis.', run: () => ({
    title: 'Comandos disponíveis',
    lines: Object.values(commands).map(({ usage, description }) => usage + ' · ' + description)
  }) },
  sobre: { usage: 'sobre', description: 'Abre a apresentação e formação.', run: () => ({
    title: 'Sobre mim', lines: profile.introduction.pt, links: [{ label: 'Sobre mim em português e inglês', href: '#sobre' }]
  }) },
  projetos: { usage: 'projetos [nome]', description: 'Lista os projetos ou mostra um projeto específico.', run: (name) => {
    if (!name) return {
      title: 'Projetos',
      actions: projects.map(({ id, name }) => ({ label: name, command: 'projetos ' + id })),
      links: [{ label: 'Abrir a linha do tempo', href: '#projetos' }]
    };
    const project = projects.find(({ id }) => id === name);
    if (!project) return { title: 'Projeto desconhecido', lines: ['Use projetos para ver os nomes disponíveis.'] };
    return {
      title: project.name,
      lines: [project.description, project.technologies.join(' · ')],
      links: [
        { label: 'Ver na linha do tempo', href: '#' + project.id },
        ...(project.repository ? [{ label: 'Repositório no GitHub', href: project.repository }] : [])
      ]
    };
  } },
  experiencia: { usage: 'experiencia', description: 'Mostra as experiências profissionais e acadêmicas.', run: () => ({
    title: 'Experiências',
    lines: experiences.map(({ role, institution, period }) => [role, institution, period].join(' · ')),
    links: [{ label: 'Abrir experiências', href: '#experiencias' }]
  }) },
  skills: { usage: 'skills', description: 'Mostra habilidades, ferramentas e práticas.', run: () => ({
    title: 'Tecnologias e práticas', lines: [skills.join(' · ')]
  }) },
  contato: { usage: 'contato', description: 'Lista os canais de contato.', run: () => ({
    title: 'Contato', links: [...contacts, { label: 'Abrir formulário de contato', href: '#contato' }]
  }) },
  clear: { usage: 'clear', description: 'Limpa a saída do terminal.', run: () => ({ title: 'Terminal limpo.', clear: true }) }
};

function normalize(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function execute(input) {
  const value = normalize(input.trim());
  if (!value) return null;

  const [name, ...args] = value.split(/\s+/);
  const key = Object.hasOwn(aliases, name) ? aliases[name] : name;
  if (!Object.hasOwn(commands, key)) {
    return { title: 'Comando desconhecido', lines: ['Use help para consultar os comandos disponíveis.'] };
  }
  const command = commands[key];
  if (args.length && key !== 'projetos') {
    return { title: 'Confira a sintaxe', lines: ['Uso: ' + command.usage] };
  }
  return command.run(args.join(' '));
}

export function complete(input) {
  const value = normalize(input.trimStart());
  if (!value) return input;

  const candidates = value.startsWith('projetos ')
    ? projects.map(({ id }) => 'projetos ' + id)
    : Object.keys(commands);
  const matches = candidates.filter((candidate) => candidate.startsWith(value));
  return matches.length === 1 ? matches[0] : input;
}

