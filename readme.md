# 🍳 Culinary AI Assistant

Assistente culinário inteligente desenvolvido para estudo de Arquitetura de Software, Inteligência Artificial Generativa, Engenharia de Prompt e Desenvolvimento Full Stack.

---

# Objetivo

Criar um assistente especializado em culinária capaz de:

* Gerar receitas personalizadas
* Criar receitas com ingredientes disponíveis
* Sugerir ingredientes complementares
* Gerar listas de compras
* Converter medidas culinárias
* Fornecer informações nutricionais
* Adaptar receitas para:

  * Vegetarianos
  * Veganos
  * Fitness
  * Restrições alimentares

O agente deve atuar exclusivamente no domínio culinário.

Perguntas fora do contexto gastronômico devem ser recusadas educadamente.

---

# Stack Tecnológica

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Zod
* JWT
* Session
* Docker

## Frontend

* React
* TypeScript

## Inteligência Artificial

* Gemini API

---

# Arquitetura Geral

```text
Frontend React
      │
      ▼
Express API
      │
      ▼
Camada de Regras
      │
      ▼
Prompt Builder
      │
      ▼
Gemini API
      │
      ▼
Resposta Estruturada JSON
```

---

# Arquitetura do Agente

O agente será composto por três camadas.

## 1. Prompt System

Responsável por definir:

* Personalidade do agente
* Escopo culinário
* Formato de saída
* Regras de segurança

---

## 2. Camada de Regras

Valida:

* Domínio da pergunta
* Contexto do usuário
* Preferências alimentares
* Estrutura esperada da resposta

---

## 3. Ferramentas (Tools)

Ferramentas planejadas:

### Receita por ingredientes

Entrada:

```json
{
  "ingredients": [
    "arroz",
    "frango"
  ]
}
```

---

### Lista de compras

Entrada:

```json
{
  "recipe": "Lasanha"
}
```

---

### Conversor culinário

Entrada:

```json
{
  "from": "xícara",
  "to": "gramas",
  "value": 2
}
```

---

# Funcionalidades

## Conversas

* Histórico persistente
* Múltiplos chats por usuário
* Título automático dos chats
* Contexto por conversa

---

## Receitas

* Receita por ingredientes
* Sugestão de ingredientes
* Receitas fitness
* Receitas vegetarianas
* Receitas veganas
* Receitas por tempo disponível
* Informações nutricionais
* Lista de compras

---

# Gerenciamento de Contexto

## Estratégia

Janela dinâmica baseada em tokens.

---

## Quando o contexto crescer

O sistema deverá:

1. Resumir mensagens antigas
2. Salvar o resumo no banco
3. Utilizar o resumo como memória de longo prazo

Exemplo:

```text
Usuário prefere receitas fitness.

Evita lactose.

Costuma cozinhar refeições rápidas.
```

---

# Memória do Usuário

O sistema poderá armazenar preferências.

Exemplos:

* Vegetariano
* Vegano
* Intolerância à lactose
* Sem glúten
* Receitas fitness
* Receitas rápidas

---

# Atualização Automática de Preferências

O agente poderá detectar informações relevantes.

Exemplo:

```text
Sou intolerante à lactose.
```

O sistema poderá atualizar automaticamente o perfil alimentar do usuário.

---

# Estrutura do Banco de Dados

## User

```text
id
name
email
password_hash
created_at
updated_at
```

---

## Session

```text
id
user_id
token
expires_at
created_at
```

---

## Chat

```text
id
user_id
title
summary
created_at
updated_at
```

---

## Message

```text
id
chat_id
role
content
created_at
```

Role:

```text
user
assistant
system
```

---

## UserPreference

```text
id
user_id
key
value
created_at
```

Exemplo:

```text
diet = vegetarian
lactose = true
fitness = true
```

---

# Fluxo de Conversação

```text
Usuário
    │
    ▼
Mensagem
    │
    ▼
Busca histórico
    │
    ▼
Busca preferências
    │
    ▼
Monta contexto
    │
    ▼
Gemini
    │
    ▼
Resposta JSON
    │
    ▼
Salvar histórico
```

---

# Estrutura de Resposta

Todas as respostas da IA deverão retornar JSON.

Exemplo:

```json
{
  "title": "Arroz com Frango Cremoso",
  "ingredients": [
    "2 xícaras de arroz",
    "300g de frango"
  ],
  "instructions": [
    "Cozinhe o arroz",
    "Prepare o frango"
  ],
  "time": "30 minutos",
  "servings": 4
}
```

---

# Segurança

## Autenticação

* JWT
* Session

---

## Autorização

Todo chat deve pertencer a um usuário.

Validação obrigatória:

```text
chat.userId === authenticatedUser.id
```

---

# Docker

Serviços previstos:

```yaml
backend
frontend
postgres
```

---

# Variáveis de Ambiente

```env
DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=

PORT=
```

---

# Roadmap Futuro

## IA

* Streaming de respostas
* Memória avançada
* Multiagentes
* Planejamento alimentar semanal

---

## Ferramentas

* API nutricional
* API de preços
* API de supermercados

---

## Produto

* Plano gratuito
* Plano premium
* Dashboard administrativo
* Métricas de uso

---

# Objetivos de Aprendizado

* Inteligência Artificial Generativa
* Engenharia de Prompt
* Arquitetura Backend
* Modelagem de Banco de Dados
* Prisma ORM
* Docker
* APIs REST
* React
* TypeScript
* Sistemas Conversacionais
* Desenvolvimento de SaaS
* Construção de Portfólio Profissional

---
