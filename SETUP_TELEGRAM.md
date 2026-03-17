# 🤖 Guía de Configuración - Telegram Bot

## Paso 1: Crear el Bot con BotFather

### 1.1 Abrir Telegram
1. Abre la app de Telegram
2. Busca **@BotFather** en la búsqueda
3. Inicia el chat con el bot

### 1.2 Crear Nuevo Bot
1. Escribe el comando **`/newbot`**
2. BotFather te preguntará el nombre de tu bot:
   ```
   Ok, let's create a new bot. Please choose a name for your bot.

   🤖 Bot name: MagoryaBot
   ```
3. Escribe: **`MagoryaBot`** (o el nombre que quieras)

### 1.3 Elegir Usuario del Bot
1. BotFather te pedirá un username (termina en "bot"):
   ```
   Good. Now let's choose a username for your bot. It must end in `bot`. Like `TetrisBot` or `Tetris_gamebot`.

   🤖 Username: @MagoryaBot
   ```
2. Escribe: **`@MagoryaBot`** (debe estar disponible)
3. Si el nombre ya está en uso, te pedirá otro

### 1.4 Obtener Token
1. BotFather te dará el **API Token**:
   ```
   Access token: 7364183422:AAGjkl_3jiDJFKJ2hKFJSdhfLKJsdflkj
   ```
2. **COPIA ESTE TOKEN** - Lo necesitarás para configurar Magorya

> ⚠️ **IMPORTANTE**: Guarda este token de forma segura. Cualquiera con acceso a tu bot puede usarlo.

---

## Paso 2: Configurar Variables de Entorno

Agrega a tu archivo `.env.local`:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=7364183422:AAGjkl_3jiDJFKJ2hKFJSdhfLKJsdflkj
```

### Para Producción

Si vas a deployar a Vercel u otro hosting:
- Agrega la variable en el panel del hosting
- NO incluyas `.env.local` en el repo (ya está en `.gitignore`)

---

## Paso 3: Configurar Webhook (Opcional para Desarrollo)

El webhook ya está implementado en:
```
https://tudominio.com/api/telegram/webhook
```

### 3.1 Configurar Webhook Manualmente (Opcional)

Si quieres configurar el webhook manualmente:

1. **Obtener la URL de webhook**:
   - Desarrollo: `https://tudominio.com/api/telegram/webhook`
   - Local (con ngrok): `https://tu-ngrok-url.ngrok.io/api/telegram/webhook`

2. **Enviar comando a BotFather**:
   ```
   /setwebhook
   ```

3. **Ingresar la URL** cuando te la pida

### 3.2 Verificar Webhook
```
/getwebhookinfo
```

Esto te mostrará la URL actual del webhook y si está funcionando.

---

## Paso 4: Probar el Bot

### 4.1 Buscar tu Bot en Telegram
1. En la búsqueda de Telegram, escribe: `@MagoryaBot` (o el nombre que elegiste)
2. Click en **START** (o escribe `/start`)

### 4.2 Comandos Disponibles

Escribe estos comandos para probar:

| Comando | Descripción |
|---------|-------------|
| `/start` | Inicia el bot y muestra bienvenida |
| `/ayuda` | Muestra todos los comandos disponibles |
| `/google` | Abre menú de Google Workspace |
| `/calendario` | Ver eventos del calendario |
| `/emails` | Ver emails recientes |
| `/archivos` | Ver archivos de Drive |
| `/proyectos` | Ver proyectos de Magorya |

### 4.3 Chat Natural

También puedes escribir directamente:

```
¡Hola!
¿Qué onda?
Necesito un consejo
Ver mi calendario
Enviar email a juan@gmail.com
Mis archivos
Crear documento Notas
```

---

## 🚀 Paso 5: Configurar para Producción

### 5.1 Deploy del Código

Si aún no has hecho deploy:

```bash
npm run build
vercel
```

### 5.2 Configurar Webhook de Producción

1. **Obtener tu URL de producción**:
   - Vercel: `https://tu-app.vercel.app/api/telegram/webhook`
   - Otro hosting: tu dominio

2. **Configurar webhook en BotFather**:
   ```
   /setwebhook
   ```
   Ingresa: `https://tu-app.vercel.app/api/telegram/webhook`

3. **Verificar**:
   ```
   /getwebhookinfo
   ```

Deberías ver:
```
Webhook URL: https://tu-app.vercel.app/api/telegram/webhook
Has custom webhook: Yes
```

---

## 🔧 Troubleshooting

### Bot no responde
**Problema**: El bot no responde a tus mensajes

**Soluciones**:
1. Verifica que `TELEGRAM_BOT_TOKEN` es correcto en `.env.local`
2. Reinicia el servidor de desarrollo
3. Verifica que el servidor esté corriendo: `npm run dev`
4. Revisa los logs del servidor para errores

### Error: "Webhook already in use"
**Problema**: Ya hay un webhook configurado

**Solución**:
```
/deletebot
/newbot
```
O elimina el webhook:
```
/setwebhook
```
(deja la URL vacía y presiona Enter)

### Error: "Bad Request: webhook URL is not well formed"
**Problema**: La URL del webhook es incorrecta

**Solución**:
- Asegúrate que la URL comienza con `https://`
- Verifica que la URL termina con `/api/telegram/webhook`
- No incluyas espacios ni caracteres especiales

### Error: "Conflict: can't use same webhook"
**Problema**: Ya hay un webhook configurado

**Solución**:
```
/setwebhook
```
(Limpia la URL y presiona Enter para desactivar)
Luego configura el nuevo webhook.

---

## 📖 Recursos Útiles

- [@BotFather](https://t.me/BotFather) - Crear y configurar bots
- [Telegram Bot API](https://core.telegram.org/bots/api) - Documentación oficial
- [Telegram Bots Guía](https://core.telegram.org/bots/features) - Características de bots

---

## ✅ Checklist Antes de Producción

- [ ] Bot creado con @BotFather
- [ ] Token copiado y guardado en `.env.local`
- [ ] Bot probado manualmente con `/start`
- [ ] Webhook configurado (si aplica)
- [ ] Comandos probados (/ayuda, /google, etc.)
- [ ] Chat natural probado
- [ ] Integración con Google Workspace probada
- [ ] Deploy del código completado
- [ ] Variables de entorno configuradas en hosting

---

## 🎨 Personalizar el Bot

### Cambiar Descripción del Bot
```
/setdescription
```

Escribe una descripción:
```
Asistente mágica con Google Workspace ✨
Te ayudo con calendario, emails, archivos y más 💛
```

### Cambiar Foto de Perfil
```
/setuserpic
```
Sube una imagen desde tu galería.

### Cambiar Comandos
```
/setcommands
```
Te mostrará los comandos actuales. Para personalizar:
```
start - Iniciar Magorya 🧚‍♀️
ayuda - Ver ayuda ℹ️
google - Google Workspace 🔗
```

---

¿Tu bot está listo? 🚀

¿Necesitas ayuda con algún paso específico?
