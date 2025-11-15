class CommentSystem {
    constructor() {
        this.storyId = 'bayangan-terakhir';
        this.init();
    }

    init() {
        this.setupFormHandler();
        this.loadComments();
    }

    setupFormHandler() {
        document.getElementById('commentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComment();
        });
    }

    submitComment() {
        const name = document.getElementById('name').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const formMessage = document.getElementById('formMessage');

        if (!name || !comment) {
            formMessage.innerHTML = '<div style="color: red; padding: 0.5rem;">Harap isi nama dan komentar</div>';
            return;
        }

        // Simpan ke localStorage
        const comments = this.getComments();
        const newComment = {
            id: Date.now(),
            name: name,
            comment: comment,
            date: new Date().toISOString(),
            storyId: this.storyId
        };

        comments.unshift(newComment); // Tambah di awal
        localStorage.setItem(`comments-${this.storyId}`, JSON.stringify(comments));

        // Tampilkan pesan sukses
        formMessage.innerHTML = '<div style="color: green; padding: 0.5rem;">✓ Komentar berhasil dikirim!</div>';

        // Reset form
        document.getElementById('commentForm').reset();

        // Refresh tampilan komentar
        this.loadComments();

        // Hapus pesan setelah 3 detik
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 3000);
    }

    loadComments() {
        const comments = this.getComments();
        const container = document.getElementById('commentsList');

        if (comments.length === 0) {
            container.innerHTML = '<div class="no-comments">Belum ada komentar. Jadilah yang pertama!</div>';
            return;
        }

        container.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <div class="comment-author">${this.escapeHtml(comment.name)}</div>
                    <div class="comment-date">${this.formatDate(comment.date)}</div>
                </div>
                <div class="comment-content">${this.escapeHtml(comment.comment)}</div>
            </div>
        `).join('');
    }

    getComments() {
        const stored = localStorage.getItem(`comments-${this.storyId}`);
        return stored ? JSON.parse(stored) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Inisialisasi sistem komentar
document.addEventListener('DOMContentLoaded', () => {
    new CommentSystem();
});
