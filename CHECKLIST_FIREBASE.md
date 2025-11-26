# ✅ Checklist - Configuração Firebase Atualizada

## 🔥 Nova Configuração

**Projeto:** `voz-segura-1ab35`

```
API Key: AIzaSyBRkGPhNDHNkbNMIPayTx9fSJBkDICYdRQ
Auth Domain: voz-segura-1ab35.firebaseapp.com
Project ID: voz-segura-1ab35
Storage Bucket: voz-segura-1ab35.firebasestorage.app
Messaging Sender ID: 614128976282
App ID: 1:614128976282:web:816fca2761bf4451647a23
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

### 1. Firebase Console

- [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35
- [ ] Você consegue acessar o projeto?

### 2. Firestore Database

- [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35/firestore
- [ ] O Firestore está ativado?
- [ ] Se não, clique em "Create Database"

### 3. Configurar Regras do Firestore

- [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35/firestore/rules
- [ ] Cole as regras abaixo e clique em "Publicar"

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // userMedia - Lista de filmes/séries
    match /userMedia/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // episodeProgress - Progresso de episódios
    match /episodeProgress/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // userLists - Listas personalizadas
    match /userLists/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Authentication

- [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35/authentication
- [ ] Clique em "Get Started" (se não estiver ativado)
- [ ] Ative o método "Email/Password"
  - Vá em "Sign-in method"
  - Clique em "Email/Password"
  - Ative e salve

### 5. Criar Índices (IMPORTANTE!)

- [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35/firestore/indexes

**Índice 1: userMedia**

- Collection: `userMedia`
- Fields:
  - `userId` - Ascending
  - `mediaId` - Ascending
  - `mediaType` - Ascending
- Query scope: Collection

**Índice 2: episodeProgress**

- Collection: `episodeProgress`
- Fields:
  - `userId` - Ascending
  - `mediaId` - Ascending
  - `seasonNumber` - Ascending
  - `episodeNumber` - Ascending
- Query scope: Collection

---

## 🧪 TESTE

Depois de configurar tudo:

1. **Recarregue o app:**

   ```bash
   npx expo start -c
   ```

2. **Teste o fluxo completo:**

   - [ ] Criar conta (Cadastro)
   - [ ] Fazer login
   - [ ] Adicionar filme à lista
   - [ ] Ver "Minha Lista"
   - [ ] Observar logs: `⏱️ [ADD] Salvo! Tempo: XXXms`

3. **Verificar no Firebase:**
   - [ ] Acesse: https://console.firebase.google.com/project/voz-segura-1ab35/firestore/data
   - [ ] Deve aparecer a coleção `userMedia`
   - [ ] Deve ter documentos com seus filmes

---

## 🔍 VERIFICAR CONFIGURAÇÃO

Execute este comando para verificar se há erros:

```bash
cd "c:\Users\Ruan Gomes\Downloads\kingMedia-main\kingMedia-main"
npx expo start -c
```

---

## ⚠️ POSSÍVEIS PROBLEMAS

### Erro: "Missing or insufficient permissions"

**Solução:** Configure as regras do Firestore (Passo 3)

### Erro: "PERMISSION_DENIED: Missing or insufficient permissions"

**Solução:**

1. Verifique se fez login
2. Verifique se as regras estão publicadas
3. Aguarde 1 minuto após publicar as regras

### Lentidão ao adicionar/buscar

**Solução:** Crie os índices compostos (Passo 5)

### Erro: "auth/invalid-email"

**Solução:** Ative Email/Password no Authentication (Passo 4)

---

## 📊 ESTRUTURA DE DADOS ESPERADA

### Firestore Collections

```
voz-segura-1ab35 (Firestore Database)
├── userMedia
│   ├── [docId1]
│   │   ├── userId: "abc123"
│   │   ├── mediaId: 12345
│   │   ├── mediaType: "movie"
│   │   ├── title: "Filme Exemplo"
│   │   ├── posterPath: "/poster.jpg"
│   │   ├── status: "quero_assistir"
│   │   ├── genres: ["Ação", "Aventura"]
│   │   ├── addedAt: Timestamp
│   │   └── updatedAt: Timestamp
│   └── ...
├── episodeProgress
│   └── ...
└── userLists
    └── ...
```

---

## 🎯 RESULTADO ESPERADO

Após configurar tudo:

- ✅ Login funciona
- ✅ Adicionar à lista é rápido (< 1s)
- ✅ "Minha Lista" carrega rápido
- ✅ Dados aparecem no Firebase Console
- ✅ Cache funciona (segunda vez é instantânea)

---

## 📱 LOGS ESPERADOS

```
⏱️ [ADD] Iniciando...
⏱️ [ADD] Salvando no Firestore...
⏱️ [ADD] Salvo! Tempo: 234ms
⏱️ [ADD] Cache atualizado!
✅ [ADD] Total: 245ms
```

```
⏱️ [GET] Cache vazio ou expirado. Buscando do Firestore...
⏱️ [GET] Executando query...
⏱️ [GET] Query concluída: 3 docs (189ms)
⏱️ [GET] Cache atualizado com 3 itens
✅ [GET] Total: 195ms
```

Segunda vez (com cache):

```
⚡ [GET] Usando CACHE! 3 itens (2ms)
```

---

## 💡 DICA

Se tudo estiver muito lento (> 5s):

1. ✅ Certifique-se que criou os índices (Passo 5)
2. ✅ Aguarde 2-5 minutos após criar os índices
3. ✅ Recarregue o app: `npx expo start -c`

---

Marque cada checkbox ✅ conforme for completando!
