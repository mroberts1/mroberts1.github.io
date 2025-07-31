// Sidebar functionality for Richard Misek website
document.addEventListener('DOMContentLoaded', function() {
    
    // Function to collapse all sidebar sections by default
    function initializeSidebar() {
        // Find all sidebar sections
        const sidebarSections = document.querySelectorAll('.sidebar-item-section, .nav-item');
        
        sidebarSections.forEach(function(section) {
            // Find the content container within this section
            const contentContainer = section.querySelector('.sidebar-item-contents, .collapse');
            const header = section.querySelector('.sidebar-item-text, .nav-link');
            
            if (contentContainer && header) {
                // Initially hide all content containers (collapsed by default)
                contentContainer.style.display = 'none';
                contentContainer.classList.remove('show', 'expanded');
                section.classList.add('collapsed');
                section.classList.remove('expanded');
                
                // Add click handler to toggle sections
                header.addEventListener('click', function(e) {
                    // Prevent default link behavior if it's a link
                    if (e.target.tagName.toLowerCase() === 'a') {
                        e.preventDefault();
                    }
                    
                    // Toggle the content visibility
                    if (contentContainer.style.display === 'none') {
                        contentContainer.style.display = 'block';
                        contentContainer.classList.add('show', 'expanded');
                        section.classList.add('expanded');
                        section.classList.remove('collapsed');
                    } else {
                        contentContainer.style.display = 'none';
                        contentContainer.classList.remove('show', 'expanded');
                        section.classList.add('collapsed');
                        section.classList.remove('expanded');
                    }
                });
                
                // Make the header appear clickable
                header.style.cursor = 'pointer';
            }
        });
    }
    
    // Function to ensure proper alignment (force left alignment)
    function enforceLeftAlignment() {
        const sidebar = document.querySelector('.sidebar, #quarto-sidebar');
        if (sidebar) {
            // Remove any Bootstrap spacing classes that cause indentation
            const elementsWithSpacing = sidebar.querySelectorAll('[class*="ms-"], [class*="ps-"], [class*="me-"], [class*="pe-"]');
            elementsWithSpacing.forEach(function(element) {
                // Remove margin and padding classes
                element.classList.forEach(function(className) {
                    if (className.match(/^(ms|ps|me|pe)-[0-5]$/)) {
                        element.classList.remove(className);
                    }
                });
            });
            
            // Force left alignment on all sidebar text elements
            const textElements = sidebar.querySelectorAll('*');
            textElements.forEach(function(element) {
                element.style.textAlign = 'left';
                element.style.marginLeft = '0';
                element.style.paddingLeft = '0';
            });
        }
    }
    
    // Initialize sidebar functionality
    initializeSidebar();
    enforceLeftAlignment();
    
    // Re-run initialization if content changes (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                initializeSidebar();
                enforceLeftAlignment();
            }
        });
    });
    
    // Observe changes to the sidebar
    const sidebar = document.querySelector('.sidebar, #quarto-sidebar');
    if (sidebar) {
        observer.observe(sidebar, { childList: true, subtree: true });
    }
});

// Additional function to handle window resize
window.addEventListener('resize', function() {
    // Ensure sidebar remains properly styled on resize
    const sidebar = document.querySelector('.sidebar, #quarto-sidebar');
    if (sidebar && window.innerWidth <= 768) {
        // Mobile view adjustments if needed
        sidebar.classList.add('mobile');
    } else if (sidebar) {
        sidebar.classList.remove('mobile');
    }
});
