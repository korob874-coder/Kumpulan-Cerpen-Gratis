class NetlifyCommentSystem {
    constructor() {
        this.storyId = 'bayangan-terakhir';
        // Gunakan relative path untuk Netlify Functions
        this.apiUrl = '/.netlify/functions/comments';
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

    async submitComment() {
        const name = document.getElementById('name').value.trim();
        const comment = document.getElementById('comment').value.trim();
        const formMessage = document.getElementById('formMessage');
        const submitBtn = document.querySelector('.submit-btn');

        if (!name || !comment) {
            this.showMessage('Harap isi nama dan komentar', 'error');
            return;
        }

        // Loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storyId: this.storyId,
                    name: name,
                    comment: comment
                }),
            });

            if (response.ok) {
                const newComment = await response.json();
                this.showMessage('Komentar berhasil dikirim!', 'success');
                document.getElementById('commentForm').reset();
                await this.loadComments(); // Refresh komentar
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengirim komentar');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Gagal mengirim komentar: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async loadComments() {
        const container = document.getElementById('commentsList');
        
        try {
            const response = await fetch(`${this.apiUrl}?storyId=${this.storyId}`);
            
            if (!response.ok) {
                throw new Error('Gagal memuat komentar');
            }
            
            const comments = await response.json();
            
            if (comments.length === 0) {
                container.innerHTML = '<div class="no-comments">Belum ada komentar. Jadilah yang pertama!</div>';
                return;
            }

            container.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <div class="comment-author">${this.escapeHtml(comment.name)}</div>
                        <div class="comment-date">${this.formatDate(comment.created_at)}</div>
                    </div>
                    <div class="comment-content">${this.escapeHtml(comment.comment)}</div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading comments:', error);
            container.innerHTML = `
                <div style="color: red; text-align: center; padding: 2rem;">
                    ❌ Gagal memuat komentar. Silakan refresh halaman.
                </div>
            `;
        }
    }

    showMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        const color = type === 'success' ? 'green' : 'red';
        formMessage.innerHTML = `<div style="color: ${color}; padding: 0.5rem;">${message}</div>`;
        
        setTimeout(() => {
            formMessage.innerHTML = '';
        }, 5000);
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
    new NetlifyCommentSystem();
});
