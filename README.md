Eres el experto de negocio de miniworker.

Dime las tareas necesarias para lo siguiente

1. Debe desarrollar un MVP de miniworker. Consiste en simular la interacción de estudiantes de universidad con "agentes" con problemas en un nicho especifico. Estos problemas deben ser tecnologicos, de automatización, mejora de procesos, innovación, sociales, etc... Los agentes serán impulsados por AI, es decir, los estudiantes hablaran con la AI (agente) para encontrar el problema del agente y propondran soluciones
2. La app debe ser capaz de requerir avances del proyecto, como links, presentaciones, documentos, etc.. Según sea la personalidad del agente y la importancia del proyecto
3. La app debe ser capaz de gestionar una linea de tiempo, permitiendo así el buen manejo del proyecto, y si no se tienen entregas para satisfacer al agente, entonces será una mala calificación.
4. La calificación será en una malla de araña, en donde se deben poner los aspectos fundamentales de un estudiante de ingenieria de software y medir que tan bueno es o no.
5. La calificación será entregada al docente y al estudiante a través de un PDF en donde al docente se expone el desempeño del estudiante y al estudiante se expone lo mismo mas feedback de mejora con accionables.
6. Debe gestionar permisos de profesor, alumno, admin
7. La UI debe ser minimalista, como si fuera un sitio web de primer mundo
8. Debe ser desarrollado el backend con TS y el front con VUE
9. Recuerda que es un MVP, entonces enfocate en las cosas que como experto de negocio consideres importante

## Configuración de la Base de Datos con Docker

El proyecto incluye archivos de configuración para ejecutar PostgreSQL en un contenedor Docker, lo que facilita la configuración del entorno de desarrollo.

### Requisitos previos
- Docker y Docker Compose instalados en tu sistema

### Instrucciones de uso

1. Copia el archivo `.env.example` a `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```

2. Inicia los servicios con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Los servicios disponibles son:
   - **PostgreSQL**: Accesible en `localhost:5432`
   - **pgAdmin**: Accesible en `localhost:5050` (credenciales: admin@miniworker.com / admin)

4. Para detener los servicios:
   ```bash
   docker-compose down
   ```

5. Para detener los servicios y eliminar los volúmenes (esto borrará todos los datos):
   ```bash
   docker-compose down -v
   ```

### Conexión desde el backend

Para que el backend se conecte a la base de datos, modifica el archivo `backend/.env` y cambia:
```
DB_HOST=postgres
```

## Configuración de OpenAI API Key

La aplicación utiliza OpenAI para impulsar los agentes de IA. Para configurar la API key:

1. **Usando el script de configuración**:
   ```bash
   ./setup-openai.sh
   ```
   El script te solicitará tu API key y la configurará automáticamente en los archivos necesarios.

2. **Configuración manual**:
   - Edita el archivo `backend/.env` y actualiza:
     ```
     OPENAI_API_KEY=tu_api_key_aquí
     ```
   - También actualiza el archivo `.env` en la raíz del proyecto si vas a utilizar Docker.

### Seguridad de la API Key

- No compartas tu API key de OpenAI ni la subas a repositorios públicos.
- Los archivos `.env` ya están incluidos en `.gitignore` para evitar que se suban accidentalmente.
- En entornos de producción, considera utilizar servicios de administración de secretos.

FASE 1: Planificación y Diseño
✅ Definir el modelo de interacción

Especificar cómo los estudiantes se comunican con los agentes AI (chat, voz, formularios guiados).
Determinar los tipos de problemas que los agentes pueden tener (automatización, innovación, sociales, etc.).
Establecer reglas para validar si una solución es aceptable o no.
✅ Diseñar los roles y permisos

Alumno: Interactúa con el agente AI, sube entregables, recibe feedback.
Profesor: Supervisa, califica, recibe reportes en PDF.
Admin: Gestiona la plataforma, configura agentes y problemas.
✅ Definir la estructura de calificación

Crear una malla de araña con criterios clave para medir desempeño.
Establecer métricas como creatividad, viabilidad técnica, comunicación, documentación, impacto, etc.
✅ Definir la UI/UX

- Estilo minimalista, profesional y moderno.
- Diseño de la línea de tiempo de proyectos.
- Experiencia fluida en desktop y móvil.


FASE 2: Desarrollo del MVP
✅ Backend (NestJS + TS)

Implementar autenticación y gestión de roles (profesor, alumno, admin).
Crear API para la interacción con el agente AI.
Gestionar la creación de proyectos y asignación de estudiantes.
Implementar la línea de tiempo del proyecto con hitos y validaciones.
Construir el sistema de evaluación con generación de PDFs.
✅ Frontend (Vue + Tailwind)

Crear la interfaz de chat con el agente AI.
Construir el panel del estudiante con línea de tiempo y subida de entregables.
Desarrollar el dashboard del profesor con evaluaciones y reportes.
Implementar la vista de calificación con la malla de araña.
✅ Integración con AI

Conectar a OpenAI o similar para que los agentes sean realistas y coherentes.
Ajustar personalidades de los agentes según el tipo de problema.
✅ Generación de reportes en PDF

Exportar calificaciones y feedback en PDF para estudiantes y profesores.
Incluir sugerencias de mejora accionables para los estudiantes.
FASE 3: Pruebas y Ajustes
✅ Testing y validación

Realizar pruebas con estudiantes reales para evaluar la interacción con los agentes.
Ajustar la AI para que sus respuestas sean útiles y realistas.
Probar la generación de reportes y la precisión de las calificaciones.
✅ Optimización y correcciones

Refinar la UI/UX para una mejor experiencia.
Corregir errores en la lógica de los proyectos y calificaciones.
Optimizar rendimiento del backend y frontend.
✅ Lanzamiento del MVP

Subir la plataforma a un entorno de pruebas.
Recolectar feedback de usuarios iniciales.
Ajustar y planear la siguiente iteración.