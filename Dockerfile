# Usa imagem leve com Node 20
FROM node:20-alpine

# =======================================
# 1️⃣ Dependências do sistema
# =======================================
# Adiciona pacotes nativos pra build + openldap-clients (pra testes AD)
RUN apk add --no-cache 


# =======================================
# 2️⃣ Diretório de trabalho
# =======================================
WORKDIR /server

# =======================================
# 3️⃣ Instala dependências Node
# =======================================
# Copia manifests primeiro (pra aproveitar cache do Docker)
COPY package*.json ./

# Instala dependências, incluindo ldapjs e mssql (se ainda não tiver)
#RUN npm install ldapjs mssql dotenv && npm install

# =======================================
# 4️⃣ Copia código do backend
# =======================================
COPY / .

# =======================================
# 5️⃣ Porta e execução
# =======================================
EXPOSE 3001

CMD ["npm", "run", "dev"]