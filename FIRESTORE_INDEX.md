# Criar Índice no Firestore para Melhorar Performance

## 🚀 SOLUÇÃO PARA LENTIDÃO

O app está lento porque o Firestore precisa de **índices compostos** para queries com múltiplos `where`.

## 📝 CRIAR ÍNDICE MANUALMENTE

### Opção 1: Via Console (Recomendado)

1. Acesse: https://console.firebase.google.com/project/kingmidia-29f70/firestore/indexes

2. Clique em **"Criar índice"** (Create Index)

3. Preencha:

   - **Collection ID**: `userMedia`
   - **Fields to index**:
     - Campo 1: `userId` → Ascending
     - Campo 2: `mediaId` → Ascending
     - Campo 3: `mediaType` → Ascending
   - **Query scope**: Collection

4. Clique em **"Criar"** (Create)

5. Aguarde 2-5 minutos para o índice ser criado

### Opção 2: Via firestore.indexes.json

Crie um arquivo `firestore.indexes.json` na raiz do projeto:

```json
{
  "indexes": [
    {
      "collectionGroup": "userMedia",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "mediaId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "mediaType",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "episodeProgress",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "mediaId",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Depois execute:

```bash
firebase deploy --only firestore:indexes
```

## ⚡ ALTERNATIVA RÁPIDA (JÁ IMPLEMENTADA)

Já otimizei o código para:

- ✅ Não fazer verificação duplicada antes de adicionar
- ✅ Remover todos os console.logs que deixavam lento
- ✅ Query simples sem filtros compostos
- ✅ Filtros aplicados no lado do cliente

**Teste agora! Deve estar bem mais rápido! 🚀**

## 🧪 TESTAR

1. Recarregue o app (pressione `r` no terminal)
2. Adicione um filme/série
3. Vá para "Minha Lista"
4. Deve aparecer instantaneamente!

Se ainda estiver lento, crie o índice manualmente usando a Opção 1.
