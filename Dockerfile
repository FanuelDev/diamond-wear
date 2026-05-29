# Dockerfile
# ─────────────────────────────────────────────────────────────────────────────
# Build Angular 21 en mode production + Nginx pour servir les fichiers statiques
# ─────────────────────────────────────────────────────────────────────────────

# ── Étape 1 : Build Angular ───────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copie package.json en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci --prefer-offline

# Copie le reste des sources et build en production
COPY . .
RUN npm run build

# ── Étape 2 : Nginx ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Copie les fichiers buildés (Angular application builder → dist/diamond-wear/browser)
COPY --from=builder /app/dist/diamond-wear/browser /usr/share/nginx/html

# Configuration Nginx : SPA routing + gzip + cache
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
