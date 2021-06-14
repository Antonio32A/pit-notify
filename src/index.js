import { handleRequest } from "./commands";
import { handleCronTrigger } from "./worker";

addEventListener("fetch", event => event.respondWith(handleRequest(event.request)));
addEventListener("scheduled", event => event.waitUntil(handleCronTrigger()));
