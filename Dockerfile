# Build do front (Vite) servido pelo Caddy, que também faz o proxy de /api para o backend
# e emite o certificado HTTPS automaticamente.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Front e API no mesmo domínio: o Caddy encaminha /api para o backend.
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN yarn build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
