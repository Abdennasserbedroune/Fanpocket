const dom = {
  qs: (selector, parent = document) => parent.querySelector(selector),

  qsa: (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector)),

  create: (tag, attrs = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
    return element;
  },

  empty: element => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  show: element => {
    element.style.display = '';
  },

  hide: element => {
    element.style.display = 'none';
  },

  toggle: element => {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  },

  addClass: (element, className) => {
    element.classList.add(className);
  },

  removeClass: (element, className) => {
    element.classList.remove(className);
  },

  toggleClass: (element, className) => {
    element.classList.toggle(className);
  },

  on: (element, event, handler) => {
    element.addEventListener(event, handler);
  },

  off: (element, event, handler) => {
    element.removeEventListener(event, handler);
  },

  delegate: (parent, selector, event, handler) => {
    parent.addEventListener(event, e => {
      if (e.target.matches(selector) || e.target.closest(selector)) {
        handler(e);
      }
    });
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dom;
}
