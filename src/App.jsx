import MarginTrend from './components/MarginTrend'
import Explorer from './components/Explorer'
import Funnel from './components/Funnel'
import { fmtPct, fmtBRL, totalsForDate, shareOfSpend, shortfallAnalysis, overallMarginStats, DEFAULT_SEGMENT, D20_DATE } from './lib/data'

export default function App() {
  const margin = overallMarginStats()
  const d20 = totalsForDate(D20_DATE)
  const share = shareOfSpend(DEFAULT_SEGMENT)
  const shortfall = shortfallAnalysis(DEFAULT_SEGMENT)

  return (
    <>
      <nav className="topnav">
        <div className="inner">
          <span className="brand">Investigação de performance · Aquisição</span>
          <div className="links">
            <a href="#visao-geral">Visão geral</a>
            <a href="#explorar">Explorar</a>
            <a href="#funil">Funil</a>
            <a href="#causa-raiz">Causa raiz</a>
            <a href="#recomendacoes">Recomendações</a>
          </div>
        </div>
      </nav>

      <div className="wrap">
        <section id="visao-geral" style={{ paddingTop: 56 }}>
          <div className="eyebrow">20 de julho de 2024</div>
          <h1>A margem da equipe de Aquisição virou negativa em um único dia — e a causa está isolada em 41% do orçamento.</h1>
          <p className="lede">
            A margem diária andava estável entre 1% e 4% ao longo de julho. Em 20/07 ela caiu para -5%.
            A queda não veio da conta inteira: veio de um único cruzamento de instituição, estado e curso
            que, sozinho, respondia por quase metade do gasto do dia.
          </p>

          <div className="hero-stat">
            <span className="num">{fmtPct(margin.day20, 0)}</span>
            <span className="cap">margem em 20/07, ante média de {fmtPct(margin.avgBefore, 0)} nos 19 dias anteriores</span>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="label">Receita perdida no dia (vs. esperado)</div>
              <div className="value alert">{fmtBRL(shortfall.totalShortfall)}</div>
              <div className="sub">comparado à média histórica de ROAS por segmento</div>
            </div>
            <div className="kpi-card">
              <div className="label">% do shortfall explicado por UFBRA/SP/ADM</div>
              <div className="value alert">{fmtPct(shortfall.segSharePct, 0)}</div>
              <div className="sub">um único cruzamento de dimensões</div>
            </div>
            <div className="kpi-card">
              <div className="label">Share do gasto do dia nesse segmento</div>
              <div className="value">{fmtPct(share, 0)}</div>
              <div className="sub">gasto seguiu normal — o problema não foi verba</div>
            </div>
            <div className="kpi-card">
              <div className="label">Gasto e receita totais, 20/07</div>
              <div className="value">{fmtBRL(d20.gasto)}</div>
              <div className="sub">receita: {fmtBRL(d20.revenue)} · ROAS {d20.roas.toFixed(2)}</div>
            </div>
          </div>
        </section>

        <section>
          <div className="eyebrow neutral">Margem diária</div>
          <h2>Um mês estável, uma quebra isolada</h2>
          <p className="body-text">
            O gráfico abaixo mostra a margem diária da equipe de Aquisição durante julho. A barra vermelha
            marca 20/07 — o único dia fora do padrão observado no restante do mês.
          </p>
          <div className="card" style={{ marginTop: 20 }}>
            <MarginTrend />
          </div>
        </section>

        <section id="explorar">
          <div className="eyebrow neutral">Investigação</div>
          <h2>Onde exatamente a performance quebrou</h2>
          <p className="body-text">
            Cruzando instituição, estado, canal e curso, a queda de ROAS em 20/07 aparece concentrada em
            um único combo: <strong>UFBRA · SP · ADM</strong>. Ele afeta os três canais de tráfego
            (Tiktok, Meta e Google Search) igualmente — sinal de que a causa está no destino do anúncio
            (landing page), não na mídia. Use os filtros para conferir outros cruzamentos: nenhum outro
            mostra o mesmo padrão de queda no dia 20.
          </p>
          <Explorer />
        </section>

        <section id="funil">
          <div className="eyebrow neutral">Funil</div>
          <h2>A quebra é no topo do funil, não no checkout</h2>
          <p className="body-text">
            Comparando as etapas do funil do segmento afetado antes e durante o dia 20: o Add to cart caiu
            quase pela metade, enquanto o Checkout CVR — a etapa de pagamento — permaneceu normal. Quem
            chegava ao checkout continuava comprando. O vazamento está entre o clique no anúncio e a
            adição ao carrinho.
          </p>
          <Funnel />
        </section>

        <section id="causa-raiz">
          <div className="eyebrow">Causa raiz</div>
          <h2>Hipóteses</h2>
          <p className="body-text">
            Nenhuma destas foi confirmada em sistema — são as explicações mais prováveis dado o padrão
            observado, em ordem de probabilidade.
          </p>
          <div className="hyp-list">
            <div className="hyp-item">
              <h3>Falha técnica na landing page do curso ADM (SP)</h3>
              <p>
                Bug de carregamento, formulário quebrado, imagem ou preço não renderizando. Explica por
                que o impacto é idêntico nos três canais — todos apontam para a mesma página — e por que
                o checkout, que já não depende mais da LP, seguiu normal.
              </p>
            </div>
            <div className="hyp-item">
              <h3>Alteração de conteúdo, oferta ou preço na véspera</h3>
              <p>
                Um deploy, edição de CMS ou ajuste de copy feito entre 19/07 e 20/07 nessa página
                específica pode ter prejudicado a proposta de valor ou quebrado algum elemento visual.
              </p>
            </div>
            <div className="hyp-item">
              <h3>Instabilidade de hospedagem/CDN isolada a essa URL</h3>
              <p>
                Menos provável, mas explicaria uma degradação pontual e temporária sem qualquer mudança
                de configuração de mídia.
              </p>
            </div>
          </div>
        </section>

        <section id="recomendacoes" style={{ borderBottom: 'none' }}>
          <div className="eyebrow ok">Próximos passos</div>
          <h2>Recomendações</h2>
          <div className="rec-list">
            <div className="rec-item">
              <span className="tag">Imediato</span>
              <p>Checar logs de erro, uptime e Search Console da landing page de ADM/SP no dia 20/07, e revisar o histórico de deploys/edições de CMS entre 19 e 20/07.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Imediato</span>
              <p>Validar ao vivo o disparo do evento de Add to Cart nessa página — descartar (ou confirmar) que parte da queda é tracking, não apenas comportamento real de usuário.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Curto prazo</span>
              <p>Enquanto a causa não é confirmada, reduzir o budget do segmento afetado e realocar para os cursos que mantiveram performance normal no período.</p>
            </div>
            <div className="rec-item">
              <span className="tag">Estrutural</span>
              <p>Um único cruzamento institution × estado × curso concentrando ~41% do budget diário é um risco por si só. Definir caps de concentração por segmento e alertas automáticos de queda de Add to Cart acima de um limiar, antes que o gasto continue fluindo sem controle.</p>
            </div>
          </div>
        </section>

        <footer>
          <span>Dados fictícios · teste técnico de performance</span>
          <span>Preparado para revisão do CMO</span>
        </footer>
      </div>
    </>
  )
}
