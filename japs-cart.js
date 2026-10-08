/*
  japs-cart.js - the shopping cart, shared by every page of the site
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Hand-written JavaScript, no framework and no build step, to match the rest
  of the site. The cart is kept in localStorage under a single key, so it
  survives a reload and follows the visitor from page to page.

  How a page opts in:
    - a button with class="add-to-cart" plus data-name and data-price
      (data-image is optional) adds that garment to the cart;
    - any element with data-cart-count has the number of items written into it;
    - cart.html carries the table that the cart is drawn into.
*/

(function () {
  'use strict';

  var STORAGE_KEY = 'japs-cart';

  /* If localStorage is unavailable - a private window, or the page opened
     straight from the file system in a strict browser - the cart still works
     for as long as the tab is open, it just stops being remembered. */
  var memoryFallback = [];

  /* -------------------------------------------------------------------
     READING AND WRITING THE CART
  ------------------------------------------------------------------- */

  function readCart() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      var items = JSON.parse(stored);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return memoryFallback;
    }
  }

  function writeCart(items) {
    memoryFallback = items;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      /* Nothing to do: the cart lives in memoryFallback for this tab. */
    }
    updateCounts();
    renderCart();
  }

  function findIndex(items, name) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  /* -------------------------------------------------------------------
     THE FOUR THINGS A VISITOR CAN DO
  ------------------------------------------------------------------- */

  function addItem(name, price, image) {
    var items = readCart();
    var index = findIndex(items, name);

    if (index === -1) {
      items.push({ name: name, price: price, image: image || '', quantity: 1 });
    } else {
      items[index].quantity += 1;
    }

    writeCart(items);
  }

  function changeQuantity(name, step) {
    var items = readCart();
    var index = findIndex(items, name);
    if (index === -1) {
      return;
    }

    items[index].quantity += step;

    /* Stepping below one removes the garment rather than leaving a zero row */
    if (items[index].quantity < 1) {
      items.splice(index, 1);
    }

    writeCart(items);
  }

  function removeItem(name) {
    var items = readCart();
    var index = findIndex(items, name);
    if (index !== -1) {
      items.splice(index, 1);
      writeCart(items);
    }
  }

  function emptyCart() {
    writeCart([]);
  }

  /* -------------------------------------------------------------------
     SUMS AND FORMATTING
  ------------------------------------------------------------------- */

  function countItems(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].quantity;
    }
    return total;
  }

  function cartTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    return total;
  }

  /* Prices are written the way the rest of the site writes them: no decimals
     when the amount is whole, a non-breaking space before the euro sign. */
  function formatPrice(amount) {
    var rounded = Math.round(amount * 100) / 100;
    var text = rounded.toLocaleString('es-ES', {
      minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
    return text + ' €';
  }

  /* -------------------------------------------------------------------
     THE COUNTER IN THE NAV
  ------------------------------------------------------------------- */

  function updateCounts() {
    var count = countItems(readCart());
    var badges = document.querySelectorAll('[data-cart-count]');

    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      /* An empty cart has nothing worth announcing, so the badge is hidden */
      badges[i].hidden = count === 0;
    }

    var labels = document.querySelectorAll('[data-cart-label]');
    for (var j = 0; j < labels.length; j++) {
      labels[j].textContent = count === 1
        ? 'Cart, 1 item'
        : 'Cart, ' + count + ' items';
    }
  }

  /* -------------------------------------------------------------------
     THE TOAST THAT CONFIRMS AN ADDITION
     One live region, created on demand, so no page has to carry the markup.
  ------------------------------------------------------------------- */

  var toast = null;
  var toastTimer = null;

  function announce(message) {
    if (!toast) {
      toast = document.createElement('p');
      toast.className = 'cart-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  /* -------------------------------------------------------------------
     DRAWING THE CART PAGE
     Everything below only runs on cart.html, which is the one page that
     carries #cart-rows.
  ------------------------------------------------------------------- */

  function cell(tag, text, className) {
    var element = document.createElement(tag);
    element.textContent = text;
    if (className) {
      element.className = className;
    }
    return element;
  }

  function quantityCell(item) {
    var td = document.createElement('td');
    td.className = 'cart-quantity';

    var minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'quantity-button';
    minus.textContent = '−';
    minus.setAttribute('data-cart-action', 'decrease');
    minus.setAttribute('data-name', item.name);
    minus.setAttribute('aria-label', 'One fewer ' + item.name);

    var figure = cell('span', String(item.quantity), 'quantity-value');

    var plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'quantity-button';
    plus.textContent = '+';
    plus.setAttribute('data-cart-action', 'increase');
    plus.setAttribute('data-name', item.name);
    plus.setAttribute('aria-label', 'One more ' + item.name);

    td.appendChild(minus);
    td.appendChild(figure);
    td.appendChild(plus);
    return td;
  }

  function garmentCell(item) {
    var td = document.createElement('td');
    td.className = 'cart-garment';

    /* The flex row is an inner wrapper so the cell stays a table cell */
    var line = document.createElement('div');
    line.className = 'cart-garment-line';

    if (item.image) {
      var image = document.createElement('img');
      image.src = item.image;
      image.alt = '';          /* decorative here: the name is in the same cell */
      image.width = 64;
      image.height = 64;
      line.appendChild(image);
    }

    line.appendChild(cell('span', item.name, 'cart-name'));
    td.appendChild(line);
    return td;
  }

  function removeCell(item) {
    var td = document.createElement('td');
    td.className = 'cart-remove';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'remove-button';
    button.textContent = 'Remove';
    button.setAttribute('data-cart-action', 'remove');
    button.setAttribute('data-name', item.name);
    button.setAttribute('aria-label', 'Remove ' + item.name + ' from the cart');

    td.appendChild(button);
    return td;
  }

  function renderCart() {
    var rows = document.getElementById('cart-rows');
    if (!rows) {
      return;
    }

    var items = readCart();
    var table = document.getElementById('cart-table');
    var empty = document.getElementById('cart-empty');
    var summary = document.getElementById('cart-summary');

    /* Empty cart: hide the table and the checkout block, show the message */
    if (table) {
      table.hidden = items.length === 0;
    }
    if (empty) {
      empty.hidden = items.length > 0;
    }
    if (summary) {
      summary.hidden = items.length === 0;
    }

    rows.textContent = '';

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var tr = document.createElement('tr');

      tr.appendChild(garmentCell(item));
      tr.appendChild(cell('td', formatPrice(item.price), 'cart-price cart-unit'));
      tr.appendChild(quantityCell(item));
      tr.appendChild(cell('td', formatPrice(item.price * item.quantity), 'cart-price cart-line'));
      tr.appendChild(removeCell(item));

      rows.appendChild(tr);
    }

    var totalCell = document.getElementById('cart-total');
    if (totalCell) {
      totalCell.textContent = formatPrice(cartTotal(items));
    }

    var countCell = document.getElementById('cart-item-count');
    if (countCell) {
      var count = countItems(items);
      countCell.textContent = count === 1 ? '1 garment' : count + ' garments';
    }
  }

  /* -------------------------------------------------------------------
     EVENTS
     One listener on the document covers every button, including the ones
     the cart page draws after the listener was attached.
  ------------------------------------------------------------------- */

  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    var addButton = event.target.closest('.add-to-cart');

    if (addButton) {
      var name = addButton.getAttribute('data-name');
      var price = parseFloat(addButton.getAttribute('data-price'));

      if (name && !isNaN(price)) {
        addItem(name, price, addButton.getAttribute('data-image'));
        announce(name + ' added to your cart.');

        /* The button says so too, for anyone who missed the message */
        var original = addButton.getAttribute('data-label') || addButton.textContent;
        addButton.setAttribute('data-label', original);
        addButton.textContent = 'Added ✓';
        addButton.classList.add('is-added');

        window.setTimeout(function () {
          addButton.textContent = original;
          addButton.classList.remove('is-added');
        }, 1600);
      }
      return;
    }

    var actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) {
      return;
    }

    var action = actionButton.getAttribute('data-cart-action');
    var target = actionButton.getAttribute('data-name');

    if (action === 'increase') {
      changeQuantity(target, 1);
    } else if (action === 'decrease') {
      changeQuantity(target, -1);
    } else if (action === 'remove') {
      removeItem(target);
      announce(target + ' removed from your cart.');
    } else if (action === 'empty') {
      emptyCart();
      announce('Your cart is empty.');
    } else if (action === 'checkout') {
      announce('This is a coursework site, so there is no real checkout yet.');
    }
  });

  /* A cart opened in two tabs stays in step: the storage event fires in the
     other tabs whenever one of them writes. */
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      updateCounts();
      renderCart();
    }
  });

  /* The script is loaded with defer, so the document is already parsed */
  updateCounts();
  renderCart();
}());
