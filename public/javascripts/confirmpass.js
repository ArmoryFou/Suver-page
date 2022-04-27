var check = function() {
  if(document.getElementById('pass').value.length == 0){
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Las contraseñas NO coinciden';
    document.getElementById("register").disabled = true;
    document.getElementById("register").classList.remove('change2');
    document.getElementById("register").classList.add('change1');
  } else if (document.getElementById('pass').value ==
      document.getElementById('confirmPass').value) {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').innerHTML = 'Las contraseñas coinciden';
      document.getElementById("register").disabled = false;
      document.getElementById("register").classList.remove('change1');
      document.getElementById("register").classList.add('change2');
    } else {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = 'Las contraseñas NO coinciden';
      document.getElementById("register").disabled = true;
      document.getElementById("register").classList.remove('change2');
      document.getElementById("register").classList.add('change1');
    }
  }

