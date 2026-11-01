# 🤖 TechMate AI — Frontend

Aplicación web interactiva de tutor virtual bilingüe Inglés-Español con el robot animado **"Matey"**, diseñada para niños de 6 a 12 años.

## 🚀 Tecnologías

- **React 18** + **Vite**
- **Tailwind CSS** (tema infantil con fuentes Fredoka y Nunito)
- **Framer Motion** para animaciones interactivas del robot Matey y componentes
- **React Router DOM v6** para navegación SPA protegida
- **Axios** con interceptores para JWT
- **React Hot Toast** para notificaciones amigables
- **Web Speech API** (SpeechSynthesis) para ejercicios auditivos y pronunciación en inglés

## 📦 Estructura del Proyecto

- `src/components/matey/` — Robot interactivo Matey (SVG + animaciones CSS/Framer Motion) y bocadillos de diálogo
- `src/components/exercises/` — Componentes didácticos:
  - `FillBlank` — Completar espacios en blanco
  - `TranslateSentence` — Traducir oraciones
  - `OrderWords` — Ordenar palabras para construir oraciones
  - `ListenSelect` — Escuchar a Matey y seleccionar la opción correcta
  - `Dictation` — Dictado auditivo con repetición
- `src/components/gamification/` — Estrellas, racha diaria con fuego animado, medallas y popup de logros
- `src/pages/` — Home, Login, Register, Dashboard del niño, Catálogo de Lecciones, Reproductor de Lecciones, Perfil y Panel de Padres

## 🛠️ Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno (`.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=TechMate AI
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

