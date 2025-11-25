# Configurar Regras do Firestore

## ❗ PROBLEMA ATUAL

O app está travando ao tentar ler dados do Firestore porque as regras de segurança estão bloqueando o acesso.

## 🔧 SOLUÇÃO

### Passo 1: Acessar Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **kingmidia-29f70**

### Passo 2: Configurar Regras do Firestore

1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Regras" (Rules)**
3. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Regras para coleção userMedia
    match /userMedia/{docId} {
      // Permitir criar se o userId do documento for igual ao usuário logado
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;

      // Permitir ler apenas se o userId do documento for igual ao usuário logado
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;

      // Permitir atualizar apenas se o userId do documento for igual ao usuário logado
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;

      // Permitir deletar apenas se o userId do documento for igual ao usuário logado
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Regras para coleção episodeProgress
    match /episodeProgress/{docId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Regras para coleção userLists
    match /userLists/{docId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Bloquear tudo que não foi especificado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Passo 3: Publicar as Regras

1. Clique no botão **"Publicar"** (Publish)
2. Aguarde a confirmação

### Passo 4: Testar o App

1. **Feche e reabra o app**
2. Faça login novamente
3. Adicione um filme/série à lista
4. Acesse "Minha Lista"
5. Os itens devem aparecer agora! ✅

## 🔍 EXPLICAÇÃO DAS REGRAS

### O que as regras fazem:

- ✅ **Usuário logado**: Só usuários autenticados podem acessar
- ✅ **Dados próprios**: Cada usuário só vê seus próprios dados
- ✅ **Proteção**: Impede que um usuário veja/edite dados de outro
- ✅ **CRUD completo**: Create, Read, Update, Delete permitidos

### Segurança:

- `request.auth != null` → Verifica se está logado
- `resource.data.userId == request.auth.uid` → Verifica se o userId do documento é igual ao userId do usuário logado
- `request.resource.data.userId == request.auth.uid` → Verifica se o userId do novo documento é igual ao userId do usuário logado (para CREATE)

## ⚠️ ALTERNATIVA TEMPORÁRIA (APENAS PARA TESTES)

Se você só quer testar rapidamente, pode usar regras abertas (NÃO RECOMENDADO PARA PRODUÇÃO):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**IMPORTANTE**: Essas regras permitem que qualquer usuário logado acesse TODOS os dados. Use apenas para testes!

## 📝 DEPOIS DE CONFIGURAR

Teste no app:

1. Limpe o cache: `npx expo start -c`
2. Faça login
3. Adicione itens
4. Verifique se aparecem em "Minha Lista"

Se os logs mostrarem:

```
✅ getDocs concluído!
📊 Total de documentos encontrados: X
```

Está funcionando! 🎉
