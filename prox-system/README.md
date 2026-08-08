# Prox System

Plataforma web editable en tiempo real desde un panel de administración sin código.
Tú (agente) controlas todo el contenido desde `/admin`; tus usuarios ven el sitio público
(computadora, celular, o instalado como app — PWA) actualizarse al instante, sin recargar.

---

## 1. Crear el proyecto en Supabase (gratis)

1. Ve a https://supabase.com y crea una cuenta / inicia sesión.
2. Clic en **New Project**. Elige un nombre (ej. `prox-system`), una contraseña de base de datos
   (guárdala) y la región más cercana a tus usuarios.
3. Espera 1-2 minutos a que se aprovisione.
4. Ve a **SQL Editor** → **New query**, abre el archivo `supabase/schema.sql` de este proyecto,
   copia TODO su contenido, pégalo ahí y dale **Run**. Esto crea todas las tablas, seguridad y
   permisos automáticamente.
5. Ve a **Storage** en el menú lateral y confirma que exista el bucket **`images`** (lo crea
   automáticamente el script SQL del paso 4).
6. Ve a **Project Settings → API**. Copia:
   - `Project URL`
   - `anon public` key

## 2. Configurar el envío real de correos (restablecer contraseña)

Supabase ya envía correos de confirmación y recuperación de contraseña de forma **real** por
defecto (con su servidor compartido), suficiente para empezar. Para producción con tu propio
dominio de correo (recomendado, más confiable y profesional):

1. En Supabase: **Authentication → Emails → SMTP Settings**.
2. Activa **Enable Custom SMTP** y conecta un proveedor real, por ejemplo:
   - **Resend** (recomendado, gratis hasta 3,000 correos/mes): crea cuenta en resend.com,
     verifica tu dominio, genera una API key, y úsala como credencial SMTP
     (`smtp.resend.com`, usuario `resend`, contraseña = tu API key).
   - O tu Gmail vía **SMTP** (`smtp.gmail.com`, puerto 587, con una "contraseña de aplicación"
     generada desde la seguridad de tu cuenta de Google).
3. En **Authentication → URL Configuration**, agrega la URL de tu sitio en Vercel (paso 4) como
   **Site URL** y en **Redirect URLs** agrega `https://tu-dominio.vercel.app/update-password`.

Con esto, "Olvidé mi contraseña" en el sitio manda un correo real con un enlace seguro que
lleva al usuario a crear una nueva contraseña — sin simulaciones.

## 3. Configurar variables de entorno locales

```bash
cp .env.example .env.local
```

Edita `.env.local` y pega tu `Project URL` y `anon public key` de Supabase.

## 4. Subir a GitHub y desplegar en Vercel

```bash
git init
git add .
git commit -m "Prox System inicial"
```

1. Crea un repositorio nuevo en https://github.com/new (puede ser privado) y sigue las
   instrucciones para conectarlo (`git remote add origin ...` y `git push`).
2. Ve a https://vercel.com, inicia sesión con tu cuenta de GitHub, clic en **Add New → Project**,
   selecciona el repositorio `prox-system`.
3. En **Environment Variables**, agrega las mismas dos variables de tu `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y opcionalmente
   `NEXT_PUBLIC_SITE_URL` con tu dominio final.
4. Clic en **Deploy**. En ~1 minuto tu sitio está en vivo en `https://tu-proyecto.vercel.app`.
5. Regresa a Supabase → **Authentication → URL Configuration** y confirma que la URL de Vercel
   esté puesta ahí (paso 2.3), o el enlace de recuperación de contraseña no funcionará.

Cada vez que hagas `git push`, Vercel vuelve a desplegar automáticamente.

## 5. Crear tu usuario administrador

1. Entra a tu sitio desplegado y ve a `/register`.
2. Regístrate con: `ortunoivan2000@gmail.com` — el sistema te reconoce automáticamente como
   **administrador** (está configurado en `supabase/schema.sql`) y te da acceso a `/admin`.
3. Confirma tu correo (te llega un email real de Supabase) y vuelve a iniciar sesión.
4. Entra a `/admin` **desde una computadora** (el panel es solo de escritorio, como pediste).

## 6. Cómo funciona el panel (sin programar nada)

- **Páginas**: crea cuantas páginas quieras (`/admin`). Arrastra `⠿⠿` para ordenarlas, y decide
  con el botón **"☰ En menú"** si aparecen en el menú de navegación del sitio público.
- **Bloques**: dentro de cada página, agrega tarjetas, textos (con **negrita, cursiva, listas y
  enlaces** desde el editor), botones, imágenes, formularios, entradas de texto o notificaciones.
  Arrastra `⠿⠿` para reordenarlos.
- **Imágenes**: en el bloque de imagen puedes **subir un archivo real** desde tu computadora
  (se guarda en Supabase Storage) o pegar una URL.
- **Colores y visibilidad**: cada bloque puede tener un color y mostrarse a **todos**, a un
  **grupo** (ej. "vip") o a **un usuario específico**.
- **Apariencia** (`/admin/appearance`): cambia el color principal y la tipografía de **todo el
  sitio** al instante, para todos los usuarios.
- **Historial / Deshacer**: dentro de cada página, el botón **"🕓 Historial / Deshacer"** guarda
  automáticamente una versión cada vez que agregas, editas, borras o reordenas un bloque, y te
  deja restaurar cualquier versión anterior con un clic.
- **Tiempo real**: en cuanto guardas un cambio, todos los usuarios que estén viendo esa página lo
  ven al instante, sin recargar (usa Supabase Realtime).
- **Respuestas**: lo que los usuarios escriben en formularios o entradas de texto llega a
  `/admin/submissions`.
- **Usuarios**: en `/admin/users` puedes asignar el "grupo" de cada usuario.

## 7. Desarrollo local (opcional)

```bash
npm install
npm run dev
```

Abre http://localhost:3000

---

### Notas técnicas
- Stack: Next.js 14 (App Router) + Supabase (Postgres, Auth, Realtime) + Tailwind CSS.
- Seguridad: Row Level Security en Postgres — cada usuario solo puede leer lo que le corresponde,
  reforzado a nivel de base de datos (no solo en el frontend).
- PWA: manifest y service worker incluidos (`next-pwa`) — en el celular, el usuario puede
  "Agregar a pantalla de inicio" para usarla como app.
