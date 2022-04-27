var glength = function() {
    if (document.getElementById('pass').value.length > 5 && document.getElementById('confirmPass').value.length > 5) {
      document.getElementById('message2').style.color = 'green';
      document.getElementById('message2').innerHTML = 'La contraseña tiene mas de 6 caracteres';
      document.getElementById("register").classList.remove('change1');
      document.getElementById("register").classList.add('change2');
    } else {
      document.getElementById('message2').style.color = 'red';
      document.getElementById('message2').innerHTML = 'La contraseña tiene que tener al menos 6 caracteres';
      document.getElementById("register").disabled = true;
      document.getElementById("register").classList.remove('change2');
      document.getElementById("register").classList.add('change1');
    }
  }