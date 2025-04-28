document.querySelectorAll('.background-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const background = thumbnail.getAttribute('data-bg');
        document.body.style.backgroundImage = `url('${background}')`;
        localStorage.setItem('academiaBackground', background); // Salva no localStorage
        document.getElementById('backgroundModal').style.display = 'none';
    });
});