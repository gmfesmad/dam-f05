self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
});

self.addEventListener("activate", function (e) {
  console.log("[Service Worker] Activate");
  return self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  console.log("[Service Worker] Fetch", e);
});
