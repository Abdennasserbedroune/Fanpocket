class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash];

    if (route) {
      this.currentRoute = hash;
      route();
    } else if (this.routes['*']) {
      this.routes['*']();
    } else {
      console.warn(`No route found for: ${hash}`);
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

const router = new Router();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Router, router };
}
