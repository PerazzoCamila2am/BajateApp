# BajateApp 

**BajateApp** es una aplicación mobile pensada para personas que viajan en colectivo, tren, micro o transporte público y quieren recibir una alerta antes de llegar a su destino.

La idea principal es simple: configurás dónde te querés bajar, elegís cuándo querés que te avise y la app te alerta antes de pasarte de parada.

---

##  Estado del proyecto

Proyecto en desarrollo.

Actualmente funciona como un **MVP con modo simulación**, sin GPS real todavía. Esto permite probar la lógica principal de la app sin tener que viajar realmente.

---

##  Problema que resuelve

Muchas personas se quedan dormidas, se distraen o no conocen bien el recorrido cuando viajan en transporte público.

BajateApp busca resolver eso con una alerta anticipada basada en:

* distancia restante hasta el destino;
* cantidad de paradas antes de llegar;
* simulación de viaje para probar la experiencia;
* sonido y vibración al activar la alarma.

---

##  Funcionalidades actuales

* Selección de destino demo.
* Modo de aviso por distancia.
* Modo de aviso por paradas.
* Simulación de viaje.
* Barra de progreso del recorrido.
* Estado del viaje en tiempo real.
* Alerta visual cuando se llega al punto configurado.
* Vibración al activar la alarma.
* Sonido de alarma.
* Botón para detener/silenciar la alarma.
* Configuración de sonido activado/desactivado.
* Configuración de vibración activada/desactivada.
* Velocidad de simulación: lenta, normal o rápida.
* Guardado automático de preferencias con AsyncStorage.
* Pantalla de guía con explicación del funcionamiento.

---

##  MVP actual

El objetivo del MVP es validar la experiencia principal:

```txt
Configuro una alerta
↓
Inicio una simulación
↓
La distancia baja
↓
La app detecta el momento correcto
↓
Se activa una alarma
```

Todavía no se usan datos reales de transporte ni ubicación GPS en segundo plano.

---

##  Modo simulación

El modo simulación permite probar la app sin subirse a un colectivo.

La app simula un recorrido con paradas demo y va actualizando el avance del viaje. Cuando se cumple la condición configurada, se activa la alarma.

Ejemplos:

```txt
Avisarme cuando falten 300 m
```

o:

```txt
Avisarme 2 paradas antes
```

---

##  Tecnologías utilizadas

* Expo
* React Native
* TypeScript
* Expo Router
* Expo Audio
* AsyncStorage
* React Native Components
* Git / GitHub

---

##  Estructura principal

```txt
app/
  (tabs)/
    index.tsx       # Pantalla principal del viaje
    explore.tsx     # Pantalla guía
    _layout.tsx     # Navegación por tabs

components/
  Card.tsx          # Card reutilizable
  OptionButton.tsx  # Botón reutilizable

data/
  demoStops.ts      # Paradas y datos demo

storage/
  alarmSettings.ts      # Configuración de alarma
  tripPreferences.ts    # Preferencias del viaje

types/
  trip.ts           # Tipos principales del proyecto

assets/
  sounds/
    alarm.mp3       # Sonido de alarma
```

---

## ▶ Cómo correr el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

### 2. Entrar a la carpeta del proyecto

```bash
cd BajateApp
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar Expo

```bash
npx expo start
```

Después podés abrir la app con:

* Expo Go en el celular;
* emulador Android;
* simulador iOS.

---

##  Roadmap

### MVP 1

* [x] Pantalla principal.
* [x] Destinos demo.
* [x] Alarma por distancia.
* [x] Simulación de viaje.
* [x] Alerta visual.
* [x] Vibración.
* [x] Sonido.
* [x] Botón para detener alarma.

### MVP 2

* [x] Paradas demo.
* [x] Aviso 1, 2 o 3 paradas antes.
* [x] Pantalla guía.
* [x] Guardado de preferencias.
* [x] Configuración de sonido, vibración y velocidad.

### Próximas mejoras

* [ ] Separar pantalla de configuración.
* [ ] Agregar capturas de pantalla al README.
* [ ] Agregar GPS real básico.
* [ ] Mostrar ubicación actual.
* [ ] Agregar mapa demo.
* [ ] Mostrar recorrido y paradas en mapa.
* [ ] Integrar notificaciones.
* [ ] Evaluar datos reales de transporte con GTFS.

---

##  Idea a futuro

A futuro, BajateApp podría usar datos reales de transporte público mediante GTFS.

Con GTFS se podrían cargar:

```txt
routes.txt      → líneas
trips.txt       → viajes o sentidos
stops.txt       → paradas
stop_times.txt  → orden de paradas
shapes.txt      → recorrido en mapa
```

Esto permitiría elegir una línea real, seleccionar una parada destino y recibir una alerta antes de llegar.

---


##  Nota

Este proyecto está en etapa inicial y se está desarrollando paso a paso. La prioridad actual es validar la experiencia de usuario antes de integrar GPS real, mapas o datos reales de transporte.
