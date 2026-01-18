# 🎮 Champion Dex - Guia de Instalação Rápida

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (vem com o Node.js) ou **yarn**

Para verificar se estão instalados, execute:

```bash
node --version
npm --version
```

## 🚀 Instalação - Passo a Passo

### 1️⃣ Abrir o Terminal no Diretório do Projeto

No Windows PowerShell:

```powershell
cd c:\Users\eduar\github\lol-db
```

### 2️⃣ Instalar as Dependências

Execute o comando:

```bash
npm install
```

⏱️ Isso pode levar alguns minutos na primeira vez. Aguarde até ver a mensagem de conclusão.

### 3️⃣ Iniciar o Servidor de Desenvolvimento

Execute:

```bash
npm run dev
```

✅ Você verá algo assim:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4️⃣ Abrir no Navegador

- O navegador deve abrir automaticamente
- Se não abrir, acesse manualmente: **http://localhost:3000**

## 🎉 Pronto!

Agora você pode:

- ✅ Explorar a lista de campeões
- ✅ Usar os filtros de busca
- ✅ Clicar em um campeão para ver detalhes
- ✅ Visualizar gráficos e estatísticas

## 🛠️ Comandos Úteis

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Gera build para produção             |
| `npm run preview` | Preview da build de produção         |
| `npm run lint`    | Verifica erros no código             |

## ❓ Problemas Comuns

### Erro: "Cannot find module"

**Solução:** Delete a pasta `node_modules` e execute `npm install` novamente

### Erro: "Port 3000 is already in use"

**Solução:** Pare qualquer outro processo usando a porta 3000 ou edite `vite.config.js` para mudar a porta

### Página em branco

**Solução:** Verifique o console do navegador (F12) para ver erros

## 📁 Estrutura do Projeto

```
lol-db/
├── 📁 src/
│   ├── 📁 components/       ← Componentes React
│   ├── 📁 pages/            ← Páginas principais
│   ├── App.jsx              ← App principal
│   └── main.jsx             ← Entrada do app
├── 📁 database/             ← Database dragontail (172 campeões)
├── 📁 public/               ← Arquivos estáticos
│   └── champions-full.json  ← Dados consolidados (2.92 MB)
├── package.json             ← Dependências
└── README.md                ← Documentação completa
```

## 🎨 Customização

Para mudar as cores do tema, edite `tailwind.config.js`:

```javascript
colors: {
  'lol-gold': '#C89B3C',    // Cor dourada principal
  'lol-blue': '#0AC8B9',    // Cor azul secundária
  'lol-dark': '#010A13',    // Fundo escuro
}
```

## 📱 Testar em Mobile

1. Certifique-se de estar na mesma rede Wi-Fi
2. Execute: `npm run dev -- --host`
3. Acesse o endereço de rede mostrado no terminal pelo celular

## 🚀 Deploy em Produção

### Vercel (Recomendado - Gratuito)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Instale o Vercel CLI: `npm i -g vercel`
3. Execute: `vercel`
4. Siga as instruções

### Netlify

1. Execute: `npm run build`
2. Arraste a pasta `dist` para [netlify.com/drop](https://app.netlify.com/drop)

## 💡 Dicas

- **Hot Reload:** O site atualiza automaticamente ao salvar arquivos
- **Console de Erros:** Pressione F12 no navegador para debug
- **React DevTools:** Instale a extensão para debug avançado

## 📞 Suporte

Se encontrar problemas:

1. Verifique se Node.js e npm estão atualizados
2. Delete `node_modules` e execute `npm install` novamente
3. Limpe o cache do navegador
4. Verifique o console do navegador para erros

---

**Desenvolvido com ❤️ para a comunidade de League of Legends**

Para documentação completa, veja [README.md](README.md)
