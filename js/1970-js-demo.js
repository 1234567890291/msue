/**
 * Particleground demo
 * @author Jonathan Nicol - @mrjnicol
 */

// This can be used to set the Particles Effects. Check README for more details!
document.addEventListener('DOMContentLoaded', function () {
  particleground(document.getElementById('particles'), {
    dotColor: 'red',
    lineColor: 'red'
  });
  var intro = document.getElementById('intro');
  intro.style.marginTop = - intro.offsetHeight / 2 + 'px';
}, false);



// // jQuery plugin example:
// $(document).ready(function() {
//   $('#particles').particleground({
//     dotColor: '#01fff4',
//     lineColor: '#01fff4'
//   });
//   $('.intro').css({
//     'margin-top': -($('.intro').height() / 2)
//   });
// });

