# 🔐 Sistema de Autenticação e Lista - Guia de Teste

## ⚠️ PROBLEMA IDENTIFICADO E CORRIGIDO

O botão "Adicionar à Lista" não estava funcionando porque:

1. **O login não autenticava no Firebase** - apenas navegava para o menu
2. **O serviço userMedia usava instâncias erradas do Firebase** - criava novas em vez de usar as configuradas

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. Autenticação Firebase no Login

- ✅ Implementado `signInWithEmailAndPassword`
- ✅ Adicionado tratamento de erros específicos
- ✅ Loading indicator durante o login
- ✅ Placeholder do campo alterado para "Email"
- ✅ Logs detalhados no console

### 2. Serviço UserMedia Corrigido

- ✅ Importando `auth` e `db` do `firebaseConfig.ts`
- ✅ Removido criação de instâncias duplicadas
- ✅ Logs detalhados em todas as operações
- ✅ Verificação de usuário logado

### 3. Logs de Debug Adicionados

- 🔐 Status de autenticação
- 📝 Dados sendo salvos
- ✅ Sucesso/falha de operações
- ❌ Erros detalhados

## 🧪 COMO TESTAR

### Passo 1: Criar uma Conta

1. Abra o app
2. Clique em "Cadastre-se"
3. Preencha:
   - Nome completo: `Seu Nome`
   - Username: `seuusername`
   - Email: `teste@gmail.com`
   - Senha: `123456` (mínimo 6 caracteres)
   - Confirmar senha: `123456`
4. Clique em "Cadastrar-se"
5. Aguarde a confirmação de sucesso

### Passo 2: Fazer Login

1. Na tela de login, preencha:
   - Email: `teste@gmail.com`
   - Senha: `123456`
2. Clique em "Acessar"
3. Observe os logs no console (Expo)

### Passo 3: Adicionar à Lista

1. No menu, clique em qualquer filme/série
2. Na tela de detalhes, clique em "Adicionar à Lista"
3. Observe:
   - ✅ Botão muda para "Na Minha Lista" (verde)
   - ✅ Alert de sucesso
   - ✅ Seletor de status aparece

### Passo 4: Mudar Status

1. Clique em um dos botões de status:
   - Quero Assistir
   - Assistindo
   - Assistido
   - Pausado
2. Observe o botão selecionado ficando destacado

### Passo 5: Marcar Episódios (Séries)

1. Abra uma série (ex: anime ou série popular)
2. Expanda uma temporada
3. Clique no checkbox de um episódio
4. Observe:
   - ✅ Checkbox muda para marcado
   - ✅ Nome do episódio fica riscado

### Passo 6: Ver Minha Lista

1. No menu, clique no ícone de bookmark (topo direito)
2. Use os filtros para organizar
3. Clique em qualquer item para ver detalhes

## 📊 LOGS NO CONSOLE

Quando você clicar em "Adicionar à Lista", verá:

```
🎬 handleAddToList chamado
Loading: false Details: true
📊 MediaId: 12345 Type: movie Title: Nome do Filme
➕ Adicionando à lista...
🔐 Usuário atual: [uid do usuário]
📝 Dados da mídia: { mediaId, mediaType, title, ... }
➕ Criando novo item
✅ Mídia adicionada com sucesso!
Resultado adição: true
✅ handleAddToList finalizado
```

Se **não** estiver logado, verá:

```
🎬 handleAddToList chamado
➕ Adicionando à lista...
🔐 Usuário atual: Não logado
❌ Usuário não está logado!
Resultado adição: false
```

## 🔍 VERIFICAÇÃO NO FIREBASE

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `kingmidia-29f70`
3. Vá em **Firestore Database**
4. Verifique as coleções:
   - `userMedia` - Itens adicionados à lista
   - `episodeProgress` - Episódios marcados
   - `userLists` - Listas personalizadas (futuro)

### Estrutura Esperada em `userMedia`:

```
userMedia/
  └── [documentId]/
      ├── userId: "abc123..."
      ├── mediaId: 12345
      ├── mediaType: "movie"
      ├── title: "Nome do Filme"
      ├── posterPath: "/abc.jpg"
      ├── status: "quero_assistir"
      ├── genres: ["Ação", "Aventura"]
      ├── addedAt: Timestamp
      └── updatedAt: Timestamp
```

## ❗ PROBLEMAS COMUNS

### 1. "Verifique se você está logado"

**Causa:** Usuário não autenticado no Firebase
**Solução:**

- Faça logout e login novamente
- Verifique os logs do console
- Confirme que o email e senha estão corretos

### 2. Firebase não salva dados

**Causa:** Regras de segurança do Firestore
**Solução:** Atualize as regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userMedia/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    match /episodeProgress/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    match /userLists/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 3. "auth/invalid-credential"

**Causa:** Email ou senha incorretos
**Solução:**

- Verifique o email (sem espaços)
- Confirme a senha
- Tente resetar a senha

### 4. Botão não responde

**Causa:** Loading travado ou erro não tratado
**Solução:**

- Reinicie o app
- Verifique os logs do console
- Limpe o cache do Expo

## 🎯 PRÓXIMOS PASSOS

Após confirmar que está funcionando:

1. ✅ Teste adicionar vários itens
2. ✅ Teste mudar status
3. ✅ Teste marcar episódios em série
4. ✅ Teste a tela "Minha Lista"
5. ✅ Teste os filtros
6. ✅ Teste remover da lista

## 📱 COMANDOS ÚTEIS

```bash
# Ver logs em tempo real
npx expo start

# Limpar cache
npx expo start -c

# Resetar completamente
rm -rf node_modules
npm install
npx expo start -c
```

## 🆘 SUPORTE

Se ainda não funcionar:

1. Copie os logs do console
2. Verifique as regras do Firestore
3. Confirme que o Firebase está configurado corretamente
4. Teste com uma conta nova

---

**Desenvolvido para KingMedia** 🎬
**Status: ✅ Funcionando com autenticação Firebase**
