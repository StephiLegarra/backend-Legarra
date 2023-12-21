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
              })
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