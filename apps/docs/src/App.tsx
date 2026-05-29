import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Terminal as CliIcon, 
  Database, 
  Cpu, 
  Box, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Code, 
  Play, 
  RotateCcw, 
  Info,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import './App.css';

// Type Definitions
interface DocSection {
  id: string;
  title: string;
}

interface DocPage {
  id: string;
  title: string;
  category: string;
  icon: any;
  sections: DocSection[];
}

function App() {
  // Navigation & Page State (Synchronized with URL Hash)
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Interactive Sandbox Simulator State
  const [selectedLang, setSelectedLang] = useState<'ts' | 'js'>('ts');
  const [selectedDb, setSelectedDb] = useState<'none' | 'mongoose' | 'prisma' | 'drizzle'>('prisma');
  const [addons, setAddons] = useState({
    swagger: true,
    logger: true,
    docker: false,
    socket: false,
  });
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: string }>>([
    { text: '# Exon CLI Interactive Simulator', type: 'muted' },
    { text: '# Configure your stack on the left and click "Run Sandbox Simulator"', type: 'muted' },
    { text: 'exon-cli --help', type: 'command' },
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simulationTimeoutRef = useRef<any | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Syncing hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/docs/', '');
      if (hash && hash !== '') {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // Terminal Auto Scroll
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Navigation Structure
  const docPages: DocPage[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      category: 'Getting Started',
      icon: BookOpen,
      sections: [
        { id: 'why-exon', title: 'Why Exon CLI?' },
        { id: 'key-features', title: 'Key Features' },
        { id: 'core-stack', title: 'Supported Tech Stack' },
      ],
    },
    {
      id: 'getting-started',
      title: 'Quick Start',
      category: 'Getting Started',
      icon: Play,
      sections: [
        { id: 'installation', title: 'Installation' },
        { id: 'initializing-project', title: 'Scaffolding a Project' },
        { id: 'next-steps', title: 'Next Steps' },
      ],
    },
    {
      id: 'cli-commands',
      title: 'CLI Commands',
      category: 'CLI Reference',
      icon: CliIcon,
      sections: [
        { id: 'command-create', title: 'create <name>' },
        { id: 'command-add', title: 'add <plugin>' },
        { id: 'command-remove', title: 'remove <plugin>' },
      ],
    },
    {
      id: 'plugin-architecture',
      title: 'Plugin System',
      category: 'Architecture',
      icon: Layers,
      sections: [
        { id: 'how-plugins-work', title: 'How Plugins Work' },
        { id: 'injection-mechanism', title: 'Ast Code Injection' },
        { id: 'plugin-lifecycle', title: 'Plugin Lifecycle' },
      ],
    },
    {
      id: 'plugins-reference',
      title: 'Plugins Reference',
      category: 'Plugins & Add-ons',
      icon: Cpu,
      sections: [
        { id: 'plugin-swagger', title: 'Swagger API Docs' },
        { id: 'plugin-logger', title: 'Morgan & Winston' },
        { id: 'plugin-realtime', title: 'Socket.io Support' },
      ],
    },
    {
      id: 'database-orms',
      title: 'Database & ORMs',
      category: 'Plugins & Add-ons',
      icon: Database,
      sections: [
        { id: 'orm-prisma', title: 'Prisma ORM' },
        { id: 'orm-mongoose', title: 'Mongoose ODM' },
        { id: 'orm-drizzle', title: 'Drizzle ORM' },
      ],
    },
    {
      id: 'docker-deployment',
      title: 'Docker Support',
      category: 'Deployment',
      icon: Box,
      sections: [
        { id: 'dockerization', title: 'Docker Orchestration' },
        { id: 'environment-configs', title: 'Container Configs' },
      ],
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      category: 'Guides',
      icon: Settings,
      sections: [
        { id: 'directory-structure', title: 'Directory Structure' },
        { id: 'environment-variables', title: 'Environment Configs' },
        { id: 'routing-standards', title: 'Routing Standards' },
      ],
    },
  ];

  // Sidebar Filtering (Search)
  const filteredPages = searchQuery.trim() === ''
    ? docPages
    : docPages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.sections.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Group pages by Category
  const categories = Array.from(new Set(docPages.map(page => page.category)));

  // Copy Clipboard Helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Navigate Helper
  const navigateTo = (pageId: string) => {
    setCurrentPage(pageId);
    window.location.hash = `#/docs/${pageId}`;
    setIsMobileMenuOpen(false);
  };

  // Compile Interactive Command
  const getCompiledCommand = () => {
    let cmd = `npx exon-cli create my-express-api`;
    if (selectedLang === 'ts') cmd += ' --ts';
    if (selectedLang === 'js') cmd += ' --js';
    
    if (selectedDb === 'mongoose') cmd += ' --mongoose';
    if (selectedDb === 'prisma') cmd += ' --prisma';
    if (selectedDb === 'drizzle') cmd += ' --drizzle';
    
    if (addons.swagger) cmd += ' --swagger';
    if (addons.logger) cmd += ' --logger';
    if (addons.socket) cmd += ' --socket'; // Custom Socket IO plugin
    if (addons.docker) cmd += ' --docker';
    
    return cmd;
  };

  // Run Sandbox Simulator Logic
  const runSandboxSimulator = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    const logs: Array<{ text: string; type: string }> = [];
    logs.push({ text: `\n$ ${getCompiledCommand()}`, type: 'command' });
    logs.push({ text: '  Initializing Express.js project setup...', type: 'info' });
    setTerminalLogs([...logs]);

    let step = 0;
    const runStep = () => {
      switch(step) {
        case 0:
          logs.push({ text: `EXON → Initializing project: my-express-api....`, type: 'info' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 400);
          break;
        case 1:
          logs.push({ text: `✔ Selected language › ${selectedLang === 'ts' ? 'TypeScript' : 'JavaScript'}`, type: 'green' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 400);
          break;
        case 2:
          logs.push({ text: `✔ Selected database ORM › ${selectedDb === 'none' ? 'None' : selectedDb.toUpperCase()}`, type: 'green' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 500);
          break;
        case 3:
          logs.push({ text: `⚙ Scaffolding node-express-template-${selectedLang} structure...`, type: 'muted' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 600);
          break;
        case 4:
          logs.push({ text: `⚙ Connecting lifecycle contexts...`, type: 'muted' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 300);
          break;
        case 5:
          // Apply database plugin
          if (selectedDb !== 'none') {
            logs.push({ text: `⚡ Installing plugin: ${selectedDb}...`, type: 'info' });
            logs.push({ text: `  → Injected: import { connectDB } from './db' into index.${selectedLang}`, type: 'muted' });
            logs.push({ text: `✔ Plugin "${selectedDb}" applied successfully`, type: 'green' });
          }
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 500);
          break;
        case 6:
          // Apply swagger
          if (addons.swagger) {
            logs.push({ text: `⚡ Installing plugin: swagger...`, type: 'info' });
            logs.push({ text: `  → Injected: Swagger UI routes registered on "/docs" endpoint.`, type: 'muted' });
            logs.push({ text: `✔ Plugin "swagger" added successfully`, type: 'green' });
          }
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 400);
          break;
        case 7:
          // Apply logger
          if (addons.logger) {
            logs.push({ text: `⚡ Installing plugin: logger...`, type: 'info' });
            logs.push({ text: `  → Added: Winston daily rotate transport & Morgan Middleware.`, type: 'muted' });
            logs.push({ text: `✔ Plugin "logger" added successfully`, type: 'green' });
          }
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 400);
          break;
        case 8:
          // Apply socket
          if (addons.socket) {
            logs.push({ text: `⚡ Installing plugin: socket...`, type: 'info' });
            logs.push({ text: `  → Added Socket.io realtime serverside listeners.`, type: 'muted' });
            logs.push({ text: `✔ Plugin "socket" added successfully`, type: 'green' });
          }
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 400);
          break;
        case 9:
          // Apply docker
          if (addons.docker) {
            logs.push({ text: `⚡ Installing plugin: docker...`, type: 'info' });
            logs.push({ text: `  → Generated Dockerfile & docker-compose.yml config.`, type: 'muted' });
            logs.push({ text: `✔ Plugin "docker" added successfully`, type: 'green' });
          }
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 500);
          break;
        case 10:
          logs.push({ text: `⚙ Saving project configuration: .exonrc.json`, type: 'muted' });
          logs.push({ text: `⚙ Running "pnpm install" to fetch packages...`, type: 'muted' });
          setTerminalLogs([...logs]);
          simulationTimeoutRef.current = setTimeout(runStep, 1000);
          break;
        case 11:
          logs.push({ text: `\n🚀 Project my-express-api generated successfully!`, type: 'green' });
          logs.push({ text: `⚡ Exon CLI saved you approximately 30 minutes of boilerplate config.`, type: 'green' });
          logs.push({ text: `\nNext steps:`, type: 'info' });
          logs.push({ text: `  $ cd my-express-api`, type: 'command' });
          logs.push({ text: `  $ pnpm install`, type: 'command' });
          logs.push({ text: `  $ pnpm run dev`, type: 'command' });
          setTerminalLogs([...logs]);
          setIsSimulating(false);
          break;
        default:
          break;
      }
      step++;
    };
    runStep();
  };

  const resetSandboxSimulator = () => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    setIsSimulating(false);
    setTerminalLogs([
      { text: '# Exon CLI Interactive Simulator', type: 'muted' },
      { text: '# Configure your stack on the left and click "Run Sandbox Simulator"', type: 'muted' },
      { text: 'exon-cli --help', type: 'command' },
    ]);
  };

  return (
    <div className="app-container">
      {/* Decorative Blur Blobs */}
      <div className="glow-blob glow-cyan"></div>
      <div className="glow-blob glow-purple"></div>

      {/* Global Success Banner for Copied Items */}
      {copiedText && (
        <div className="success-notification">
          <Check size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          <span>Copied to Clipboard!</span>
        </div>
      )}

      {/* Header */}
      <header className="site-header">
        <div className="logo-group" onClick={() => navigateTo('home')}>
          <div className="logo-icon">E</div>
          <div className="logo-text">EXON<span>.CLI</span></div>
          <span className="version-badge">v1.2.5</span>
        </div>

        {/* Global Search Bar */}
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search docs (e.g. Prisma)..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="header-controls">
          <a 
            href="https://github.com/arpitbhatia23/exon-cli" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="icon-btn"
            title="Star Exon CLI on Github"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>

          <button 
            className="icon-btn" 
            onClick={() => setIsLightMode(!isLightMode)}
            title={isLightMode ? 'Toggle Dark Mode' : 'Toggle Light Mode'}
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Mobile Menu Icon */}
          <button 
            className="icon-btn menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Layout Framework */}
      <div className="layout-wrapper">
        
        {/* Left Sidebar (Topics Nav) */}
        <aside className={`docs-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-nav">
            
            {/* Quick Home Link */}
            <div>
              <button 
                className={`nav-item-btn ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => navigateTo('home')}
              >
                <Terminal size={18} />
                <span>Sandbox Home</span>
              </button>
            </div>

            {categories.map((category) => {
              // Get pages belonging to this category
              const pagesInCategory = filteredPages.filter(p => p.category === category);
              if (pagesInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <div className="nav-section-title">{category}</div>
                  <ul className="nav-list">
                    {pagesInCategory.map((page) => {
                      const Icon = page.icon;
                      return (
                        <li key={page.id}>
                          <button 
                            className={`nav-item-btn ${currentPage === page.id ? 'active' : ''}`}
                            onClick={() => navigateTo(page.id)}
                          >
                            <Icon size={18} />
                            <span>{page.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Container */}
        <main className="docs-content-container">
          <div className="docs-content-wrapper">
            
            {currentPage === 'home' && (
              <div>
                {/* Hero Landing */}
                <section className="hero-container">
                  <div className="hero-badge">
                    <Award size={14} />
                    <span>⚡ The Next-Gen Express Generator</span>
                  </div>
                  <h1>Exon CLI</h1>
                  <p className="hero-subtitle">
                    Generate highly structure-driven, scalable, and production-ready Express.js APIs with your choice of Databases, ORMs, Logging architectures, Real-time services, and deployment engines in literally seconds.
                  </p>

                  <div className="hero-cta">
                    <button className="btn btn-primary" onClick={() => navigateTo('getting-started')}>
                      Get Started
                      <ArrowRight size={18} />
                    </button>
                    
                    <div className="cli-pill-container">
                      <span className="cli-command-txt">npx <span>exon-cli</span> create my-api</span>
                      <button 
                        className="copy-pill-btn" 
                        onClick={() => copyToClipboard('npx exon-cli create my-api')}
                        title="Copy install command"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Core Feature Matrix */}
                <h2 style={{ borderBottom: 'none', textAlign: 'center', marginBottom: '2.5rem' }}>Speed & Structure combined</h2>
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <Cpu size={22} />
                    </div>
                    <h3>Plug-and-Play Plugins</h3>
                    <p>Dynamically add or remove features like Swagger documentation, winston daily logger files, Docker containerization, or Socket.io. No manual configurations.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <Layers size={22} />
                    </div>
                    <h3>Production Architecture</h3>
                    <p>Clean separations of controllers, middlewares, routes, db clients, and validators. Scaffolds are designed for strict typing and modularity.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <Database size={22} />
                    </div>
                    <h3>ORM Freedom</h3>
                    <p>Built-in prompts to spin up Mongoose schemas, type-safe Prisma structures, or SQL migrations via Drizzle ORM right out of the box.</p>
                  </div>
                </div>

                {/* Interactive CLI Sandbox Simulator */}
                <section className="sandbox-section">
                  <h2>Interactive CLI Sandbox</h2>
                  <p className="sandbox-header-desc">
                    Configure your backend tech stack on the left, watch the compiled CLI flags update live, and click <strong>"Run Sandbox Simulator"</strong> to see Exon's prompt engine construct a production stack.
                  </p>

                  <div className="sandbox-container">
                    <div className="sandbox-controls">
                      
                      {/* Language Selection */}
                      <div>
                        <div className="control-group-title">1. Base Language</div>
                        <div className="option-selector-grid">
                          <div 
                            className={`selector-card ${selectedLang === 'ts' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedLang('ts')}
                          >
                            TypeScript
                          </div>
                          <div 
                            className={`selector-card ${selectedLang === 'js' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedLang('js')}
                          >
                            JavaScript
                          </div>
                        </div>
                      </div>

                      {/* DB Selection */}
                      <div>
                        <div className="control-group-title">2. Database & ORMs</div>
                        <div className="option-selector-grid">
                          <div 
                            className={`selector-card ${selectedDb === 'none' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedDb('none')}
                          >
                            None
                          </div>
                          <div 
                            className={`selector-card ${selectedDb === 'prisma' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedDb('prisma')}
                          >
                            Prisma (SQL)
                          </div>
                          <div 
                            className={`selector-card ${selectedDb === 'mongoose' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedDb('mongoose')}
                          >
                            Mongoose (NoSQL)
                          </div>
                          <div 
                            className={`selector-card ${selectedDb === 'drizzle' ? 'active' : ''}`}
                            onClick={() => !isSimulating && setSelectedDb('drizzle')}
                          >
                            Drizzle (SQL)
                          </div>
                        </div>
                      </div>

                      {/* Add-ons List */}
                      <div>
                        <div className="control-group-title">3. Modular Plugins</div>
                        <div className="addon-checkbox-list">
                          <div 
                            className={`checkbox-card ${addons.swagger ? 'active' : ''}`}
                            onClick={() => !isSimulating && setAddons({ ...addons, swagger: !addons.swagger })}
                          >
                            <Code size={14} />
                            Swagger Docs
                          </div>
                          <div 
                            className={`checkbox-card ${addons.logger ? 'active' : ''}`}
                            onClick={() => !isSimulating && setAddons({ ...addons, logger: !addons.logger })}
                          >
                            <Settings size={14} />
                            Winston Log
                          </div>
                          <div 
                            className={`checkbox-card ${addons.socket ? 'active' : ''}`}
                            onClick={() => !isSimulating && setAddons({ ...addons, socket: !addons.socket })}
                          >
                            <Cpu size={14} />
                            Socket.io
                          </div>
                          <div 
                            className={`checkbox-card ${addons.docker ? 'active' : ''}`}
                            onClick={() => !isSimulating && setAddons({ ...addons, docker: !addons.docker })}
                          >
                            <Box size={14} />
                            Docker Support
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Window Mockup */}
                    <div className="sandbox-terminal-wrapper">
                      <div className="terminal-header">
                        <div className="terminal-dots">
                          <span className="terminal-dot dot-red"></span>
                          <span className="terminal-dot dot-yellow"></span>
                          <span className="terminal-dot dot-green"></span>
                        </div>
                        <div className="terminal-title">Interactive Terminal Simulator</div>
                        <div style={{ width: '38px' }}></div>
                      </div>

                      <div className="terminal-body">
                        {terminalLogs.map((log, idx) => {
                          if (log.type === 'command') {
                            return (
                              <div key={idx} className="terminal-line">
                                <span className="terminal-input-prompt">exon-cli ~ </span>
                                <span>{log.text}</span>
                              </div>
                            );
                          }
                          if (log.type === 'green') {
                            return (
                              <div key={idx} className="terminal-line term-green">
                                {log.text}
                              </div>
                            );
                          }
                          if (log.type === 'info') {
                            return (
                              <div key={idx} className="terminal-line term-cyan">
                                {log.text}
                              </div>
                            );
                          }
                          if (log.type === 'muted') {
                            return (
                              <div key={idx} className="terminal-line term-muted">
                                {log.text}
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="terminal-line">
                              {log.text}
                            </div>
                          );
                        })}
                        <div ref={terminalEndRef}></div>
                      </div>

                      {/* Run Console Controllers */}
                      <div className="terminal-header" style={{ borderTop: '1px solid var(--border-color)', height: '52px', padding: '0.75rem' }}>
                        <div className="cli-command-txt" style={{ fontSize: '0.8rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Command: <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{getCompiledCommand().substring(12)}</span>
                        </div>
                        <div className="terminal-btn-row">
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={resetSandboxSimulator}
                            disabled={isSimulating}
                          >
                            <RotateCcw size={12} />
                            Reset
                          </button>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', boxShadow: 'none' }}
                            onClick={runSandboxSimulator}
                            disabled={isSimulating}
                          >
                            <Play size={12} />
                            Run Simulator
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* PAGE: INTRODUCTION */}
            {currentPage === 'introduction' && (
              <article>
                <h1>Welcome to Exon CLI ⚡</h1>
                <p>
                  <strong>Exon CLI</strong> is an open-source, interactive scaffolding toolkit designed to let you generate highly production-ready, standardized Express.js APIs in a matter of seconds. Instead of wasting 30 to 60 minutes setting up TypeScript config files, Winston logger systems, database connection pipelines, Swagger specs, and docker configurations, Exon CLI packages everything into an interactive installer command.
                </p>

                <div className="callout callout-info" id="why-exon">
                  <Info className="callout-icon" />
                  <div>
                    <h4>Why developers use Exon</h4>
                    <p>Traditional Express boilerplate code either contains too many dependencies that you do not need, or forces you to spend hours wiring database ORMs and testing suites manually. Exon provides a completely modular approach: choose exactly what you need, and let the code injector system insert imports and middlewares dynamically.</p>
                  </div>
                </div>

                <h2 id="key-features">Key Architectural Pillars</h2>
                <ul>
                  <li><strong>Plug & Play Infrastructure:</strong> Safely install ORMs, Swagger, Logging, and Real-time sockets interactively on first launch, or install/uninstall them dynamically later.</li>
                  <li><strong>AST Code Injection:</strong> Plugins do not just copy-paste static files. Exon parses files like <code>src/app.ts</code> and dynamically injects precise imports and statements.</li>
                  <li><strong>High Scalability Boilerplate:</strong> Structures follow top-tier patterns incorporating controllers, middleware validations, and service layers.</li>
                </ul>

                <h2 id="core-stack">Fully Supported Technologies</h2>
                <div className="plugins-grid">
                  <div className="plugin-item-card">
                    <div className="plugin-card-header">
                      <h4 className="plugin-card-title">Base Infrastructure</h4>
                      <span className="plugin-card-type-badge">core</span>
                    </div>
                    <p>Supports fully compiled ES modules in either Node.js JavaScript or strict static typing in TypeScript.</p>
                  </div>
                  
                  <div className="plugin-item-card">
                    <div className="plugin-card-header">
                      <h4 className="plugin-card-title">Database ORMs</h4>
                      <span className="plugin-card-type-badge database">database</span>
                    </div>
                    <p>Integrate Prisma Schema, Drizzle migrations, or classic Mongoose Models interactively.</p>
                  </div>

                  <div className="plugin-item-card">
                    <div className="plugin-card-header">
                      <h4 className="plugin-card-title">Features & Protocols</h4>
                      <span className="plugin-card-type-badge realtime">realtime</span>
                    </div>
                    <p>Enable socket.io WebSockets, Winston Logging structures, Docker networks, and standard Swagger specifications.</p>
                  </div>
                </div>
              </article>
            )}

            {/* PAGE: GETTING STARTED */}
            {currentPage === 'getting-started' && (
              <article>
                <h1>Quick Start Guide 🚀</h1>
                <p>Get your API running in less than a minute. Ensure you have <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js (v18+)</a> and your preferred package manager (npm, yarn, or pnpm) installed.</p>

                <h2 id="installation">1. Install and Scaffold</h2>
                <p>You can execute the generator directly using <code>npx</code> or install it globally to your machine.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Option A: Run directly via npx
npx exon-cli create my-new-api

# Option B: Install globally and run
npm install -g exon-cli
exon-cli create my-new-api`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('npx exon-cli create my-new-api')}
                  >
                    <Copy size={12} />
                    Copy Command
                  </button>
                </div>

                <h2 id="initializing-project">2. The Prompt Questionnaire</h2>
                <p>When running the create command, Exon will prompt you to select options. Here is a typical path:</p>
                <div className="callout callout-success">
                  <Check className="callout-icon" />
                  <div>
                    <h4>Interactive Prompt Flow</h4>
                    <ul>
                      <li><code>Select language:</code> Choose <strong>TypeScript</strong> (recommended) or <strong>JavaScript</strong>.</li>
                      <li><code>Select database ORM:</code> Choose from <strong>Prisma</strong>, <strong>Mongoose</strong>, <strong>Drizzle</strong>, or <strong>None</strong>.</li>
                      <li><code>Enable Winston & Morgan logging:</code> Toggle yes/no.</li>
                      <li><code>Enable Swagger UI docs:</code> Toggle yes/no.</li>
                    </ul>
                  </div>
                </div>

                <h2 id="next-steps">3. Start the Dev Server</h2>
                <p>Exon CLI will copy the base template, inject plugins based on your choices, and install dependencies automatically.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Navigate to project directory
cd my-new-api

# Launch standard live reloading development server
npm run dev

# Open browser to access Swagger endpoint (if enabled)
http://localhost:3000/docs`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('cd my-new-api\nnpm run dev')}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              </article>
            )}

            {/* PAGE: CLI COMMANDS */}
            {currentPage === 'cli-commands' && (
              <article>
                <h1>CLI Commands Reference ⚡</h1>
                <p>Learn all options and flags available inside the Exon CLI toolkit.</p>

                {/* command: create */}
                <h2 id="command-create">Command: <code>create</code></h2>
                <p>Scaffolds a fresh, modular Express application in a folder matching the specified name.</p>
                
                <div className="command-details">
                  <div className="command-details-header">exon-cli create &lt;name&gt; [options]</div>
                  <div className="command-option-row">
                    <span className="option-name">-t, --ts</span>
                    <span className="option-desc">Use strict TypeScript compiler template</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-j, --js</span>
                    <span className="option-desc">Use standard ES Module JavaScript template</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-m, --mongoose</span>
                    <span className="option-desc">Inject Mongoose client config & database folders</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-p, --prisma</span>
                    <span className="option-desc">Inject Prisma client config, schema, & binaries</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-d, --drizzle</span>
                    <span className="option-desc">Inject Drizzle configuration & migration schemas</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-L, --logger</span>
                    <span className="option-desc">Enable Morgan requests logger & Winston daily rotate streams</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-S, --swagger</span>
                    <span className="option-desc">Enable interactive Swagger API documentation on "/docs"</span>
                  </div>
                  <div className="command-option-row">
                    <span className="option-name">-D, --docker</span>
                    <span className="option-desc">Generate production-ready Dockerfile & docker-compose configurations</span>
                  </div>
                </div>

                <div className="callout callout-info">
                  <Info className="callout-icon" />
                  <div>
                    <h4>Quick Flag Combination</h4>
                    <code style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>exon-cli create my-crm-backend -t -p -L -S</code>
                  </div>
                </div>

                {/* command: add */}
                <h2 id="command-add" style={{ marginTop: '3rem' }}>Command: <code>add</code></h2>
                <p>Install a plugin directly into an existing Exon project directory. Exon reads the local <code>.exonrc.json</code> configuration, ensures the plugin isn't already installed, injects files, and executes imports dynamically.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Add swagger docs inside your project folder
exon-cli add swagger

# Add Morgan logging
exon-cli add logger`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('exon-cli add swagger')}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>

                {/* command: remove */}
                <h2 id="command-remove" style={{ marginTop: '3rem' }}>Command: <code>remove</code></h2>
                <p>Cleanly uninstall a plugin from an active project directory. This removes all created files (e.g. swagger configurations) and deletes the injected code statements from <code>src/app.ts</code>.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Uninstall socket server plugin
exon-cli remove socket

# Cleanly remove database components
exon-cli remove prisma`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('exon-cli remove socket')}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              </article>
            )}

            {/* PAGE: PLUGIN ARCHITECTURE */}
            {currentPage === 'plugin-architecture' && (
              <article>
                <h1>Plugin Architecture ⚙️</h1>
                <p>Exon is designed around dynamic extensible components called **Plugins**. Rather than loading large static boilerplates, Exon downloads standard plugins on-demand and connects them into application files.</p>

                <h2 id="how-plugins-work">How Plugins Work</h2>
                <p>Plugins are declared inside a remote registry file <code>registery.json</code>. Each plugin defines:</p>
                <ul>
                  <li><strong>Files list:</strong> Code templates copied to your project workspace (e.g. <code>src/utils/logger.ts</code>).</li>
                  <li><strong>Dependencies:</strong> Third-party npm dependencies required for operations.</li>
                  <li><strong>Injection points:</strong> Exact statements injected into target file nodes (like <code>src/app.ts</code> or <code>src/index.ts</code>).</li>
                </ul>

                <h2 id="injection-mechanism">AST Code Injection</h2>
                <p>Unlike simple search-and-replace scripts which break when a developer changes their styles, Exon parses code statements and places injection strings directly around key targets. For example, if a plugin has a <code>statement</code> action:</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`{
  "type": "statement",
  "file": "src/app.ts",
  "after": "const app = express();",
  "code": "app.use(\"/docs\", swaggerUi.serve, swaggerUi.setup(swaggerSpec));"
}`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('{\n  "type": "statement"\n}')}
                  >
                    <Copy size={12} />
                    Copy Spec
                  </button>
                </div>

                <h2 id="plugin-lifecycle">Plugin Lifecycles</h2>
                <p>Plugins can hooks directly into CLI installers using JavaScript callbacks:</p>
                <ul>
                  <li><code>shouldRun()</code>: Determines if standard command flags trigger the plugin activation.</li>
                  <li><code>install()</code>: Executes actions (like running terminal commands or building local configurations) during project scaffolding.</li>
                  <li><code>uninstall()</code>: Cleans configuration blocks when a developer requests plugin removal.</li>
                </ul>
              </article>
            )}

            {/* PAGE: PLUGINS REFERENCE */}
            {currentPage === 'plugins-reference' && (
              <article>
                <h1>Built-In Plugins Reference 🔌</h1>
                <p>Explore full details of available core plugins built by the Exon team.</p>

                <div className="plugins-grid">
                  
                  {/* swagger */}
                  <div className="plugin-item-card" id="plugin-swagger">
                    <div className="plugin-card-header">
                      <h3 className="plugin-card-title">swagger</h3>
                      <span className="plugin-card-type-badge">feature</span>
                    </div>
                    <p>Mounts comprehensive interactive API Explorer interface using Swagger UI on your local endpoints.</p>
                    <div className="plugin-dep-list">
                      <span className="plugin-dep-tag">swagger-ui-express</span>
                      <span className="plugin-dep-tag">swagger-jsdoc</span>
                      <span className="plugin-dep-tag">@types/swagger-ui-express</span>
                    </div>
                    <div className="codeblock-container" style={{ marginTop: '1rem' }}>
                      <pre style={{ padding: '0.65rem', marginBottom: 0 }}><code>exon-cli add swagger</code></pre>
                    </div>
                  </div>

                  {/* logger */}
                  <div className="plugin-item-card" id="plugin-logger">
                    <div className="plugin-card-header">
                      <h3 className="plugin-card-title">logger</h3>
                      <span className="plugin-card-type-badge utility">utility</span>
                    </div>
                    <p>High-fidelity system logging featuring winston logger daily rotational file streams combined with Morgan network request formatters.</p>
                    <div className="plugin-dep-list">
                      <span className="plugin-dep-tag">winston</span>
                      <span className="plugin-dep-tag">morgan</span>
                      <span className="plugin-dep-tag">winston-daily-rotate-file</span>
                    </div>
                    <div className="codeblock-container" style={{ marginTop: '1rem' }}>
                      <pre style={{ padding: '0.65rem', marginBottom: 0 }}><code>exon-cli add logger</code></pre>
                    </div>
                  </div>

                  {/* socket */}
                  <div className="plugin-item-card" id="plugin-realtime">
                    <div className="plugin-card-header">
                      <h3 className="plugin-card-title">socket</h3>
                      <span className="plugin-card-type-badge realtime">realtime</span>
                    </div>
                    <p>Enables out-of-the-box support for realtime WebSocket connections. Installs socket.io, hooks into node http-servers, and configures initial connection handlers.</p>
                    <div className="plugin-dep-list">
                      <span className="plugin-dep-tag">socket.io</span>
                      <span className="plugin-dep-tag">@types/socket.io</span>
                    </div>
                    <div className="codeblock-container" style={{ marginTop: '1rem' }}>
                      <pre style={{ padding: '0.65rem', marginBottom: 0 }}><code>exon-cli add socket</code></pre>
                    </div>
                  </div>

                </div>
              </article>
            )}

            {/* PAGE: DATABASE ORMS */}
            {currentPage === 'database-orms' && (
              <article>
                <h1>Databases & ORMs 🗄️</h1>
                <p>Choose the correct driver architecture for your backend data services.</p>

                <h2 id="orm-prisma">Prisma ORM (SQL)</h2>
                <p>Generates a strict schema file, sets up your client connections, and provides basic CRUD script examples.</p>
                <div className="plugin-dep-list">
                  <span className="plugin-dep-tag">@prisma/client</span>
                  <span className="plugin-dep-tag">prisma (dev)</span>
                </div>
                <div className="codeblock-container" style={{ marginTop: '1rem' }}>
                  <pre><code>{`# To deploy schema migrations after scaffolding
npx prisma db push
npx prisma studio`}</code></pre>
                </div>

                <h2 id="orm-mongoose" style={{ marginTop: '3rem' }}>Mongoose ODM (MongoDB)</h2>
                <p>Sets up MongoDB connection scripts, configures environmental URI hooks, and formats model directories perfectly.</p>
                <div className="plugin-dep-list">
                  <span className="plugin-dep-tag">mongoose</span>
                  <span className="plugin-dep-tag">@types/mongoose (dev)</span>
                </div>

                <h2 id="orm-drizzle" style={{ marginTop: '3rem' }}>Drizzle ORM (SQL-first)</h2>
                <p>Slick and lightweight TypeScript database queries. Exon handles configuration scripts and prepares standard drizzle migration tables.</p>
                <div className="plugin-dep-list">
                  <span className="plugin-dep-tag">drizzle-orm</span>
                  <span className="plugin-dep-tag">drizzle-kit</span>
                </div>
              </article>
            )}

            {/* PAGE: DOCKER DEPLOYMENT */}
            {currentPage === 'docker-deployment' && (
              <article>
                <h1>Docker Deployment Support 🐳</h1>
                <p>Exon makes it simple to bundle, run, and scale your backend APIs inside secure virtual containers.</p>

                <h2 id="dockerization">Docker Orchestration</h2>
                <p>Enabling the <code>--docker</code> flag during scaffold generates a optimized two-stage <strong>multi-build Dockerfile</strong> that reduces build times and cuts image sizes in half by discarding heavy compiler files from final bundles.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Dockerfile generated by Exon CLI
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/index.js"]`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('docker build -t my-app .')}
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>

                <h2 id="environment-configs">Compose Multi-Services</h2>
                <p>Exon constructs a matching <code>docker-compose.yml</code> file automatically configured with database images (e.g. Postgres or MongoDB) corresponding to your ORM selection, setting up environment volumes, network paths, and local ports.</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`# Start container group in background
docker-compose up -d --build`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('docker-compose up -d --build')}
                  >
                    <Copy size={12} />
                    Copy Command
                  </button>
                </div>
              </article>
            )}

            {/* PAGE: BEST PRACTICES */}
            {currentPage === 'best-practices' && (
              <article>
                <h1>Exon Best Practices & Guidelines 🛠️</h1>
                <p>Ensure your production APIs utilize the structure generated by the Exon generator.</p>

                <h2 id="directory-structure">Standard Structure Map</h2>
                <p>An application scaffolded by Exon CLI maps files using this pattern:</p>
                
                <div className="codeblock-container">
                  <pre>
                    <code>{`├── src/
│   ├── app.ts                 # Main express app & middlewares registry
│   ├── index.ts               # Server startup client listeners
│   ├── config/                # Environment variables parsing & validation
│   ├── controllers/           # Route handler modules
│   ├── db/                    # DB Client connection configurations
│   ├── middleware/            # Core request handlers (errors, validations)
│   ├── routes/                # Modular router definitions
│   └── utils/                 # General helpers (winston, morgan)
├── .env.example               # Template environment configuration
├── package.json
└── tsconfig.json`}</code>
                  </pre>
                  <button 
                    className="codeblock-copy-btn" 
                    onClick={() => copyToClipboard('src/')}
                  >
                    <Copy size={12} />
                    Copy Structure
                  </button>
                </div>

                <h2 id="environment-variables">Strict Environment Variables</h2>
                <p>Never place API secrets directly in code. Exon creates a secure <code>.env</code> file. In TypeScript modes, environment schemas are parsed and strictly checked on startup, preventing server launch if critical variables like <code>DATABASE_URL</code> are missing.</p>

                <h2 id="routing-standards">Clean Routing Standards</h2>
                <p>Inject routes modularly using router files inside <code>src/routes/</code>, and link them to <code>app.ts</code> using clean group mappings:</p>
                <div className="codeblock-container">
                  <pre>
                    <code>{`// Recommended Routing Pattern
import { Router } from 'express';
import { getStatus } from '../controllers/status.controller.js';

const router = Router();
router.get('/health', getStatus);

export default router;`}</code>
                  </pre>
                </div>
              </article>
            )}

          </div>
        </main>

        {/* Right Sidebar (Table of Contents) */}
        {currentPage !== 'home' && (
          <aside className="docs-toc">
            <div className="toc-nav">
              <span className="toc-title">ON THIS PAGE</span>
              <ul className="toc-list">
                {docPages.find(p => p.id === currentPage)?.sections.map(sec => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`} className="toc-item-link">
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

      </div>

      {/* Footer */}
      <footer className="site-footer">
        <p>© 2026 Exon CLI. Open-source under MIT License.</p>
        <p>Built with ❤️ by Arpit Bhatia and the Google Gemini engineering team.</p>
        <div className="footer-links">
          <a href="https://github.com/arpitbhatia23/exon-cli" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/exon-cli" target="_blank" rel="noopener noreferrer">NPM Package</a>
          <a href="https://github.com/arpitbhatia23/exon" target="_blank" rel="noopener noreferrer">Monorepo</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
