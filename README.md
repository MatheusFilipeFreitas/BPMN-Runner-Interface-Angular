# 🟢 BPMN Runner Doc Page

![Angular](https://img.shields.io/badge/Angular-v20-red)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌐 Demo

Acesse a versão online do projeto: [Demo do Projeto](https://bpmn-runner.dev/)

## 📖 Descrição

Este projeto é uma aplicação Angular v20 que tem como objetivo **\[descrever o objetivo do projeto]**.
Ele inclui **\[listar funcionalidades principais]**, e foi desenvolvido com foco em **\[ex.: aprendizado, produtividade, demonstração de UI/UX, etc.]**.

---

## 🛠 Tecnologias Utilizadas

* **Angular v20**
* **TypeScript**
* **Node.js v20+**
* **CSS / SCSS**

---

## 💻 Pré-requisitos

Antes de iniciar, você precisa ter instalado:

* Node.js >= 20.0.0
* npm >= 9.0.0
* Angular CLI (opcional, mas recomendado)

Verifique a versão do Node.js:

```bash
node -v
```

Verifique a versão do npm:

```bash
npm -v
```

---

## ⚡ Instalação

1. Clone o repositório (Gitlab):

```bash
git clone https://gitlab.com/aluno-ufn/bpmn-runner-doc-page.git
```

1. Clone o repositório (Github):

```bash
git clone https://github.com/MatheusFilipeFreitas/BPMN-Runner-Interface-Angular.git
```

2. Acesse a pasta do projeto:

```bash
cd bpmn-runner-doc-page
```

3. Instale as dependências:

```bash
npm install
```

---

## Como pegar as credenciais do firebase

Acesse o Firebase Console

👉 https://console.firebase.google.com/

Escolha seu projeto.

✅ 2. Vá em “Configurações do Projeto”

Menu esquerdo → ⚙️ Configurações do projeto

✅ 3. Vá até a seção “Seus apps”

Role a página até encontrar:

Seus apps

com os ícones:

* Web (</>)

* Android

* iOS

* Unity

* Flutter

Se você ainda não registrou o app Web:

👉 clique no ícone Web (</>)

✅ 4. Registre o app Web

Coloque um nome, por exemplo:

bpmn-runner-frontend


Não precisa habilitar hosting (a não ser que vá usar).

Clique em Registrar app.

✅ 5. Copie as credenciais do Firebase Web

Depois de registrar, o Firebase mostra um bloco assim:

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

Copie o código e cole dentro do arquivo: `bpmn-runner-doc-page/src/environments/environments.ts`, na propriedade `firebase`.

## 🚀 Execução

Para rodar a aplicação em ambiente de desenvolvimento:

```bash
ng serve
```

Acesse `http://localhost:4200` no seu navegador.

Para gerar o build de produção:

```bash
ng build --prod
```

---

## 🗂 Estrutura do Projeto

```
nome-do-projeto/
│
├─ src/
│  ├─ app/
│  │  ├─ components/      # Componentes reutilizáveis
│  │  ├─ pages/           # Páginas da aplicação
│  │  ├─ services/        # Serviços e integração com API
│  │  ├─ app.module.ts
│  │  └─ app.component.ts
│  ├─ assets/             # Imagens, fontes, etc.
│  └─ styles/             # CSS/SCSS global
│
├─ angular.json
├─ package.json
└─ README.md
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
