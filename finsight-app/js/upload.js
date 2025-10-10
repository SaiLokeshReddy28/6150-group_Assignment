/**
 * Finsight - Upload Page JavaScript
 * Person 4: File Upload Functionality
 * Author: Finsight Team - Person 4
 */

document.addEventListener('DOMContentLoaded', function() {

    console.log('✅ Upload page initialized');

    // ==========================================
    // VARIABLES
    // ==========================================

    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFilesCard = document.getElementById('selectedFilesCard');
    const selectedFilesList = document.getElementById('selectedFilesList');
    const uploadProgressCard = document.getElementById('uploadProgressCard');
    let selectedFiles = [];

    // ==========================================
    // DRAG AND DROP FUNCTIONALITY
    // ==========================================

    if (uploadZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadZone.addEventListener('drop', handleDrop, false);

        // Click to open file browser
        uploadZone.addEventListener('click', function(e) {
            if (e.target !== fileInput && e.target.tagName !== 'BUTTON') {
                fileInput.click();
            }
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        uploadZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        uploadZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // ==========================================
    // FILE INPUT CHANGE
    // ==========================================

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    // ==========================================
    // HANDLE FILES WITH VALIDATION
    // ==========================================

    function handleFiles(files) {
        // Convert FileList to Array and filter valid files
        const validFiles = Array.from(files).filter(file => {
            // Check file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                alert(`❌ File "${file.name}" is too large.\nMaximum size is 10MB.`);
                return false;
            }

            // Check file type
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert(`❌ File "${file.name}" has invalid format.\nPlease upload PDF, PNG, or JPG files.`);
                return false;
            }

            return true;
        });

        if (validFiles.length > 0) {
            selectedFiles = validFiles;
            displaySelectedFiles();
            selectedFilesCard.style.display = 'block';
            console.log('✅ Files selected:', validFiles.length);
        }
    }

    // ==========================================
    // DISPLAY SELECTED FILES
    // ==========================================

    function displaySelectedFiles() {
        selectedFilesList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Get file icon based on type
            let fileIcon = 'fa-file';
            let iconColor = 'text-secondary';
            
            if (file.type === 'application/pdf') {
                fileIcon = 'fa-file-pdf';
                iconColor = 'text-danger';
            } else if (file.type.startsWith('image/')) {
                fileIcon = 'fa-file-image';
                iconColor = 'text-primary';
            }
            
            fileItem.innerHTML = `
                <div>
                    <i class="fas ${fileIcon} ${iconColor} me-2"></i>
                    <strong>${file.name}</strong>
                    <small class="text-muted ms-2">(${formatFileSize(file.size)})</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFile(${index})" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedFilesList.appendChild(fileItem);
        });
        
        document.getElementById('fileCount').textContent = selectedFiles.length;
    }

    // ==========================================
    // REMOVE FILE
    // ==========================================

    window.removeFile = function(index) {
        console.log('Removing file at index:', index);
        selectedFiles.splice(index, 1);
        
        if (selectedFiles.length === 0) {
            selectedFilesCard.style.display = 'none';
            fileInput.value = '';
        } else {
            displaySelectedFiles();
        }
        
        console.log('Files remaining:', selectedFiles.length);
    };

    // ==========================================
    // CLEAR SELECTED FILES
    // ==========================================

    window.clearSelectedFiles = function() {
        selectedFiles = [];
        selectedFilesCard.style.display = 'none';
        fileInput.value = '';
        console.log('All files cleared');
    };

    // ==========================================
    // UPLOAD FILES
    // ==========================================

    window.uploadFiles = function() {
        if (selectedFiles.length === 0) {
            alert('⚠️ No files selected!');
            return;
        }

        console.log('Starting upload for', selectedFiles.length, 'file(s)');
        
        // Hide selected files card
        selectedFilesCard.style.display = 'none';
        
        // Show progress card
        uploadProgressCard.style.display = 'block';
        
        // Start simulated upload
        simulateUpload();
    };

    // ==========================================
    // SIMULATE UPLOAD (Demo)
    // ==========================================

    function simulateUpload() {
        let progress = 0;
        const progressBar = document.getElementById('uploadProgressBar');
        const progressPercent = document.getElementById('progressPercent');

        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            progressPercent.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                
                // Show completion
                setTimeout(() => {
                    uploadProgressCard.style.display = 'none';
                    
                    // Show success message
                    showSuccessAlert();
                    
                    // Reset
                    selectedFiles = [];
                    fileInput.value = '';
                    
                    console.log('✅ Upload complete!');
                    
                    // Reload page after 2 seconds to show new upload in table
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }, 500);
            }
        }, 300);
    }

    // ==========================================
    // SHOW SUCCESS ALERT
    // ==========================================

    function showSuccessAlert() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Upload Successful!</strong> Your files have been processed and categorized by AI.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.insertBefore(alert, contentArea.firstChild);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    }

    // ==========================================
    // FORMAT FILE SIZE
    // ==========================================

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    // ==========================================
    // FILTER BUTTONS
    // ==========================================

    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Filter by:', filter);
            
            // Filter table rows
            filterTableRows(filter);
        });
    });

    // ==========================================
    // FILTER TABLE ROWS
    // ==========================================

    function filterTableRows(filter) {
        const rows = document.querySelectorAll('.table tbody tr');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else {
                const statusBadge = row.querySelector('.badge');
                const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                
                if (status === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    // ==========================================
    // TABLE ACTION BUTTONS
    // ==========================================

    const viewButtons = document.querySelectorAll('.table .btn-primary');
    const downloadButtons = document.querySelectorAll('.table .btn-info');
    const deleteButtons = document.querySelectorAll('.table .btn-danger');

    // View button handlers
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.cells[0].textContent.trim();
            console.log('View file:', fileName);
            alert(`📄 Viewing details for:\n\n${fileName}\n\nThis would open a modal or detail page with:\n- Transaction breakdown\n- AI categorization\n- Spending insights`);
        });
    });

    // Download button handlers
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.cells[0].textContent.trim();
            console.log('Download file:', fileName);
            alert(`⬇️ Downloading: ${fileName}\n\nIn a real app, this would download the original file.`);
        });
    });

    // Delete button handlers
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const fileName = row.cells[0].textContent.trim();
            
            if (confirm(`🗑️ Are you sure you want to delete:\n\n"${fileName}"?\n\nThis action cannot be undone.`)) {
                console.log('Delete file:', fileName);
                
                // Fade out animation
                row.style.transition = 'opacity 0.3s ease';
                row.style.opacity = '0';
                
                setTimeout(() => {
                    row.remove();
                    showDeleteAlert(fileName);
                }, 300);
            }
        });
    });

    // ==========================================
    // SHOW DELETE ALERT
    // ==========================================

    function showDeleteAlert(fileName) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-warning alert-dismissible fade show';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <i class="fas fa-trash-alt me-2"></i>
            <strong>File Deleted!</strong> "${fileName}" has been removed.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.insertBefore(alert, contentArea.firstChild);
        }
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 3000);
    }

    // ==========================================
    // LOAD MORE BUTTON
    // ==========================================

    const loadMoreBtn = document.querySelector('.card-footer .btn-outline-primary');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Load more uploads requested');
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                alert('📂 Loading more uploads...\n\nIn a real app, this would fetch older uploads from the server.');
            }, 1000);
        });
    }

    // ==========================================
    // SEARCH FUNCTIONALITY
    // ==========================================

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.table tbody tr');
            
            if (searchTerm.length > 0) {
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                console.log('Searching for:', searchTerm);
            } else {
                // Show all rows when search is cleared
                rows.forEach(row => {
                    row.style.display = '';
                });
            }
        });
    }

    // ==========================================
    // TABLE ROW CLICK (Optional)
    // ==========================================

    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if clicking action buttons
            if (e.target.closest('button')) {
                return;
            }
            
            const fileName = this.cells[0].textContent.trim();
            console.log('Row clicked:', fileName);
            // Could highlight row or show quick preview
        });
    });

    // ==========================================
    // SIDEBAR TOGGLE (from navigation.js)
    // ==========================================

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            // On mobile, toggle show/hide
            if (window.innerWidth <= 992) {
                sidebar.classList.toggle('show');
            } else {
                // On desktop, toggle collapsed
                sidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && sidebar) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // ==========================================
    // NOTIFICATION ICON
    // ==========================================

    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            console.log('Notifications clicked');
            alert('🔔 You have 3 new notifications:\n\n1. Budget alert: Entertainment category\n2. New transaction detected\n3. Monthly report ready');
        });
    }

    // ==========================================
    // HELPER FUNCTION: FORMAT FILE SIZE
    // ==========================================

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    // ==========================================
    // UPLOAD STATISTICS (Demo Data)
    // ==========================================

    const uploadStats = {
        totalUploads: 5,
        processedCount: 4,
        pendingCount: 1,
        totalSize: '6.9 MB',
        lastUpload: 'Oct 9, 2025'
    };

    console.log('📊 Upload statistics:', uploadStats);

    // ==========================================
    // CONSOLE SUMMARY
    // ==========================================

    console.log('📤 Drag & drop initialized');
    console.log('📁 File input ready');
    console.log('✅ File validation active (10MB max, PDF/PNG/JPG only)');
    console.log('🔍 Search and filters active');
    console.log('🎨 Animations loaded');
    console.log('🔘 Action buttons (View/Download/Delete) ready');

});