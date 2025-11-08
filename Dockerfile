FROM node:lts-alpine
WORKDIR /app

# Habilitar corepack e configurar Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copiar arquivos de dependências
COPY package.json yarn.lock .yarnrc.yml ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar Prisma Client e fazer build
RUN yarn prisma generate && yarn build

# Expor porta
EXPOSE 8080

# Comando de inicialização
CMD ["node", "dist/server.js"]