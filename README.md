# 🔐 SGI Frontend — Sistema de Gestão de Incidências  

![Static Badge](https://img.shields.io/badge/status-active-brightgreen)
![Static Badge](https://img.shields.io/badge/firebase-auth%20%26%20firestore-orange)
![Static Badge](https://img.shields.io/badge/node-express-blue)
![Static Badge](https://img.shields.io/badge/license-MIT-lightgrey)

Interface pública e responsiva do **SGI (Sistema de Gestão de Incidências)**.  
Desenvolvida em **HTML + CSS + JavaScript**, com autenticação e gestão de dados via **Firebase Authentication + Firestore**,  
e servida localmente através de **Express (Node.js)**.

---

## 🧭 Visão Geral  

O **SGI Frontend** permite o acesso de diferentes perfis de utilizador — **colaborador, técnico, gestor e administrador** —  
através de dashboards dedicados e protegidos por role.  
Garante **login seguro**, **controlo de permissões** e **integração direta com o Firestore**.

---

## 🗂️ Estrutura do Projeto  

```
public/
├─ css/
│  └─ styles.css               # 🎨 Estilos base (não alterar)
├─ js/
│  ├─ firebase-config.js       # 🔑 Configurações Firebase (as tuas chaves)
│  ├─ auth.js                  # 🔐 Login + criação/verificação de utilizadores
│  └─ guard.js                 # 🛡️ Proteção de dashboards e logout
├─ login.html                  # Página de autenticação
├─ dashboard-user.html         # Dashboard do colaborador
├─ dashboard-technician.html   # Dashboard do técnico
├─ dashboard-manager.html      # Dashboard do gestor
├─ dashboard-admin.html        # Dashboard do administrador
└─ index.html                  # Redirecionamento inicial para login
```

---

## 🔁 Fluxo de Autenticação  

1. **Login (login.html)**  
   - Utiliza `signInWithEmailAndPassword()` para autenticar.  
   - Se for o primeiro acesso, cria `users/{uid}` com:  
     ```js
     { email, role: "user", createdAt: serverTimestamp() }
     ```

2. **Redirecionamento por Role**  
   - 🧍‍♂️ user → `dashboard-user.html`  
   - 🧰 technician → `dashboard-technician.html`  
   - 📋 manager → `dashboard-manager.html`  
   - 🛠️ admin → `dashboard-admin.html`

3. **Proteção de Páginas (`guard.js`)**  
   - Verifica `auth.onAuthStateChanged()`  
   - Lê o `role` de Firestore e redireciona conforme necessário  
   - Preenche o header com `#headerUserEmail` e `#headerUserRole`  
   - Garante logout limpo com `auth.signOut()`

---

## 🧩 Stack Técnica  

| Componente | Tecnologia |
|-------------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (modular) |
| **Backend** | Node.js + Express |
| **Base de Dados** | Firebase Firestore |
| **Autenticação** | Firebase Auth (Email/Password) |
| **Hosting Local** | `npm run dev` via Express |

---

## 🧠 Arquitetura Simplificada  

```text
[ Utilizador ] → login.html → Firebase Auth
        ↓
     users/{uid} (Firestore)
        ↓
   redirecionamento por role
        ↓
[ dashboard-[role].html ] → guard.js → Firestore
```

---

## 👨‍💻 Autores e Créditos  

Projeto académico — **Universidade da Beira Interior (UBI)**  
Desenvolvido no âmbito da disciplina de **Engenharia de Software**, como parte do **Sistema de Gestão de Incidências (SGI)**.  


