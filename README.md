# Serviço Express + Gemini (Node.js / TypeScript)

Projeto em **Node.js + TypeScript** com **Express** que fornece um endpoint para enviar um `prompt` ao **Google Gemini** e retornar a resposta (preferencialmente em **JSON estruturado**).

---

## Pré-requisitos

- Node.js (LTS recomendado)
- Uma **API Key do Gemini**

---

## 1) Instalar dependências

```bash
npm install
```

---

## 2) Configurar variáveis de ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto (mesma pasta do `package.json`):

```env
ex:
VITE_API_BASE_URL=localhost ou local
VITE_PORT=porta desejada
```

> **Importante:** a aplicação usa `process.env.GEMINI_API_KEY` para autenticar no Gemini.

---

## 3) Rodar em desenvolvimento

```bash
npm run dev
```

---

## 4) Rodar produção

```bash
npm run prod
```

---

## 5) Endpoint

### `POST /perguntar`

**Body (JSON):**

```json
{
  "prompt": "me dê uma receita de arroz"
}
```

**Respostas possíveis:**

- Se o modelo retornar JSON válido: retorna `respostaJson`
- Caso contrário: retorna `respostaTexto`

---

## Como funciona (resumo)

- A rota `POST /perguntar` chama o Gemini (`MODEL = gemini-2.5-flash`).
- Existe **retry** para erros temporários (`429` e `503`).
- Há **timeout** de resposta por chamada.
- O texto retornado é tentado parsear como JSON de forma segura.

---

## Arquivos principais

- `src/index.ts`: inicializa o Express e monta as rotas
- `src/agent/gemini.service.ts`: lógica do endpoint `/perguntar` e integração com Gemini

