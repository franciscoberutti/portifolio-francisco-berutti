import React, { useEffect, useRef, useState } from 'react';
import { complete, execute, shortcuts } from './commands.js';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState([]);
  const [cleared, setCleared] = useState(false);
  const history = useRef({ commands: [], index: 0, draft: '', nextId: 0 });
  const output = useRef(null);

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [entries]);

  function run(rawValue) {
    const value = rawValue.trim();
    const response = execute(value);
    if (!response) return;
    const previous = history.current;
    if (previous.commands.at(-1) !== value) previous.commands.push(value);
    previous.index = previous.commands.length;
    previous.draft = '';
    setInput('');
    setCleared(Boolean(response.clear));
    const id = previous.nextId++;
    setEntries((current) => response.clear ? [] : [...current, { ...response, value, id }]);
  }

  function handleKeys(event) {
    if (event.key === 'Tab' && !event.shiftKey) {
      const suggestion = complete(input);
      if (suggestion !== input) {
        event.preventDefault();
        setInput(suggestion);
      }
    }
    const previous = history.current;
    if (!['ArrowUp', 'ArrowDown'].includes(event.key) || !previous.commands.length) return;
    event.preventDefault();
    if (previous.index === previous.commands.length) previous.draft = input;
    const next = previous.index + (event.key === 'ArrowUp' ? -1 : 1);
    previous.index = Math.max(0, Math.min(previous.commands.length, next));
    setInput(previous.commands[previous.index] ?? previous.draft);
  }

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span aria-hidden="true">● ● ●</span>
        <span>portfolio — terminal</span>
        <button type="button" onClick={() => run('clear')}>Limpar</button>
      </div>
      <div className="terminal-body">
        <div className="command-links" aria-label="Atalhos do terminal">
          {shortcuts.map(({ command, label }) => <button key={command} type="button" onClick={() => run(command)}>{label}</button>)}
        </div>
        <div className="terminal-output" ref={output} role="log" aria-label="Saída do terminal">
          {cleared && <p>Terminal limpo.</p>}
          {entries.map(({ id, value, title, lines, actions, links }) => (
            <div className="terminal-entry" key={id}>
              <p className="terminal-prefix">$ {value}</p>
              <p><strong>{title}</strong></p>
              {lines?.map((line) => <p key={line}>{line}</p>)}
              <div className="terminal-actions">
                {actions?.map(({ label, command }) => <button type="button" key={command} onClick={() => run(command)}>{label}</button>)}
                {links?.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
              </div>
            </div>
          ))}
        </div>
        <form className="command-form" onSubmit={(event) => { event.preventDefault(); run(input); }}>
          <label htmlFor="command" className="terminal-prefix"><span className="visually-hidden">Comando do terminal</span><span aria-hidden="true">$</span></label>
          <input id="command" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeys} placeholder="Digite help" autoComplete="off" spellCheck="false" />
          <button type="submit">Executar</button>
        </form>
      </div>
    </div>
  );
}

