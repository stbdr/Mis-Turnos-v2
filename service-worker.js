const CACHE_NAME = "turno2-v1";

/* Páginas y archivos de la app. Si añades una página nueva, ponla aquí. */
const APP_SHELL = [
  "./",
  "./index.html",
  "./registro.html",
  "./estadisticas.html",
  "./ingresos.html",
  "./buscar.html",
  "./copia.html",
  "./ajustes.html",
  "./estilo.css",
  "./datos.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/* Guarda cada archivo por separado: si falta uno (por ejemplo un icono), los demás se guardan igualmente. */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(APP_SHELL.map(url => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith("turno2-") && k !== CACHE_NAME) || k === "mis-turnos-v3").map(k => caches.delete(k))))
  );
  self.clients.claim();
});

/* Primero intenta la red, para que al subir cambios a GitHub se vean enseguida; sin conexión usa lo guardado. */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok){
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request).then(c => c || caches.match("./index.html")))
  );
});
