function scrollToId(id) {
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
}

function growDiv(id) {
  var allAlbums = document.getElementsByClassName("grow");
  var growDiv = document.getElementById('grow-' + id);

  Array.prototype.forEach.call(allAlbums, function (el) {
    console.log(el);
    if (el.id !== growDiv.id) {
      var shrinkDiv = document.getElementById(el.id);
      if (shrinkDiv && shrinkDiv.clientHeight) {
        shrinkDiv.style.height = 0;
      }
    }
  });

  if (growDiv.clientHeight) {
    growDiv.style.height = 0;
  } else {
    var wrapper = document.querySelector('.measuringWrapper-' + id);
    growDiv.style.height = wrapper.clientHeight + "px";
  }
  // document.getElementById("more-button").value = document.getElementById("more-button").value == 'Read more' ? 'Read less' : 'Read more';
}