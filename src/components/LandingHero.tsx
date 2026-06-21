import React, { useState } from 'react';
import { 
  Shield, CheckCircle, Database, Phone, FileText, Smartphone, 
  Map, Sparkles, Award, Zap, Layers, Server, TrendingUp, HelpCircle
} from 'lucide-react';

interface LandingHeroProps {
  logs: string[];
  onClearLogs: () => void;
  children: React.ReactNode;
}

export default function LandingHero({ logs, onClearLogs, children }: LandingHeroProps) {
  // Target Persona switcher for high-conversion copywriting
  // 'autonomous' | 'distributor' | 'investor'
  const [activePersona, setActivePersona] = useState<string>('autonomous');

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-neutral-950">
      
      {/* Premium Navigation Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <span className="text-neutral-950 font-black text-lg">O</span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-neutral-50 block">OrçaLivre Pro</span>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold block">App Suite Nacional</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#simulator" className="hover:text-zinc-100 font-medium transition-colors">Emulador do App</a>
            <a href="#technical" className="hover:text-zinc-100 font-medium transition-colors">Estrutura DB & Arquitetura</a>
            <a href="#roadmap" className="hover:text-zinc-100 font-medium transition-colors">Plano de Escala</a>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 text-[11px] font-mono text-zinc-400 border border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SQLite Local
            </span>
            <a 
              href="#simulator" 
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-neutral-950 font-bold rounded-lg text-xs tracking-wide transition-all shadow-lg shadow-emerald-950/20"
            >
              Testar MVP Offline
            </a>
          </div>
        </div>
      </header>

      {/* Main Interactive Pitch Banner & Smartphone Simulator */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/15 via-neutral-950 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column - Pitch Storytelling */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/20 w-fit text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pronto para Apresentação PME & Investidores</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-50 leading-[1.08]">
                Venda e estime orçamentos sem depender de <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">rede ou nuvem.</span>
              </h1>

              <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
                O único ecossistema mobile com arquitetura 100% autônoma, formulado para marcenarias, representantes de vendas e prestadores de serviços de campo. Importação de tabelas instantânea via arquivos planos, cálculo volumétrico inteligente em metros cúbicos (fórmula de cubagem de madeira de lei) e exportação de PDF elegante para envio direto via WhatsApp.
              </p>

              {/* Persona interactive Switcher tabs */}
              <div className="mt-2 space-y-3">
                <span className="text-xs uppercase text-zinc-500 font-bold block font-mono">Personalizar narrativa da Landing Page para:</span>
                <div className="grid grid-cols-3 gap-2 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
                  <button 
                    onClick={() => setActivePersona('autonomous')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePersona === 'autonomous' ? 'bg-emerald-600 text-neutral-950 shadow-md' : 'text-zinc-400 hover:text-zinc-100 hover:bg-neutral-800/40'}`}
                  >
                    👷 Profissional Autônomo
                  </button>
                  <button 
                    onClick={() => setActivePersona('distributor')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePersona === 'distributor' ? 'bg-emerald-600 text-neutral-950 shadow-md' : 'text-zinc-400 hover:text-zinc-100 hover:bg-neutral-800/40'}`}
                  >
                    🏪 Distribuidor / Revenda
                  </button>
                  <button 
                    onClick={() => setActivePersona('investor')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePersona === 'investor' ? 'bg-emerald-600 text-neutral-950 shadow-md' : 'text-zinc-400 hover:text-zinc-100 hover:bg-neutral-800/40'}`}
                  >
                    💼 Investidores / Parceiros
                  </button>
                </div>

                {/* Switcher Content */}
                <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/60 min-h-[140px] flex flex-col justify-between">
                  {activePersona === 'autonomous' && (
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-zinc-100">Controle total do seu bolso, livre de assinaturas obrigatórias</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Crie e gerencie sua própria tabela de preços no celular. Adicione clientes com o histórico consolidado de orçamentos e envie propostas elegantes para aprovação no WhatsApp com menos cliques. Funciona mesmo sem sinal rodoviário ou na casa do cliente rural.
                      </p>
                      <div className="flex gap-4 pt-2 text-[11px] font-mono text-emerald-400">
                        <span>✓ Sem mensalidade fixa</span>
                        <span>✓ Dados armazenados no seu celular</span>
                        <span>✓ Livre de internet ou 4G</span>
                      </div>
                    </div>
                  )}

                  {activePersona === 'distributor' && (
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-zinc-100">Distribua sua tabela oficial para centenas de vendedores parceiros</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Seus vendedores importam as tabelas de preços instantaneamente em formato TXT com suporte a auditoria de margem integrada. Reduza o suporte comercial e elimine divergências de preços ao sincronizar dados em arquivos simples.
                      </p>
                      <div className="flex gap-4 pt-2 text-[11px] font-mono text-emerald-400">
                        <span>✓ Atualização de preço instantânea</span>
                        <span>✓ Prevenção de duplicidade por SKU</span>
                        <span>✓ Relatório de margem em tempo real</span>
                      </div>
                    </div>
                  )}

                  {activePersona === 'investor' && (
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-zinc-100">Escalabilidade com foco em alta retenção orgânica</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        O modelo de dados distribuído offline resolve o principal gargalo na adoção de ERPs tradicionais para o público rural e varejista. Menos custos de infraestrutura no lançamento e retenção viral orgânica garantida pela robustez do ecossistema local.
                      </p>
                      <div className="flex gap-4 pt-2 text-[11px] font-mono text-emerald-400">
                        <span>✓ Custo de servidor quase zero</span>
                        <span>✓ Alto valor de LTV</span>
                        <span>✓ Transição opcional para nuvem</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column - Handset Emulator & Logs */}
            <div id="simulator" className="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center gap-4">
              
              <div className="text-center">
                <span className="text-xs text-zinc-500 block">SIMULAÇÃO COMPLETA DA EXPERIÊNCIA</span>
                <span className="text-[11px] text-emerald-400 font-mono">Clique nos botões do celular abaixo para simular ações reais!</span>
              </div>

              {/* Mounted child - PhoneSimulator */}
              {children}

              {/* Developer Live Telemetry console */}
              <div className="w-full max-w-[360px] bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-[10px] font-mono">
                <div className="flex justify-between items-center text-zinc-400 border-b border-neutral-800 pb-1.5 mb-1.5">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">Telemetria de Consultas SQLite</span>
                  <button onClick={onClearLogs} className="text-[8px] hover:underline text-zinc-500">Limpar logs</button>
                </div>
                <div className="space-y-1 max-h-[80px] overflow-y-auto font-mono text-[9px] text-zinc-400">
                  {logs.map((log, id) => (
                    <div key={id} className="flex gap-1">
                      <span className="text-[#a855f7]">[RoomDB]</span>
                      <span className="text-zinc-300">{log}</span>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <span className="text-neutral-600 block italic">Aguardando interações na tela do dispositivo acima...</span>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Structured specifications module & SQLite logic */}
      <section id="technical" className="py-20 bg-neutral-900 border-b border-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-50 sm:text-4xl">
              Arquitetura de Banco Local & Algoritmo de Volume
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">
              O ecossistema SQLite sob Room garante a consistência transacional do estoque local utilizando o melhor motor embarcado do sistema operacional Android.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Technical block 1 - Wood log calculation formulas */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 flex flex-col gap-5 justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Layers className="w-6 h-6" />
                  <h3 className="text-xl font-bold text-zinc-100">Fórmula de Cubagem Rústica (Huber)</h3>
                </div>
                
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Para madeiras volumosas brutas ou toras cilíndricas, a unidade de medida do orçamento deve ser o Metro Cúbico ($M^3$). O sistema automatiza este cálculo utilizando a consagrada **Fórmula de Huber**, baseada no diâmetro e comprimento da tora:
                </p>

                {/* LaTeX formula styling block */}
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center my-3 font-mono">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Equação Matemática</span>
                  <span className="text-lg text-emerald-400 block font-semibold">
                    V = <span className="underline">π × D² × L</span>
                  </span>
                  <span className="text-lg text-emerald-400 block font-semibold">40.000</span>
                  
                  <div className="grid grid-cols-3 gap-4 mt-3 text-[10px] text-zinc-400 border-t border-neutral-800 pt-2 w-full text-center">
                    <div><strong>V</strong>: Volume em $m^3$</div>
                    <div><strong>D</strong>: Diâmetro em cm</div>
                    <div><strong>L</strong>: Comprimento em m</div>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  <strong>Vantagem Operacional:</strong> O vendedor no pátio digita apenas o diâmetro medido no centro da tora e o seu comprimento útil. O aplicativo resolve a integral volumétrica em tempo real e já insere o total na nota de venda do orçamento, evitando erros de cálculo manual que geravam perigo de margem negativa de até 20%.
                </p>
              </div>

              {/* Unit specifications */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800">
                <div className="bg-neutral-900 p-2 rounded text-center">
                  <span className="text-xs font-bold text-zinc-200 block">Unitário (UN)</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Parafusos, dobradiças</span>
                </div>
                <div className="bg-neutral-900 p-2 rounded text-center">
                  <span className="text-xs font-bold text-zinc-200 block">Metro Linear (M)</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Vigas, cabos, perfis</span>
                </div>
                <div className="bg-neutral-900 p-2 rounded text-center">
                  <span className="text-xs font-bold text-zinc-200 block">Volumétrico (M³)</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Madeira bruta, toras</span>
                </div>
              </div>
            </div>

            {/* Technical block 2 - Price updates comparison advantages */}
            <div className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Database className="w-6 h-6" />
                <h3 className="text-xl font-bold text-zinc-100">Atualização Inteligente de Tabelas</h3>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                Nossa agência projetou uma arquitetura flexível para importação e atualização do pátio de estoque, evitando quebras de consistência na conversão de orçamentos antigos. Compare as vantagens de processar atualizações em arquivos locais:
              </p>

              {/* Advantage comparisons table */}
              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-neutral-900 p-2 text-xs font-mono font-bold text-zinc-300 border-b border-neutral-800">
                  <div className="col-span-3">Formato</div>
                  <div className="col-span-6">Comportamento/Desempenho</div>
                  <div className="col-span-3 text-right">Avaliação</div>
                </div>
                <div className="divide-y divide-neutral-900 text-[11px] font-mono">
                  
                  <div className="grid grid-cols-12 p-2.5 items-center">
                    <span className="col-span-3 font-bold text-emerald-300">Pipe TXT</span>
                    <span className="col-span-6 text-zinc-400 leading-snug">Menor tamanho de buffer de disco, decodificação assíncrona extremamente veloz no Kotlin.</span>
                    <span className="col-span-3 text-right text-emerald-400 font-bold">Excelente (Recomendado)</span>
                  </div>

                  <div className="grid grid-cols-12 p-2.5 items-center">
                    <span className="col-span-3 text-zinc-300">CSV Clássico</span>
                    <span className="col-span-6 text-zinc-500 leading-snug">Conflita facilmente quando campos de descrição possuem vírgulas ou aspas rústicas.</span>
                    <span className="col-span-3 text-right text-amber-500 font-bold">Razoável</span>
                  </div>

                  <div className="grid grid-cols-12 p-2.5 items-center">
                    <span className="col-span-3 text-zinc-300">JSON</span>
                    <span className="col-span-6 text-zinc-500 leading-snug">Ideal para WebServices, porém muito verboso para vendedores compartilharem via app de chat.</span>
                    <span className="col-span-3 text-right text-zinc-500">Média</span>
                  </div>

                  <div className="grid grid-cols-12 p-2.5 items-center">
                    <span className="col-span-3 text-indigo-300">SQLite puro</span>
                    <span className="col-span-6 text-zinc-500 leading-snug">Permite cópia física direta, mas impede análise de histórico individualizado de produtos antigos.</span>
                    <span className="col-span-3 text-right text-indigo-400">Bons Casos</span>
                  </div>

                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-xs leading-relaxed text-zinc-400">
                💡 <strong>Análise de Alterações (Auditagem):</strong> O processador do aplicativo calcula o hash das linhas de forma incremental. Se o preço antigo sofrer desconto ou acréscimo, ele documenta o delta, permitindo ao usuário mesclar em novos lotes de venda sem perder seus produtos customizados.
              </div>
            </div>

          </div>

          {/* Database structure DER visually designed */}
          <div className="mt-12 bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Server className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">Mapeamento de Integridade Relacional (DER)</span>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">TABLE clients</span>
                <span className="text-[10px] text-zinc-500 block">Armazena cadastros físicos.</span>
                <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5">
                  <div>- id (K) ➔ PK</div>
                  <div>- name</div>
                  <div>- whatsapp (Unique Number)</div>
                </div>
              </div>

              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">TABLE products</span>
                <span className="text-[10px] text-zinc-500 block">Especificações de preço mestre.</span>
                <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5">
                  <div>- id ➔ PK</div>
                  <div>- code (SKU indexado)</div>
                  <div>- price | unit</div>
                </div>
              </div>

              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">TABLE budgets</span>
                <span className="text-[10px] text-zinc-500 block">Gestão de propostas e status.</span>
                <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5">
                  <div>- id ➔ PK</div>
                  <div>- client_id (FK clientes)</div>
                  <div>- version (Controle)</div>
                </div>
              </div>

              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">TABLE budget_items</span>
                <span className="text-[10px] text-zinc-500 block">Vínculos de produtos adicionados.</span>
                <div className="text-[10px] text-zinc-400 mt-2 space-y-0.5">
                  <div>- budget_id (FK orçados)</div>
                  <div>- product_id (FK produtos)</div>
                  <div>- diameter | length (M3)</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Five-years roadmap and commercial scale scale layout */}
      <section id="roadmap" className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-50 sm:text-4xl">
              Plano de Escala & Evolução do Produto (5 anos)
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              De um MVP 100% focado na dor do vendedor ambulante do pátio até o ecossistema SaaS de faturamento multiplataforma.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-xs font-mono text-zinc-400">
            
            {/* Phase 1 */}
            <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-emerald-400 text-base font-bold font-sans">MVP</div>
              <span className="text-xs uppercase text-emerald-400 block font-bold font-sans">Fase 1: Lançamento Core (Mês 1-6)</span>
              <h3 className="text-lg font-bold text-neutral-100 font-sans">Local State Estável</h3>
              <ul className="space-y-2 text-zinc-400 pt-2 leading-relaxed">
                <li>• Cadastro 100% offline via SQLite local criptografado.</li>
                <li>• Importação de preços via arquivo Pipe-TXT.</li>
                <li>• Editor integrado da Fórmula Huber para o setor madeireiro.</li>
                <li>• Link de deeplink para WhatsApp e exportador HTML-to-PDF nativo.</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-emerald-400 text-base font-bold font-sans">PRO</div>
              <span className="text-xs uppercase text-emerald-400 block font-bold font-sans">Fase 2: Conectividade (Ano 1-2)</span>
              <h3 className="text-lg font-bold text-neutral-100 font-sans">Nuvem Híbrida & Pix</h3>
              <ul className="space-y-2 text-zinc-400 pt-2 leading-relaxed">
                <li>• Backup em nuvem automático opcional para segurança de roubo.</li>
                <li>• Geração de QR-Codes Pix offline pré-calculando chaves locais.</li>
                <li>• Sincronização multi-vendedor ponta-a-ponta via Wi-Fi interno.</li>
                <li>• Emissão básica de cupom de entrega e ordens de serviço rústicas.</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-emerald-400 text-base font-bold font-sans">ENTERPRISE</div>
              <span className="text-xs uppercase text-emerald-400 block font-bold font-sans">Fase 3: Multi-ERP (Ano 3-5)</span>
              <h3 className="text-lg font-bold text-neutral-100 font-sans">Ecossistema Corporativo</h3>
              <ul className="space-y-2 text-zinc-400 pt-2 leading-relaxed">
                <li>• Catálogos interativos auto-hospedados via CDN própria.</li>
                <li>• Integração em tempo real com barramentos SAP / TOTVS para PMEs.</li>
                <li>• Faturamento fiscal automatizado nativo (NFe / NFCe).</li>
                <li>• Assinatura e carteira de cobrança integrada na app para revendedores.</li>
              </ul>
            </div>

          </div>

          <div className="mt-12 bg-neutral-900/40 border border-neutral-800/80 p-5 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-sans">Diretrizes de Backup & Segurança</span>
            <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
              Como o sistema funciona sem internet comercial, os arquivos de backup local são empacotados em um único container binário decodificável pelo aplicativo do usuário em qualquer novo aparelho celular Android. Isso garante a proteção contra defeitos ou quebras do dispositivo físico sem armazenar dados pessoais em servidores sob nossa responsabilidade.
            </p>
          </div>

        </div>
      </section>

      {/* Informative Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 OrçaLivre Pro - Plataforma Comercial Desenvolvida de Acordo com Requisitos Premium.</span>
          <div className="flex gap-4">
            <span className="text-emerald-500">Android Kotlin / SQLite Embedded Room</span>
            <span>-</span>
            <span>UX Pitch Room</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
