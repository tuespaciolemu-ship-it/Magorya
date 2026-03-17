# 🔧 Guía de Configuración - Google Workspace

## Paso 1: Google Cloud Console - Activar Billing

### 1.1 Ir a Google Cloud Console
- Abre: https://console.cloud.google.com/

### 1.2 Crear o Seleccionar Proyecto
- Crea un nuevo proyecto llamado "Magorya"
- Anota el **Project ID** (se usa internamente)

### 1.3 Activar Billing (Facturación)
1. En el menú izquierdo, busca **"Billing"** (o "Facturación")
2. Click en **"ACTIVAR LA FACTURACIÓN"** (botón azul grande)
3. Selecciona **"Crear una cuenta de facturación"**
4. Llena los datos:
   - **Tipo de cuenta**: Personal o Business
   - **Nombre y dirección**: Tus datos reales
   - **Método de pago**: Tarjeta de crédito/débito
5. Selecciona un plan:
   - **Plan de prueba**: $300 USD en crédito gratis (durante 90 días)
   - **Plan pago**: Solo se cobra lo que uses del crédito

> 💡 **Nota**: Con el plan de prueba de $300 puedes usar las APIs GRATIS durante 3 meses sin costo (si no excedes el crédito).

### 1.4 Verificar que el billing esté activo
- Deberías ver un ícono de check verde ✅ junto a "Billing" en el menú

---

## Paso 2: Configurar OAuth 2.0

### 2.1 Configurar Pantalla de Consentimiento
1. Ve a **"APIs & Services"** → **"Credentials"**
2. Si pide configurar la pantalla de consentimiento:
   - Click en **"CONFIGURE PANTALLA DE CONSENTIMIENTO"**
   - **Tipo de usuario**: External
   - **Información de la aplicación**:
     - **Nombre de la app**: Magorya
     - **Email de soporte**: tu@email.com
     - **Logotipo** (opcional): Puedes subir una imagen después
   - **Dominios autorizados**: (opcional por ahora)
   - **Datos de contacto del desarrollador**: tu email
   - Click en **"GUARDAR Y CONTINUAR"**

### 2.2 Crear Credenciales OAuth 2.0
1. En **"APIs & Services"** → **"Credentials"**
2. Click en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Tipo de aplicación**: Web application
4. **Nombre**: Magorya Web Client
5. **Authorized JavaScript origins** (origenes JS autorizados):
   ```
   http://localhost:3000
   https://tudominio.com
   ```
6. **Authorized redirect URIs** (URIs de redirección autorizadas):
   ```
   http://localhost:3000/api/auth/google/callback
   https://tudominio.com/api/auth/google/callback
   ```
7. Click en **"Create"**

### 2.3 Copiar Credenciales
Se mostrará un diálogo con:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx` (click en "SHOW" para verlo)

> 💾 **GUARDA ESTAS CREDENCIALES** - Las necesitarás para `.env.local`

---

## Paso 3: Habilitar APIs de Google

Ve a **"APIs & Services"** → **"Library"** y habilita las siguientes APIs:

| API | Buscar | Habilitar |
|-----|-------|----------|
| **Calendar API** | "Google Calendar API" | ✅ Click en "HABILITAR" |
| **Gmail API** | "Gmail API" | ✅ Click en "HABILITAR" |
| **Drive API** | "Google Drive API" | ✅ Click en "HABILITAR" |
| **Docs API** | "Google Docs API" | ✅ Click en "HABILITAR" |
| **Sheets API** | "Google Sheets API" | ✅ Click en "HABILITAR" |

Para cada API:
1. Busca el nombre en la barra de búsqueda
2. Click en el resultado
3. Click en el botón **"HABILITAR"**
4. Espera a que aparezca el check ✅

---

## Paso 4: Configurar Variables de Entorno

Agrega a tu archivo `.env.local`:

```bash
# Google Workspace OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret

# URLs de redirección (production vs development)
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
# Para producción:
# NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://tudominio.com/api/auth/google/callback
```

### Verificar Configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. En el chat de Magorya, click en el botón 🔗 (Google Workspace)

3. Se abrirá una ventana de Google para autorizar

4. Autoriza las permisos solicitadas

5. ¡Listo! Google Workspace estará conectado ✅

---

## Paso 5: Probar Integración

Una vez conectado, prueba estos comandos en el chat:

```
📅 Calendario:
   "ver calendario"
   "crear evento Reunión mañana a las 10"

📧 Gmail:
   "ver emails"
   "enviar email a juan@gmail.com"

📁 Drive:
   "ver mis archivos"
   "buscar archivos fotos"

📝 Docs:
   "crear documento Notas de trabajo"

📊 Sheets:
   "crear hoja Presupuesto 2024"
```

---

## 🚨 Solución de Problemas

### Error: "Error al obtener token"
- **Solución**: Verifica que NEXT_PUBLIC_GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET son correctos
- **Solución**: Asegúrate de que el redirect URI coincide con el configurado en Google Console

### Error: "Access blocked: Organization policy"
- **Solución**: Tu organización de Google Workspace bloquea el acceso
- **Solución**: Contacta al administrador de tu dominio Google Workspace

### Error: "API key expired"
- **Solución**: El token de access expira cada 1 hora
- **Solución**: El código automáticamente renueva el token con refresh_token

### Error: "Insufficient Permission"
- **Solución**: No habilitaste una API
- **Solución**: Ve a APIs & Services → Library y habilita la API que falte

---

## 📖 Recursos Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 para Google Workspace](https://developers.google.com/workspace/guides/create-credentials)
- [API de Calendar](https://developers.google.com/calendar)
- [API de Gmail](https://developers.google.com/gmail)
- [API de Drive](https://developers.google.com/drive)
- [API de Docs](https://developers.google.com/docs)
- [API de Sheets](https://developers.google.com/sheets)

---

## ✅ Checklist Antes de Deploy a Producción

- [ ] Billing activado en Google Cloud
- [ ] OAuth 2.0 credentials creadas
- [ ] Todas las APIs habilitadas (Calendar, Gmail, Drive, Docs, Sheets)
- [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID configurado
- [ ] GOOGLE_CLIENT_SECRET configurado
- [ ] NEXT_PUBLIC_GOOGLE_REDIRECT_URI apunta a tu dominio de producción
- [ ] Probado en localhost con éxito
- [ ] Dominio de producción verificado en Google Console

---

¿Necesitas ayuda con algún paso específico?
