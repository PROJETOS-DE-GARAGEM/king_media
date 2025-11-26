# 🔥 Configuração do Firebase - ATIVA

## ✅ CONFIGURAÇÃO ATUAL

**Arquivo usado:** `firebase/firebaseConfig.ts`

```
Projeto: voz-segura-1ab35
Auth Domain: voz-segura-1ab35.firebaseapp.com
Project ID: voz-segura-1ab35
```

### 📍 Links Importantes:

**Firebase Console:**
https://console.firebase.google.com/project/voz-segura-1ab35

**Firestore Data:**
https://console.firebase.google.com/project/voz-segura-1ab35/firestore/data

**Firestore Rules:**
https://console.firebase.google.com/project/voz-segura-1ab35/firestore/rules

**Authentication:**
https://console.firebase.google.com/project/voz-segura-1ab35/authentication/users

---

## 🗂️ Coleções do Firestore

### 1. `userMedia` (Lista de Filmes/Séries)

```
Campos:
- userId: string
- mediaId: number
- mediaType: "movie" | "tv"
- title: string
- posterPath: string
- status: "quero_assistir" | "assistindo" | "assistido" | "pausado"
- genres: string[]
- addedAt: Timestamp
- updatedAt: Timestamp
```

### 2. `episodeProgress` (Progresso de Episódios)

```
Campos:
- userId: string
- mediaId: number
- seasonNumber: number
- episodeNumber: number
- watched: boolean
- watchedAt: Timestamp
```

### 3. `userLists` (Listas Personalizadas)

```
Campos:
- userId: string
- name: string
- description: string
- createdAt: Timestamp
- isDefault: boolean
```

---

## 🔐 Autenticação

**Método:** Email/Password

**Onde é usado:**

- `src/screens/Login/index.tsx`
- `src/screens/Cadastro/index.tsx`
- `src/screens/RecuperarSenha/index.tsx`
- `src/screens/Perfil/index.tsx`
- `src/services/userMedia.ts`

---

## ✅ Arquivo DELETADO

**❌ `src/FirebaseConnection.js`** (projeto antigo: voz-segura-1ab35)

- Este arquivo foi DELETADO para evitar confusão
- NÃO ERA USADO pelo app

---

## 🧪 Como Verificar se Está Salvando

1. **Faça login no app**
2. **Adicione um filme à lista**
3. **Acesse:** https://console.firebase.google.com/project/kingmidia-29f70/firestore/data
4. **Procure pela coleção `userMedia`**
5. **Deve aparecer documentos com seus filmes**

---

## 📊 Status Atual

- ✅ Configuração correta ativa
- ✅ Arquivo antigo deletado
- ✅ Auth configurado
- ✅ Firestore conectado
- ✅ Cache implementado

---

## 🔍 Troubleshooting

### Se não estiver salvando:

1. **Verifique as Regras do Firestore:**

   - Acesse: https://console.firebase.google.com/project/kingmidia-29f70/firestore/rules
   - Veja arquivo `OTIMIZACAO_FIREBASE.md` para regras corretas

2. **Verifique se está logado:**

   - O usuário precisa estar autenticado
   - `auth.currentUser` não pode ser null

3. **Observe os logs:**
   - Deve aparecer: `⏱️ [ADD] Salvo! Tempo: XXXms`
   - Se não aparecer, há um erro

---

## 💡 Dica

Para ver logs em tempo real:

```bash
# Terminal do Expo
npx expo start

# Observe os logs ao:
- Fazer login
- Adicionar filme
- Abrir "Minha Lista"
```
