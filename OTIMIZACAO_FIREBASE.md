# Otimização Firebase - Solução para Lentidão

## 🔥 PROBLEMA IDENTIFICADO

O app está lento porque:

1. ❌ Faz muitas queries ao Firestore
2. ❌ Queries compostas sem índices
3. ❌ Não usa cache efetivamente
4. ❌ Recarrega dados a cada operação

---

## ✅ SOLUÇÕES APLICADAS

### 1. Sistema de Cache Global

- Cache mantém dados por 1 minuto
- Adicionar/Remover atualiza cache instantaneamente
- getUserMedia usa cache primeiro

### 2. Regras do Firestore Corretas

Acesse: https://console.firebase.google.com/project/kingmidia-29f70/firestore/rules

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
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // userLists - Listas personalizadas
    match /userLists/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. Criar Índice Composto (IMPORTANTE!)

Acesse: https://console.firebase.google.com/project/kingmidia-29f70/firestore/indexes

Clique em **"Criar índice"** e configure:

**Índice 1:**

- Collection: `userMedia`
- Fields:
  - `userId` - Ascending
  - `mediaId` - Ascending
  - `mediaType` - Ascending
- Query scope: Collection

**Índice 2:**

- Collection: `episodeProgress`
- Fields:
  - `userId` - Ascending
  - `mediaId` - Ascending
  - `seasonNumber` - Ascending
  - `episodeNumber` - Ascending
- Query scope: Collection

---

## 🚀 TESTE APÓS CONFIGURAÇÃO

### Passos:

1. ✅ Configure as regras do Firestore
2. ✅ Crie os índices compostos
3. ⏱️ Aguarde 2-5 minutos para os índices serem criados
4. 🔄 Recarregue o app: pressione `r` no terminal

### Deve estar assim:

- ⚡ Adicionar à lista: < 1 segundo
- ⚡ Abrir "Minha Lista": < 1 segundo
- ⚡ Trocar filtros: Instantâneo

---

## 🔍 VERIFICAR SE FUNCIONOU

### No Console do Firebase:

1. Vá para: https://console.firebase.google.com/project/kingmidia-29f70/firestore/data
2. Veja se aparecem documentos em `userMedia`
3. Verifique se os índices estão com status "Enabled"

### No App:

```
Adicione um filme → Deve aparecer alert "✅ Sucesso"
Vá para "Minha Lista" → Deve aparecer instantaneamente
Arraste para baixo → Atualiza em < 1 segundo
```

---

## ⚠️ SE AINDA ESTIVER LENTO

### Verifique:

1. ✅ Regras do Firestore estão publicadas?
2. ✅ Índices estão criados e "Enabled"?
3. ✅ Internet está estável?
4. ✅ App foi recarregado após mudanças?

### Logs para Debug:

Se ainda estiver lento, me envie os logs que aparecem quando:

- Adiciona um filme
- Abre "Minha Lista"

---

## 📊 ESTRUTURA DE DADOS

### Collection: userMedia

```
{
  userId: string,
  mediaId: number,
  mediaType: "movie" | "tv",
  title: string,
  posterPath: string,
  status: "quero_assistir" | "assistindo" | "assistido" | "pausado",
  genres: string[],
  addedAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: episodeProgress

```
{
  userId: string,
  mediaId: number,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean,
  watchedAt: Timestamp
}
```

---

## 🎯 RESULTADO ESPERADO

**Antes:**

- ⏱️ Adicionar: 5-10 segundos
- ⏱️ Carregar lista: 5-10 segundos
- ⏱️ Trocar filtros: 3-5 segundos

**Depois:**

- ⚡ Adicionar: < 1 segundo
- ⚡ Carregar lista: < 1 segundo
- ⚡ Trocar filtros: Instantâneo

---

## 💡 DICAS

1. **Cache funciona por 1 minuto** - Se não ver atualizações, arraste para baixo para forçar reload
2. **Primeira vez sempre demora mais** - Carrega do Firestore e salva no cache
3. **Internet lenta afeta** - Cache ajuda mas primeira carga depende da internet

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Limpar cache do Expo
npx expo start -c

# Recarregar app
r (no terminal do Expo)

# Ver logs em tempo real
Observe o terminal enquanto usa o app
```
