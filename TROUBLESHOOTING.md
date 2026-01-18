# 🛠️ Guia de Comandos e Troubleshooting - Champion Dex

## 📋 Comandos Essenciais

### Instalação e Configuração

```bash
# Instalar dependências
npm install

# Instalar uma dependência específica
npm install nome-do-pacote

# Instalar dependência de desenvolvimento
npm install --save-dev nome-do-pacote

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em porta específica
npm run dev -- --port 3001

# Iniciar e expor na rede local
npm run dev -- --host

# Limpar cache e iniciar
npm run dev -- --force
```

### Build e Deploy

```bash
# Gerar build de produção
npm run build

# Preview da build
npm run preview

# Build e preview
npm run build && npm run preview

# Analisar tamanho do bundle
npm run build -- --mode production --minify
```

### Qualidade de Código

```bash
# Verificar erros de lint
npm run lint

# Corrigir erros de lint automaticamente
npm run lint -- --fix

# Formatar código (se tiver Prettier)
npm run format
```

### Limpeza e Reset

```bash
# Remover node_modules
Remove-Item -Recurse -Force node_modules

# Remover build
Remove-Item -Recurse -Force dist

# Limpar cache do npm
npm cache clean --force

# Reinstalar tudo do zero
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 🔧 Troubleshooting

### Problema: "Cannot find module"

**Sintomas:** Erro ao importar um módulo

**Soluções:**

```bash
# 1. Reinstalar dependências
npm install

# 2. Limpar cache e reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install

# 3. Verificar se o módulo está no package.json
npm install nome-do-modulo
```

### Problema: "Port 3000 is already in use"

**Sintomas:** Porta já está em uso

**Soluções:**

```bash
# 1. Usar outra porta
npm run dev -- --port 3001

# 2. Encontrar e matar o processo (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 3. Reiniciar o terminal
```

### Problema: Página em branco

**Sintomas:** Nada aparece na tela

**Soluções:**

1. Abrir DevTools (F12) e verificar console
2. Verificar se há erros de importação
3. Limpar cache do navegador (Ctrl + Shift + Delete)
4. Verificar se o arquivo JSON está no lugar correto

```bash
# Verificar estrutura
Get-ChildItem -Recurse -Name
```

### Problema: Estilos não aparecem

**Sintomas:** Layout sem estilização

**Soluções:**

```bash
# 1. Verificar se Tailwind está configurado
cat tailwind.config.js

# 2. Verificar se PostCSS está configurado
cat postcss.config.js

# 3. Reinstalar dependências do Tailwind
npm install -D tailwindcss postcss autoprefixer

# 4. Reiniciar servidor de desenvolvimento
# Ctrl + C e depois npm run dev
```

### Problema: Imagens não carregam

**Sintomas:** Imagens quebradas ou não aparecem

**Soluções:**

1. Verificar URL das imagens no console
2. Testar conexão com Data Dragon:
   - https://ddragon.leagueoflegends.com/cdn/16.1.1/img/champion/Aatrox.png
3. Verificar se há bloqueio de CORS
4. Limpar cache do navegador

### Problema: Build falha

**Sintomas:** `npm run build` retorna erro

**Soluções:**

```bash
# 1. Verificar erros no código
npm run lint

# 2. Limpar dist e tentar novamente
Remove-Item -Recurse -Force dist
npm run build

# 3. Verificar versão do Node
node --version  # Deve ser >= 16

# 4. Build com mais informações
npm run build -- --debug
```

### Problema: Animações não funcionam

**Sintomas:** Framer Motion não anima

**Soluções:**

```bash
# 1. Verificar instalação
npm list framer-motion

# 2. Reinstalar
npm uninstall framer-motion
npm install framer-motion

# 3. Verificar importações nos componentes
```

### Problema: Filtros não funcionam

**Sintomas:** Filtros não atualizam a lista

**Verificações:**

1. Console do navegador (F12) para erros
2. React DevTools para estado dos componentes
3. Verificar se `handleFilterChange` está sendo chamado
4. Verificar dependências do `useEffect`

### Problema: Scroll infinito não funciona

**Sintomas:** Não carrega mais campeões ao rolar

**Verificações:**

1. Verificar `displayCount` no React DevTools
2. Verificar se `isLoadingMore` está mudando
3. Verificar console para erros
4. Testar em navegador diferente

## 🔍 Comandos de Diagnóstico

### Verificar Versões

```bash
# Node.js
node --version

# npm
npm --version

# Verificar todas as dependências instaladas
npm list --depth=0

# Verificar pacote específico
npm list react
```

### Verificar Estrutura do Projeto

```bash
# Listar arquivos
Get-ChildItem -Recurse -Name

# Verificar se arquivos existem
Test-Path public/champions-full.json
Test-Path database/dragontail-16.1.1

# Ver tamanho dos arquivos
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum
```

### Limpar Todos os Caches

```bash
# Cache do npm
npm cache clean --force

# Cache do Vite
Remove-Item -Recurse -Force node_modules/.vite

# Cache do navegador
# Ctrl + Shift + Delete no navegador
```

## 🚀 Otimizações de Performance

### Verificar Tamanho do Bundle

```bash
# Após build
npm run build

# Analisar arquivos gerados
Get-ChildItem -Recurse dist | Sort-Object Length -Descending | Select-Object -First 10
```

### Testar Performance

```bash
# Lighthouse (Chrome DevTools)
# 1. Build do projeto
npm run build

# 2. Servir build
npm run preview

# 3. Abrir Chrome DevTools > Lighthouse
# 4. Executar análise
```

## 📱 Teste em Dispositivos

### Testar em Mobile (Mesma rede Wi-Fi)

```bash
# 1. Iniciar com --host
npm run dev -- --host

# 2. Pegar IP local
ipconfig | findstr IPv4

# 3. Acessar no celular
# http://192.168.X.X:3000
```

### Testar Responsividade (Chrome DevTools)

1. F12 para abrir DevTools
2. Ctrl + Shift + M para modo responsivo
3. Selecionar dispositivo ou dimensões customizadas
4. Testar interações

## 🔐 Segurança

### Verificar Vulnerabilidades

```bash
# Audit de segurança
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# Corrigir forçadamente (cuidado!)
npm audit fix --force
```

## 📊 Monitoramento

### Logs de Desenvolvimento

```bash
# Ver logs detalhados
npm run dev -- --debug

# Ver logs do Vite
npm run dev -- --logLevel info
```

## 🎯 Dicas Úteis

### Atalhos do VS Code

- `Ctrl + P` - Buscar arquivo
- `Ctrl + Shift + F` - Buscar em todos os arquivos
- `Ctrl + B` - Toggle sidebar
- `Alt + Shift + F` - Formatar documento
- `F2` - Renomear símbolo

### Atalhos do Navegador (DevTools)

- `F12` - Abrir DevTools
- `Ctrl + Shift + C` - Inspecionar elemento
- `Ctrl + Shift + R` - Hard reload (limpa cache)
- `Ctrl + Shift + I` - Abrir DevTools
- `Ctrl + Shift + M` - Toggle device toolbar

### Extensions Recomendadas (VS Code)

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Path Intellisense
```

## 🆘 Onde Buscar Ajuda

1. **Console do Navegador (F12)** - Primeiro lugar para verificar erros
2. **React DevTools** - Inspecionar componentes e estado
3. **Terminal** - Logs do Vite e npm
4. **Documentação:**
   - [React](https://react.dev/)
   - [Vite](https://vitejs.dev/)
   - [Tailwind CSS](https://tailwindcss.com/)
   - [Recharts](https://recharts.org/)
   - [Framer Motion](https://www.framer.com/motion/)

## 📞 Checklist de Debug

Quando algo não funciona:

- [ ] Verificar console do navegador (F12)
- [ ] Verificar terminal para erros
- [ ] Limpar cache do navegador
- [ ] Reiniciar servidor de desenvolvimento
- [ ] Verificar importações dos arquivos
- [ ] Verificar se JSON está no lugar correto
- [ ] Reinstalar node_modules
- [ ] Testar em navegador diferente
- [ ] Verificar versão do Node.js
- [ ] Ler mensagem de erro completamente

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0.0

Para mais ajuda, consulte os outros arquivos de documentação:

- [README.md](README.md) - Documentação principal
- [INSTALLATION.md](INSTALLATION.md) - Guia de instalação
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guia de contribuição
