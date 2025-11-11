# SGI - Sistema de Gestão de Incidentes

## 📋 Descrição do Projeto

Protótipo funcional de frontend para um sistema de gestão de incidentes de software, desenvolvido como projeto da cadeira de Engenharia de Software da Universidade da Beira Interior (2025/26).

## 🎯 Objetivo

Criar um protótipo estático e navegável com **HTML e CSS puro**, sem JavaScript, demonstrando as funcionalidades básicas de um sistema de gestão de incidentes.

## 🏗️ Estrutura do Projeto

```
/
├── index.html              # Página inicial (redireciona para login)
├── login.html              # Página de login/registo
├── dashboard.html          # Dashboard principal
├── incidentes.html         # Lista de incidentes
├── detalhe-incidente.html  # Detalhes de um incidente
├── novo-incidente.html     # Formulário criar/editar incidente
├── relatorios.html         # Página de relatórios
├── css/
│   └── styles.css          # Estilos principais
└── README.md               # Este arquivo
```

## 🚀 Funcionalidades

### 1. **Login / Registo**
- Campos: email, senha
- Link para recuperar senha
- Alternância entre login e registo
- Layout centralizado e moderno

### 2. **Dashboard Principal**
- Cards com métricas (total, abertos, em progresso, fechados)
- Gráficos estáticos simulados com CSS
- Tabela com incidentes recentes
- Navegação lateral fixa

### 3. **Lista de Incidentes**
- Tabela completa com filtros
- Colunas: ID, Título, Categoria, Prioridade, Status, Responsável, Data
- Sistema de paginação
- Botão "Novo Incidente"

### 4. **Detalhes de Incidente**
- Informações completas do incidente
- Timeline de atualizações
- Sistema de atribuição
- Ações: editar status, atribuir, resolver

### 5. **Criar / Editar Incidente**
- Formulário completo com validação
- Campos: Título, Descrição, Categoria, Prioridade, Responsável, Data limite
- Upload de anexos (simulado)
- Configurações de notificação

### 6. **Relatórios**
- Filtros por data, categoria, responsável
- Gráficos estáticos de métricas
- Exportação simulada (PDF/CSV)
- Análise de tendências

## 🎨 Características Técnicas

### **Estilo Visual**
- ✅ Cores neutras: cinzas, brancos, azul escuro para destaques
- ✅ Fonte: Inter, Roboto, system-ui (sans-serif)
- ✅ Layout responsivo para desktop
- ✅ CSS puro, sem frameworks
- ✅ Componentes reutilizáveis: cards, botões, tabelas, inputs

### **Requisitos Cumpridos**
- ✅ **Sem JavaScript** - navegação com links `<a>` e formulários estáticos
- ✅ **Código comentado** - comentários explicativos em HTML e CSS
- ✅ **Classes CSS organizadas** - sistema de nomenclatura consistente
- ✅ **Simulação de interatividade** - estados visuais e feedback
- ✅ **Design moderno** - seguindo princípios de UI/UX

## 🧪 Como Executar

### **Método 1: Servidor Python**
```bash
# Navegar para o diretório do projeto
cd /caminho/para/o/projeto

# Iniciar servidor HTTP
python -m http.server 8000

# Acessar no navegador
http://localhost:8000
```

### **Método 2: Abrir Diretamente**
1. Navegue até o diretório do projeto
2. Clique duas vezes no arquivo `index.html`
3. O navegador abrirá automaticamente

### **Método 3: Live Server (VS Code)**
1. Instalar extensão "Live Server" no VS Code
2. Clicar com botão direito no `index.html`
3. Selecionar "Open with Live Server"

## 📁 Navegação

1. **Página Inicial** → Redireciona para login
2. **Login** → Dashboard (use qualquer email/senha)
3. **Dashboard** → Acesso a todas as funcionalidades
4. **Navegação** → Sidebar lateral fixa com todos os menus

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e layouts modernos
  - CSS Grid
  - Flexbox
  - Variáveis CSS
  - Animações básicas
- **Design Responsivo** - Adaptação para diferentes tamanhos

## 📊 Dados de Exemplo

O sistema contém dados fictícios para demonstração:
- 247 incidentes totais
- 42 incidentes abertos
- 18 em progresso
- 187 fechados
- 6 utilizadores diferentes
- 4 categorias principais

## 🎯 Casos de Uso

### **Para Desenvolvedores**
- Reportar bugs encontrados
- Acompanhar progresso de resolução
- Documentar problemas técnicos

### **Para Gestores**
- Monitorar performance da equipa
- Gerar relatórios de incidentes
- Acompanhar métricas de qualidade

### **Para Equipa de Suporte**
- Gerenciar fila de incidentes
- Atribuir tarefas a responsáveis
- Manter histórico de resoluções

## 📋 Próximos Passos Sugeridos

### **Backend Integration**
- API REST para dados dinâmicos
- Sistema de autenticação real
- Banco de dados para persistência

### **Funcionalidades Avançadas**
- Busca e filtros dinâmicos
- Sistema de notificações real-time
- Dashboard interativo com Chart.js
- Exportação real de relatórios

### **Melhorias de UX**
- Modo escuro
- Personalização de interface
- Atalhos de teclado
- Acessibilidade aprimorada

## 👨‍🎓 Informações Académicas

- **Universidade**: Universidade da Beira Interior
- **Curso**: Engenharia de Software
- **Ano Letivo**: 2025/26
- **Tipo**: Projeto de Frontend - Protótipo Estático

## 📄 Licença

Este projeto foi desenvolvido para fins académicos.

---

**Nota**: Este é um protótipo funcional sem backend. Todas as interações são simuladas através de JavaScript básico para navegação e validação de formulários.