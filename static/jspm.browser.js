SystemJS.config({
  baseURL: "/",
  production: false,
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "archipelago-frontend/": "lib/"
  }
});
