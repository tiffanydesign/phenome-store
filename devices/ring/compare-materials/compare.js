/* ============================================================================
   devices/ring/compare-materials · page script, for body.cmp

   One behaviour: the colour discs under each column change the photograph above
   that column, and the name under the discs. Nothing else on the page moves.

   Written in the same ES5 shared.js is, for the same reason: this file loads
   after it on the one page that includes it, and a syntax error a browser
   cannot parse takes the whole script out rather than the one behaviour it
   belongs to.
   ========================================================================= */
(function () {
  'use strict';

  var groups = document.querySelectorAll('[data-dots]');
  if (!groups.length) return;

  function wire(group) {
    var key = group.getAttribute('data-dots');
    var figure = document.querySelector('[data-fig="' + key + '"]');
    var label = document.querySelector('[data-name-for="' + key + '"]');
    if (!figure) return;

    var dots = group.querySelectorAll('.cmp-dot');
    var shots = figure.querySelectorAll('img');

    function show(finish, name) {
      var i;
      for (i = 0; i < shots.length; i++) {
        /* `classList.toggle` with a second argument is the one form of it
           Internet Explorer never shipped, and this file is written to the same
           floor shared.js is, so the branch is spelled out. */
        if (shots[i].getAttribute('data-finish') === finish) {
          shots[i].className = 'on';
        } else {
          shots[i].className = '';
        }
      }
      for (i = 0; i < dots.length; i++) {
        var on = dots[i].getAttribute('data-finish') === finish;
        dots[i].className = on ? 'cmp-dot on' : 'cmp-dot';
        dots[i].setAttribute('aria-checked', on ? 'true' : 'false');
      }
      if (label && name) label.textContent = name;
    }

    for (var d = 0; d < dots.length; d++) {
      (function (dot) {
        dot.addEventListener('click', function () {
          show(dot.getAttribute('data-finish'), dot.getAttribute('data-name'));
        });
      })(dots[d]);
    }
  }

  for (var g = 0; g < groups.length; g++) wire(groups[g]);
})();
