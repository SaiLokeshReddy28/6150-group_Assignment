/**
 * Upload Page JavaScript
 * Author: Person 4
 */

document.addEventListener('DOMContentLoaded', function() {

    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFilesCard = document.getElementById('selectedFilesCard');
    const selectedFilesList = document.getElementById('selectedFilesList');
    const uploadProgressCard = document.getElementById('uploadProgressCard');
    let selectedFiles = [];

    // Drag and drop functionality
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', function() {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // File input change
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        selectedFiles = Array.from(files);
        displaySelectedFiles();
        selectedFilesCard.style.display = 'block';
    }

    function displaySelectedFiles() {
        selectedFilesList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            fileItem.innerHTML = `
                <div>
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    <strong>${file.name}</strong>
                    <small class="text-muted ms-2">(${formatFileSize(file.size)})</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedFilesList.appendChild(fileItem);
        });
        document.getElementById('fileCount').textContent = selectedFiles.length;
    }

    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        if (selectedFiles.length === 0) {
            selectedFilesCard.style.display = 'none';
        } else {
            displaySelectedFiles();
        }
    };

    window.clearSelectedFiles = function() {
        selectedFiles = [];
        selectedFilesCard.style.display = 'none';
        fileInput.value = '';
    };

    window.uploadFiles = function() {
        if (selectedFiles.length === 0) return;

        uploadProgressCard.style.display = 'block';
        simulateUpload();
    };

    function simulateUpload() {
        let progress = 0;
        const progressBar = document.getElementById('uploadProgressBar');
        const progressPercent = document.getElementById('progressPercent');

        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            progressPercent.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    uploadProgressCard.style.display = 'none';
                    selectedFilesCard.style.display = 'none';
                    alert('Files uploaded successfully!');
                    location.reload();
                }, 1000);
            }
        }, 300);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log('Filter by:', this.dataset.filter);
        });
    });

    console.log('✅ Upload page initialized');
});