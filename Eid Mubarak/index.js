//Custom cursor to follow cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
  cursor.setAttribute("style", "top: "+(e.pageY-15)+"px; left: "+(e.pageX-20)+"px;")
})

//Add on click pulse effect
function clickEffect(e){
  var effect = document.createElement("div");
  effect.className="cursoreffect";
  effect.setAttribute("style", "top: "+(e.pageY-16)+"px; left: "+(e.pageX-21)+"px;")
  document.body.appendChild(effect);
  effect.addEventListener('animationend',function(){effect.parentElement.removeChild(effect);}.bind(this));
}
document.addEventListener('click',clickEffect);




var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    }
  };
  $(document).on("click", ".whatsapp", function () {
    if (isMobile.any()) {
      var text =
        "HELLO, *" +
        userName +
        "* HAVE SEND A SPECIAL GIFT FOR YOU, *open this, and see magic!* and don't forget *" +
        userName +
        "* is the first one doing this-->";
      var url = $(this).attr("data-link");
      var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
      var whatsapp_url = "whatsapp://send?text=" + message;
      window.location.href = whatsapp_url;
    } else {
      alert("Please share this article in mobile device");
    }
  });