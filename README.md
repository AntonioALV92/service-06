# codi-01-registroInicial

Este proyecto contiene el servicio de middleware codi-01-registroInicial que es la capa entre el front (app CoDi Multiva) y el servicio registroInicial de Banxico.

---
## Rutas

Este servicio expone 2 rutas:

* ### **<span style="color:skyblue">POST</span> /general/registroInicial**
Apunta al servicio de regustro inicial de banxico, cuya definición puede encontrarse aquí:
https://multiva-codi.gitlab.io/banca-movil-schemas/#operation/codi-01-registroInicial

* ### **<span style="color:limegreen">GET</span>  /version**
Retorna la versión actual del servicio, con base en el package.json del mismo.

Ej de respuesta `(application/json)`:
```json
{
    "version":"1.0.0"
}
```

---
## Ejecución local
Para ejecutar este proyecto de forma inicial hay que ejecutar lo siguiente:

```bash
npm install
npm start
```

Esto ejecutará el proyecto por defecto en el puerto **8080**, a menos que se establezca la variable de entorno PORT con un puerto diferente.

Ej.
```
export PORT=3000
npm start
```

---

## Pruebas unitarias

Las pruebas unitarias estas creadas con las siguientes herramientas:

- Jest (Testing Framework by Facebook)
- nock (HTTP server mocking and expectations library for Node.js)
- supertest (HTTP assertions made easy via superagent)

Para ejecutar las pruebas unitarias:

```bash
npm test
```
Esto mostrará un reporte de coverage en la terminal, que es la descripción de que tanto código está realmente probado, también se muestra una versión más detallada del reporte en un HTML generado en la carpeta `coverage/lcov-report/index.html`

---

## Openshift Build

Para crear el build con esta aplicación dentro de un proyecto de openshift se requieren los siguientes pre-requisitos, *estos es necesario hacerlos una vez por proyecto*:

1. Agregar secrets para acceso a gitlab (gitlab-multiva)
2. Agregar secrets para acceso a nexus (nexus-pull)
3. Agregar los secrets de nexus a los serviceAccount default y builder:
```bash
oc secrets add serviceaccount/default secrets/nexus-pull --for=pull
oc secrets add serviceaccount/builder secrets/nexus-pull --for=pull,mount
```

Una vez que ya se tienen estas configuraciones, ya se puede ejecutar el siguiente comando para crear el buildconfig:

```bash
oc new-app nodejs-10:latest~git@10.160.83.76:CoDi/codi-01-registroinicial.git --source-secret=gitlab-multiva
```

Esto creará un buildConfig con base en la imagen de RHEL7 NodeJs 10.15 S2I, ahí dentro se hacen las siguientes operaciones automáticamente:
1. Se clona el repositorio
2. Se instalan las dependencias del package.json (`npm i`)
3. Se copia el contenido del repo y las librerias instaladas dentro de otra imagen, y esta se sube al repositorio de docker local de Openshift
4. Se crea un deploymentConfig con base en esa imágen
5. Se crea el servicio que apunta al puerto 8080 (no se expone)
6. Se hace deploy en un pod de este deploymenConfig

---

## Subir imagen a Nexus

Para poder montar esta aplicación en otra instancia de Openshift, se requiere que la imagen de docker generada se encuentre en otro repositorio que no sea el local, en este caso en el mismo Nexus, para subirla hay que modificar temporalmente la el buildConfig:

En la sección "Push To"   
* Cambiar de Image Stream Tag -> Docker Image

Docker Image Repository:
```
nexus-0.dev.openshift.multivaloresgf.local:18444/codi/codi-01-registro-inicial:dev
```

y agregar el Push Secret requerido.
