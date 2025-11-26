# 🔍 Verificação Firebase - Status Atual

## ⚠️ IMPORTANTE: Configuração Detectada

**Projeto ativo no código:** `king-media-3cbc2`

O checklist menciona `voz-segura-1ab35`, mas o código está usando **`king-media-3cbc2`**.

---

## ✅ Correções Aplicadas

1. ✅ Adicionado `databaseURL` para Realtime Database
2. ✅ Configuração consistente com projeto `king-media-3cbc2`

---

## 🔧 Próximos Passos Obrigatórios

### 1. Ativar Firestore Database

🔗 https://console.firebase.google.com/project/king-media-3cbc2/firestore

- Clique em **"Create Database"** ou **"Criar banco de dados"**
- Escolha **"Start in test mode"** (modo teste)
- Selecione localização: **us-central1** ou mais próxima
- Clique em **"Enable"**

### 2. Configurar Regras do Firestore

🔗 https://console.firebase.google.com/project/king-media-3cbc2/firestore/rules

Cole estas regras e clique em **"Publicar"**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // userMedia - Lista de filmes/séries do usuário
    match /userMedia/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // episodeProgress - Progresso de episódios
    match /episodeProgress/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // userLists - Listas personalizadas
    match /userLists/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. Ativar Authentication (Email/Password)

🔗 https://console.firebase.google.com/project/king-media-3cbc2/authentication

- Clique em **"Get Started"**
- Vá em **"Sign-in method"**
- Clique em **"Email/Password"**
- Ative a primeira opção (Email/Password)
- Clique em **"Save"**

### 4. Ativar Realtime Database

🔗 https://console.firebase.google.com/project/king-media-3cbc2/database

- Clique em **"Create Database"**
- Escolha **"Start in test mode"**
- Localização: **us-central1**
- Clique em **"Enable"**

Depois, configure as regras:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 5. Criar Índices Compostos

🔗 https://console.firebase.google.com/project/king-media-3cbc2/firestore/indexes

**Índice 1: userMedia (principal)**

- Collection ID: `userMedia`
- Fields indexed:
  - `userId` → Ascending
  - `mediaId` → Ascending
  - `mediaType` → Ascending
- Query scope: Collection

**Índice 2: episodeProgress**

- Collection ID: `episodeProgress`
- Fields indexed:
  - `userId` → Ascending
  - `mediaId` → Ascending
  - `seasonNumber` → Ascending
  - `watched` → Ascending
- Query scope: Collection

---

## 🧪 Teste Completo

Depois de ativar tudo, teste:

```bash
npx expo start -c
```

### Fluxo de Teste:

1. **Cadastro**

   - Criar conta com email válido
   - Deve criar usuário no Authentication E no Realtime Database

2. **Login**

   - Fazer login com a conta criada
   - Deve redirecionar para Menu

3. **Adicionar Filme**

   - Navegar para qualquer filme
   - Clicar em "Adicionar à Lista"
   - Observar no console: `⏱️ [ADD] Salvo! Tempo: XXXms`

4. **Ver Minha Lista**

   - Ir para "Minha Lista"
   - Filme deve aparecer
   - Segunda vez deve mostrar: `⚡ [GET] Usando CACHE!`

5. **Verificar no Firebase Console**
   - Firestore → userMedia → Deve ter documentos
   - Realtime Database → users → Deve ter seu usuário
   - Authentication → Users → Deve ter seu email

---

## 🎯 Estrutura de Dados

### Firestore (userMedia.ts)

```
Firestore Database
├── userMedia (collection)
│   ├── [auto-id]
│   │   ├── userId: string
│   │   ├── mediaId: number
│   │   ├── mediaType: "movie" | "tv"
│   │   ├── title: string
│   │   ├── posterPath: string | null
│   │   ├── status: "quero_assistir" | "assistindo" | "assistido" | "pausado"
│   │   ├── rating: number (opcional)
│   │   ├── genres: string[]
│   │   ├── listName: string (opcional)
│   │   ├── addedAt: Timestamp
│   │   └── updatedAt: Timestamp
│
├── episodeProgress (collection)
│   ├── [user_media_season_episode]
│   │   ├── userId: string
│   │   ├── mediaId: number
│   │   ├── seasonNumber: number
│   │   ├── episodeNumber: number
│   │   ├── watched: boolean
│   │   └── watchedAt: Timestamp
│
└── userLists (collection)
    ├── [auto-id]
    │   ├── userId: string
    │   ├── name: string
    │   ├── description: string
    │   ├── createdAt: Timestamp
    │   └── isDefault: boolean
```

### Realtime Database (Cadastro.tsx / Perfil.tsx)

```
Realtime Database
└── users
    └── [userId]
        ├── nome: string
        ├── username: string
        ├── email: string
        ├── senha: string
        └── criadoEm: string (ISO date)
```

---

## ✅ Checklist de Verificação

**Firebase Console:**

- [ ] Firestore Database ativado
- [ ] Regras do Firestore configuradas
- [ ] Authentication (Email/Password) ativado
- [ ] Realtime Database ativado
- [ ] Regras do Realtime Database configuradas
- [ ] Índices compostos criados

**Código:**

- [x] `databaseURL` adicionado ao firebaseConfig.ts
- [x] Imports corretos em todos os arquivos
- [x] Cache implementado (1 minuto)
- [x] Performance logs ativos

**Testes:**

- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Adicionar filme < 1s
- [ ] Minha Lista carrega rápido
- [ ] Cache funciona (segunda vez instantânea)
- [ ] Dados aparecem no Firebase Console

---

## 📊 Logs Esperados

### Adicionar à lista (primeira vez):

```
⏱️ [ADD] Iniciando...
⏱️ [ADD] Salvando no Firestore...
⏱️ [ADD] Salvo! Tempo: 234ms
⏱️ [ADD] Cache atualizado!
✅ [ADD] Total: 245ms
```

### Buscar lista (primeira vez):

```
⏱️ [GET] Cache vazio ou expirado. Buscando do Firestore...
⏱️ [GET] Executando query...
⏱️ [GET] Query concluída: 3 docs (189ms)
⏱️ [GET] Cache atualizado com 3 itens
✅ [GET] Total: 195ms
```

### Buscar lista (segunda vez, com cache):

```
⚡ [GET] Usando CACHE! 3 itens (2ms)
```

---

## ⚠️ Problemas Comuns

### Erro: "Missing or insufficient permissions"

**Causa:** Regras do Firestore não configuradas  
**Solução:** Configure regras no passo 2

### Erro: "auth/invalid-email"

**Causa:** Authentication não ativado  
**Solução:** Ative Email/Password no passo 3

### Erro: "PERMISSION_DENIED"

**Causa:** Regras do Realtime Database incorretas  
**Solução:** Configure regras no passo 4

### Lentidão > 5s

**Causa:** Índices compostos não criados  
**Solução:** Crie índices no passo 5 e aguarde 2-5 minutos

### Items não aparecem na lista

**Causa:** Cache precisa ser limpo  
**Solução:** Feche e reabra o app ou force refresh

---

## 🚀 Performance Esperada

Com tudo configurado:

- ✅ Cadastro: ~2s
- ✅ Login: ~1-2s
- ✅ Adicionar à lista: **< 1s**
- ✅ Carregar lista (primeira vez): **< 500ms**
- ✅ Carregar lista (cache): **< 5ms** ⚡

---

## 📱 Comandos Úteis

```bash
# Limpar cache e reiniciar
npx expo start -c

# Ver logs detalhados
npx expo start --dev-client

# Verificar erros
npx expo doctor
```

---

## 💡 Dica Final

Se após configurar tudo ainda houver problemas:

1. Aguarde **2-5 minutos** após criar os índices
2. Limpe o cache do app: `npx expo start -c`
3. Verifique se há erros no console do navegador
4. Confirme que está logado no Firebase com o projeto correto

---

**Última atualização:** 25/11/2025  
**Projeto Firebase:** king-media-3cbc2
