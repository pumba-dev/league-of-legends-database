# 🤝 Guia de Contribuição - Champion Dex

Obrigado por considerar contribuir para o Champion Dex! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

## 🚀 Como Contribuir

### 1. Reportar Bugs

Se você encontrou um bug:

1. Verifique se o bug já foi reportado nas Issues
2. Se não, crie uma nova Issue com:
   - Título claro e descritivo
   - Passos detalhados para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Screenshots (se aplicável)
   - Informações do ambiente (browser, OS, etc.)

**Template de Bug Report:**

```markdown
## Descrição do Bug

[Descrição clara e concisa do bug]

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

[O que deveria acontecer]

## Screenshots

[Se aplicável]

## Ambiente

- OS: [ex: Windows 11]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]
```

### 2. Sugerir Melhorias

Para sugerir uma nova feature:

1. Verifique se já existe uma Issue similar
2. Crie uma nova Issue com:
   - Descrição clara da feature
   - Casos de uso
   - Benefícios para os usuários
   - Possível implementação (opcional)

**Template de Feature Request:**

```markdown
## Descrição da Feature

[Descrição clara e concisa]

## Problema que Resolve

[Por que essa feature é necessária?]

## Solução Proposta

[Como você imagina que funcionaria?]

## Alternativas Consideradas

[Outras formas de resolver o mesmo problema]

## Screenshots/Mockups

[Se aplicável]
```

### 3. Contribuir com Código

#### Setup do Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lol-db.git

# Entre no diretório
cd lol-db

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

#### Workflow de Contribuição

1. **Fork o Repositório**
   - Clique em "Fork" no GitHub

2. **Crie uma Branch**

   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/meu-bug-fix
   ```

3. **Faça suas Mudanças**
   - Escreva código limpo e comentado
   - Siga as convenções do projeto
   - Teste suas mudanças

4. **Commit suas Mudanças**

   ```bash
   git add .
   git commit -m "feat: adiciona nova feature X"
   ```

5. **Push para seu Fork**

   ```bash
   git push origin feature/minha-feature
   ```

6. **Abra um Pull Request**
   - Vá para o repositório original
   - Clique em "New Pull Request"
   - Descreva suas mudanças detalhadamente

## 📝 Convenções de Código

### Estrutura de Arquivos

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas/Views
├── utils/         # Funções auxiliares
├── hooks/         # Custom hooks
└── styles/        # Estilos globais
```

### Nomenclatura

**Componentes:**

- PascalCase: `ChampionCard.jsx`
- Nomes descritivos e específicos

**Funções:**

- camelCase: `handleFilterChange`
- Verbos que descrevem a ação

**Variáveis:**

- camelCase: `filteredChampions`
- Nomes descritivos

**Constantes:**

- UPPER_SNAKE_CASE: `MAX_ITEMS_PER_PAGE`

### Comentários

```javascript
/**
 * Nome do Componente - Descrição breve
 * Descrição mais detalhada (opcional)
 */
function MyComponent({ prop1, prop2 }) {
  // Comentário de linha única para lógica específica

  return (
    // JSX code
  )
}
```

### Estilo de Código

- **Indentação:** 2 espaços
- **Quotes:** Single quotes para strings
- **Semicolons:** Opcional mas consistente
- **Arrow Functions:** Preferir quando possível
- **Destructuring:** Usar quando apropriado

```javascript
// ✅ Bom
const { name, title } = champion;
const handleClick = () => console.log("clicked");

// ❌ Evitar
const name = champion.name;
const title = champion.title;
function handleClick() {
  console.log("clicked");
}
```

### Componentes React

```javascript
// Template de componente
import { useState, useEffect } from "react";

/**
 * ComponentName - Descrição breve
 */
function ComponentName({ prop1, prop2 }) {
  // 1. Hooks de estado
  const [state, setState] = useState(initialValue);

  // 2. Hooks de efeito
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Handlers e funções
  const handleAction = () => {
    // Handler logic
  };

  // 4. Render
  return <div className="...">{/* JSX */}</div>;
}

export default ComponentName;
```

### Tailwind CSS

- Use classes utilitárias do Tailwind
- Evite estilos inline quando possível
- Agrupe classes logicamente
- Use responsive prefixes (sm:, md:, lg:)

```jsx
// ✅ Bom
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-gray-800 hover:bg-gray-700
  transition-colors duration-300
">
  Content
</div>

// ❌ Evitar
<div className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
  Content
</div>
```

## 🧪 Testes

Antes de submeter um PR:

```bash
# Execute o linter
npm run lint

# Teste o build
npm run build

# Teste a preview
npm run preview
```

## 📦 Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova feature
- `fix:` Bug fix
- `docs:` Mudanças na documentação
- `style:` Formatação, espaços em branco
- `refactor:` Refatoração de código
- `perf:` Melhorias de performance
- `test:` Adição de testes
- `chore:` Manutenção, configs

**Exemplos:**

```bash
feat: adiciona filtro por tipo de dano
fix: corrige scroll infinito no mobile
docs: atualiza README com instruções de deploy
style: formata código com prettier
refactor: reorganiza estrutura de componentes
perf: otimiza carregamento de imagens
test: adiciona testes para FilterBar
chore: atualiza dependências
```

## 🎯 Áreas que Precisam de Ajuda

Estamos buscando contribuições em:

- [ ] **Testes:** Adicionar cobertura de testes
- [ ] **Acessibilidade:** Melhorar ARIA labels e navegação por teclado
- [ ] **Performance:** Otimizações de bundle e carregamento
- [ ] **Documentação:** Tutoriais e guias
- [ ] **Internacionalização:** Tradução para outros idiomas
- [ ] **Design:** Melhorias visuais e UX
- [ ] **Features:** Implementar itens do roadmap

## 🔍 Code Review

Pull Requests serão revisados considerando:

- ✅ Código limpo e legível
- ✅ Segue as convenções do projeto
- ✅ Funcionalidade está completa
- ✅ Não quebra features existentes
- ✅ Documentação atualizada (se necessário)
- ✅ Testes passam (quando aplicável)

## 📞 Dúvidas?

- Abra uma Issue com a tag `question`
- Descreva sua dúvida claramente
- Inclua contexto relevante

## 🙏 Agradecimentos

Obrigado por contribuir para tornar o Champion Dex melhor! Cada contribuição, não importa quão pequena, é valiosa.

---

**Happy Coding! 🎮⚔️**
