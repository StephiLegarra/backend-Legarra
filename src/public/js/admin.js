document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        fetch(`/api/users/${userId}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(data => {
            if(data.success) {
              document.getElementById(`user-${userId}`).remove();
            } else {
              alert('Error al eliminar el usuario');
            }
          });
      });
    });

 document.querySelectorAll('.rol-change-button').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        const select = document.querySelector(`.rol-select[data-id="${userId}"]`);
        const newRol = select.value;
        fetch(`/api/users/${userId}/rol`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({rol: newRol}),
        })
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Rol actualizado correctamente!',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                location.reload();
              });
          } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al actualizar el rol',
                showConfirmButton: false,
                timer: 2000
              })
          }
        });
      });
    });
  });

  function deleteInactiveUsers(){
    fetch('/api/users/inactive', {
        method: 'DELETE',
    }).then(res =>{
        if(res.ok){
            return res.json();
        } else {
            throw new Error ('Algo salio mal');
        }
    }).then(data =>{
        console.log(data);
        Swal.fire({
          icon: 'success',
          text: 'Los correos electrónicos de usuarios inactivos han sido eliminados con éxito',
        }).then(() => {
          window.location.reload();
        });
    }).catch(err =>{
        console.log(err);
        Swal.fire({
            icon: "error",
            text: 'No se pudo eliminar a los usuarios inactivos'
        });
    });
};