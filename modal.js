// Author Modal Functions dengan Efek Transisi
function showAuthorModal() {
    const modal = document.getElementById('authorModal');
    const authorLink = document.querySelector('.author-link');
    
    // Reset display property sebelum show
    modal.style.display = 'flex';
    
    // Trigger reflow untuk memastikan transition bekerja
    void modal.offsetWidth;
    
    // Efek pulse pada tombol author
    authorLink.classList.add('pulse');
    setTimeout(() => {
        authorLink.classList.remove('pulse');
    }, 300);
    
    // Tampilkan modal dengan efek
    setTimeout(() => {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }, 10);
}

function closeAuthorModal() {
    const modal = document.getElementById('authorModal');
    
    // Sembunyikan modal dengan efek
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Allow scrolling again
    
    // Reset display setelah animasi selesai
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('authorModal');
    
    // Pastikan modal hidden saat pertama load
    modal.style.display = 'none';
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeAuthorModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAuthorModal();
        }
    });

    // Tambahkan efek hover pada author link
    const authorLink = document.querySelector('.author-link');
    if (authorLink) {
        authorLink.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        authorLink.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Event listener untuk klik author link
        authorLink.addEventListener('click', showAuthorModal);
    }
    
    // Event listener untuk close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAuthorModal);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initModal);
