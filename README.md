# Enconta

Proyecto de front-end para el cliente de **Enconta**.

[![Build Status](https://enconta.semaphoreci.com/badges/enconta-frontend.svg?key=4e3d89bf-9e43-4f7d-bbe3-5873f49f576d)](https://enconta.semaphoreci.com/projects/enconta-frontend)

## Metas

- Administrar únicamente el front-end, servido como SPA.
- Comunicarse con la API REST ofrecida por **[Enconta](https://github.com/enconta/enconta-app)**.
- Proveer un entorno claro de desarollo.
- Tener código claro y bien documentado.
- Crear componentes independientes y modulares.

## Motivación

**Enconta** es una app muy grande que busca:

- **Disminución de costos**: los costos de servicios son muy altos, pueden ser disminuidos
  significativamente si se optimiza adecuadamente la app.
- **Más rapidez**: es muy lenta, hay cosas que por naturaleza son lentas pero podemos quitarle el
  peso de la vista y hacerla mucho más rápida.
- **Menor frustración**: muchas de las cosas no necesitan comunicación al servidor, se ahorraría
  el _90%_ de tiempo con validaciones locales para estas.
- **Mejores resultados**: se aprovecharía mejor el tiempo de los contadores, pasarían menos tiempo
  esperando a la app y más tiempo produciendo.

## Características

- [Node.js](https://nodejs.org/en/)
- [Babel / ES2015](https://babeljs.io/docs/learn-es2015)
- [React](https://github.com/facebook/react) /
  [React Router](https://github.com/reactjs/react-router)
- [Standard](http://standardjs.com/)
- [ESLint](https://eslint.org/docs/user-guide/integrations)
- [Husky](https://github.com/typicode/husky)
- [hotjar](https://www.hotjar.com)

## Guía de Instalación

Realiza los pasos indicados en el archivo [INSTALLATION](INSTALLATION.md) y, de ser necesario,
resolver los posibles problemas presentados antes de continuar.

## Ejecución

```shell
make start
```

Ahora se puede visitar el proyecto en <http://localhost:3000> o bien <http://0.0.0.0:3000>

**NOTA**: El puerto puede cambiar dependiendo de la variable de entorno `PORT` establecido en el
archivo `.dev`.

## Guía de estilo

Se siguen las guías de estilo de [JavaScript Standard Style](http://standardjs.com).

Para _autoformatear_ el código se debe integrar
[ESLint](https://eslint.org/docs/user-guide/integrations) en el editor, habilitando la opción de
arreglar errores al guardar.

## Flujo y razonamiento

**React** es una tecnología creada por _Facebook_ para poder hacer el trabajo de front-end de
aplicaciones grandes más sano.

**React** es una interfaz de JavaScript que tiene como meta hacer que los cambios visuales de una
página sean administrados desde una _vista mayor_, esto hace que toda la información salga de un
solo lugar y el flujo de datos pueda ser predecible, lo que nos permite saber cual será el
resultado de una operación, acción o evento. Esto se logra gracias a que cada componente de
**React** tiene un estado (_state_), dicho estado guarda la información que cada componente
necesita para operar.

**React** puede funcionar de forma independiente pero en éste proyecto está mezclado con:

- **Babel**: para poder usar las últimas características del lenguaje (actualmente
  **[ES6](https://github.com/lukehoban/es6features>)** en navegadores que aúno no lo soportan)

- **Webpack**: para poder crear un _servidor web_ de desarollo y construir la versión de
  producción (para producción todos los componentes de JavaScript se guardan en un solo archivo:
  `scripts/app.js).

El archivo que el servidor cargará es `public/index.html` que contiene una referencia al archivo
al que será compilada la aplicación.

Los componentes externos se instalan mediante **NPM** según sean para producción o sólo desarollo y
**SIEMPRE** deben guardarse en el `package.json`.

### Router

El archivo de entrada de **Webpack** y de toda la aplicación es `src/index.js`, éste funciona
como un _router_ que decide que componente cargar según la ruta desde la que se está viendo.

Para desarollo el router no necesita nada extra, en producción va a necesitar agregar una
configuración especial para _Nginx_, _Apache_ o cualquier otro _servidor web_ que indique que
las rutas mostradas en ese archivo no corresponden a archivos reales en el servidor si no que
necesitan ser cargadas desde el archivo `public/index.html`.
