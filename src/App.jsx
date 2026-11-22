import React, { useEffect, useState } from 'react';
import { experiences, profile, projects, skills } from './content.js';
import { contacts } from './commands.js';
import ContactForm from './ContactForm.jsx';
import Terminal from './Terminal.jsx';

const sections = [
  { id: 'sobre', label: 'Sobre mim' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'experiencias', label: 'Experiências' },
  { id: 'contato', label: 'Contato' }
];
const sortedProjects = [...projects].sort((first, second) => first.start.localeCompare(second.start));

function Icon({ name }) {
  const symbols = { email: '✉', linkedin: 'in', github: '<>', whatsapp: '☏' };
  return <span className="contact-icon" aria-hidden="true">{symbols[name]}</span>;
}

function App() {
  const [language, setLanguage] = useState('pt');
  const [active, setActive] = useState(() => window.location.hash.slice(1) || 'sobre');

  useEffect(() => {
    const syncHash = () => setActive(window.location.hash.slice(1) || 'sobre');
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="top">
        <div className="container header-content">
          <a className="brand" href="#inicio"><span aria-hidden="true">›_</span> francisco<span className="brand-suffix">.dev</span></a>
          <nav aria-label="Navegação principal">
            {sections.map(({ id, label }) => (
              <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main id="conteudo" className="container">
        <div className="hero" id="inicio">
          <div className="hero-copy">
            <p className="prompt">francisco@portfolio <span>~ $ whoami</span></p>
            <h1>Francisco<br />Berutti<span>.</span></h1>
            <p className="role">Engenharia de Software <span>·</span> PUC Minas</p>
            <p className="intro-line">Desenvolvimento web, qualidade de software e produto.</p>
            <a className="button" href="#projetos">Ver projetos</a>
          </div>
          <Terminal />
        </div>

        <section id="sobre" tabIndex={-1}>
          <div className="section-heading">
            <h2>Sobre mim</h2>
            <div className="language" role="group" aria-label="Idioma da apresentação">
              <button type="button" aria-pressed={language === 'pt'} onClick={() => setLanguage('pt')}>Português</button>
              <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
            </div>
          </div>
          <div className="about" lang={language === 'pt' ? 'pt-BR' : 'en'}>
            {profile.introduction[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ul className="tags" aria-label="Habilidades">{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </section>

        <section id="projetos" tabIndex={-1}>
          <h2>Projetos</h2>
          <ol className="timeline">
            {sortedProjects.map((project) => (
              <li key={project.id} id={project.id}>
                <time dateTime={project.start}>{project.period}</time>
                <article>
                  {project.media && (
                    <figure className="project-media">
                      <img className="project-image" src={project.media.src} alt={project.media.alt} width="1180" height="760" loading="lazy" />
                      {project.media.caption && <figcaption>{project.media.caption}</figcaption>}
                    </figure>
                  )}
                  <div className="project-copy">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <ul className="tags" aria-label={'Tecnologias de ' + project.name}>
                      {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                    {project.repository && <a className="text-link" href={project.repository}>Repositório no GitHub</a>}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section id="experiencias" tabIndex={-1}>
          <h2>Experiências</h2>
          <div className="experience-grid">
            {experiences.map((experience) => (
              <article key={experience.role}>
                <p className="period">{experience.period}</p>
                <h3>{experience.role}</h3>
                <p className="institution">{experience.institution}</p>
                <p>{experience.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contato" tabIndex={-1}>
          <h2>Contato</h2>
          <div className="contact-grid">
            <div className="contact-links">
              <p>Quer conversar sobre um projeto ou uma oportunidade? Envie uma mensagem ou fale comigo pelos links abaixo.</p>
              {contacts.map(({ name, href, label }) => <a href={href} key={name}><Icon name={name} />{label}</a>)}
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="container"><span>Francisco Berutti</span><a href="#inicio">Voltar ao início</a></footer>
    </>
  );
}

export default App;

