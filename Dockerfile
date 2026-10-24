# Çok aşamalı build: çalışma imajında yalnızca Next.js standalone çıktısı (+ static, public, content) bulunur.
# Railway servis değişkenleri Dockerfile build'ine yalnızca ARG olarak tanımlıysa geçer;
# statik sayfalara gömülen değerler (NEXT_PUBLIC_*, bayraklar) bu yüzden aşağıda listelidir. Sır buraya eklenmez.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GA_ID
ARG GOOGLE_SITE_VERIFICATION
ARG AI_ORCHESTRATOR_ENABLED
ARG AI_MINI_AUDIT_ENABLED
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION \
    AI_ORCHESTRATOR_ENABLED=$AI_ORCHESTRATOR_ENABLED \
    AI_MINI_AUDIT_ENABLED=$AI_MINI_AUDIT_ENABLED \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content
EXPOSE 3000
CMD ["node", "server.js"]
