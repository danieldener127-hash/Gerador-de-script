
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Code, 
  Settings, 
  Cpu, 
  Layers, 
  Terminal,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { MemoryType, ScriptFeature, ScriptConfig } from './types';
import { formatStandardScript, generateAdvancedLua } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<ScriptConfig>({
    title: 'Meu Script VIP',
    version: '1.0',
    author: 'Admin',
    features: []
  });
  
  const [activeTab, setActiveTab] = useState<'build' | 'ai'>('build');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const addFeature = () => {
    const newFeature: ScriptFeature = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Nova Função',
      search: '100',
      replace: '999',
      type: MemoryType.DWORD
    };
    setConfig(prev => ({ ...prev, features: [...prev.features, newFeature] }));
  };

  const removeFeature = (id: string) => {
    setConfig(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
  };

  const updateFeature = (id: string, updates: Partial<ScriptFeature>) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const handleGenerateStandard = () => {
    if (config.features.length === 0) {
      alert('Adicione pelo menos uma função para gerar o script.');
      return;
    }
    const code = formatStandardScript(config);
    setGeneratedCode(code);
    setActiveTab('build'); // Stay or switch to result area
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedCode('');
    try {
      const code = await generateAdvancedLua(aiPrompt);
      setGeneratedCode(code);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const downloadFile = () => {
    if (!generatedCode) return;
    const element = document.createElement("a");
    const file = new Blob([generatedCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${config.title.replace(/\s+/g, '_') || 'script'}.lua`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Cpu className="text-slate-950" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              GG Master
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Script Generator v2.0</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('build')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'build' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
            >
              <Settings size={18} />
              <span className="font-medium text-sm">Configuração Manual</span>
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
            >
              <Sparkles size={18} />
              <span className="font-medium text-sm">Gerador Inteligente</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Metadados</h3>
            <div className="space-y-3 px-1">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Título do Menu</label>
                <input 
                  type="text" 
                  value={config.title}
                  onChange={e => setConfig({...config, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Versão</label>
                  <input 
                    type="text" 
                    value={config.version}
                    onChange={e => setConfig({...config, version: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Autor</label>
                  <input 
                    type="text" 
                    value={config.author}
                    onChange={e => setConfig({...config, author: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <button 
            onClick={handleGenerateStandard}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all"
           >
             <Code size={18} /> Gerar Script Manual
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-950 relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${generatedCode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
            <span className="text-sm text-slate-400 font-medium">
              {activeTab === 'build' ? 'Editor de Funções' : 'Assistente AI'}
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={copyToClipboard}
              disabled={!generatedCode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${copyFeedback ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'} disabled:opacity-30`}
             >
               {copyFeedback ? <CheckCircle2 size={14} /> : <Copy size={14} />} 
               {copyFeedback ? 'Copiado!' : 'Copiar'}
             </button>
             <button 
              onClick={downloadFile}
              disabled={!generatedCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-30 transition-all shadow-md shadow-cyan-950/40"
             >
               <Download size={14} /> Baixar (.lua)
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scroll-smooth">
          {activeTab === 'build' ? (
            <section className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <Terminal className="text-cyan-400" size={26} />
                    Funções do Script
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Defina os valores que o GameGuardian deve buscar e alterar.</p>
                </div>
                <button 
                  onClick={addFeature}
                  className="flex items-center gap-2 bg-cyan-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-500/10"
                >
                  <Plus size={18} /> Nova Função
                </button>
              </div>

              {config.features.length === 0 ? (
                <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-16 text-center group cursor-pointer hover:border-slate-700 transition-colors" onClick={addFeature}>
                  <div className="inline-flex p-6 bg-slate-800 rounded-2xl mb-6 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/5 transition-all">
                    <Layers size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-300">Comece seu script</h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm leading-relaxed">Adicione funções manuais de pesquisa e substituição ou use a inteligência artificial ao lado.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {config.features.map(feature => (
                    <div key={feature.id} className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900/80 transition-all border-l-4 border-l-cyan-500/50">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                        <div className="md:col-span-3">
                          <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Nome da Opção</label>
                          <input 
                            type="text"
                            value={feature.name}
                            onChange={e => updateFeature(feature.id, { name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all shadow-inner"
                            placeholder="Ex: Vida Infinita"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Pesquisa</label>
                          <input 
                            type="text"
                            value={feature.search}
                            onChange={e => updateFeature(feature.id, { search: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all shadow-inner"
                            placeholder="Valor atual"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Alteração</label>
                          <input 
                            type="text"
                            value={feature.replace}
                            onChange={e => updateFeature(feature.id, { replace: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all shadow-inner"
                            placeholder="Novo valor"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Tipo</label>
                          <select 
                            value={feature.type}
                            onChange={e => updateFeature(feature.id, { type: e.target.value as MemoryType })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 outline-none transition-all cursor-pointer shadow-inner appearance-none"
                          >
                            <option value={MemoryType.DWORD}>DWORD</option>
                            <option value={MemoryType.FLOAT}>FLOAT</option>
                            <option value={MemoryType.DOUBLE}>DOUBLE</option>
                            <option value={MemoryType.BYTE}>BYTE</option>
                            <option value={MemoryType.QWORD}>QWORD</option>
                            <option value={MemoryType.WORD}>WORD</option>
                            <option value={MemoryType.XOR}>XOR</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button 
                            onClick={() => removeFeature(feature.id)}
                            className="p-2.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Remover"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-purple-500/10 text-purple-400 rounded-3xl mb-4 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white">Inteligência Artificial</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Descreva o que você quer que o script faça e o Gemini criará o código Lua completo para você.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                <textarea 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ex: Crie um script para Free Fire que procure o valor 100 em Float e mude para 1000 quando ativado, com um menu azul e preto..."
                  className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                />
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-wider">Linguagem: Lua</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-wider">Model: Gemini 3 Flash</span>
                  </div>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50 disabled:grayscale"
                  >
                    {isGenerating ? (
                      <><Loader2 className="animate-spin" size={20} /> Gerando Código...</>
                    ) : (
                      <><Sparkles size={20} /> Gerar Script com AI</>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Scripts de Menu", desc: "Menus organizados por categorias" },
                  { title: "Anti-Ban", desc: "Lógicas de segurança básicas" },
                  { title: "Hack Visual", desc: "Wallhacks e Chams via Lua" }
                ].map((item, i) => (
                  <div key={i} className="p-5 border border-slate-800 rounded-2xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors cursor-default">
                    <h4 className="font-bold text-sm text-slate-300">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Generated Code Result Area */}
          <section className={`max-w-4xl mx-auto space-y-4 pt-10 border-t border-slate-800/50 ${generatedCode || isGenerating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} transition-all duration-700`}>
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Code size={16} /> 
                {isGenerating ? 'Gerando Código...' : 'Código Gerado (.lua)'}
              </h3>
              {generatedCode && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest font-bold">
                  Pronto para uso
                </span>
              )}
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={copyToClipboard}
                  className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all shadow-lg"
                  title="Copiar código"
                >
                  <Copy size={16} />
                </button>
              </div>
              <pre className="p-6 md:p-8 overflow-x-auto code-font text-sm md:text-base leading-relaxed text-cyan-50/90 max-h-[500px] scrollbar-thin">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-600">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="animate-pulse">Consultando o mestre das scripts...</p>
                  </div>
                ) : (
                  <code className="block whitespace-pre">
                    {generatedCode || '-- O código aparecerá aqui após ser gerado.'}
                  </code>
                )}
              </pre>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="flex-1 p-4 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-300">Como usar este script?</h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Copie o código acima, salve em um arquivo .lua e execute no seu GameGuardian. Certifique-se de estar com o jogo selecionado no GG antes de rodar.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
