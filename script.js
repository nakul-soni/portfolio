document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const currentRole = document.getElementById('current-role');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('nav li');
    const contentSections = document.querySelectorAll('.content-section');
    const addItemBtn = document.getElementById('add-item-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addMemberBtn = document.getElementById('add-member-btn');
    const exportListBtn = document.getElementById('export-list-btn');
    const saveItemBtn = document.getElementById('save-item-btn');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const inviteMemberBtn = document.getElementById('invite-member-btn');
    const generateExportBtn = document.getElementById('generate-export-btn');
    const categoryTabs = document.querySelectorAll('.tab');
    const checklistItemsContainer = document.getElementById('checklist-items');
    const notificationToast = document.getElementById('notification-toast');
    
    // Modal Elements
    const modals = document.querySelectorAll('.modal');
    const addItemModal = document.getElementById('add-item-modal');
    const addCategoryModal = document.getElementById('add-category-modal');
    const addMemberModal = document.getElementById('add-member-modal');
    const exportModal = document.getElementById('export-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const editItemModal = document.getElementById('edit-item-modal');
    const saveEditBtn = document.getElementById('save-edit-btn');
    
    // Add these to your existing variable declarations
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const deleteGroupBtn = document.getElementById('delete-group-btn');
    const leaveGroupBtn = document.getElementById('leave-group-btn');
    const themeSelect = document.getElementById('theme-select');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Load data from localStorage or use sample data
    let sampleItems = JSON.parse(localStorage.getItem('packpal_items')) || [
        { id: 1, name: 'Tent', category: 'camping', assignedTo: 'sarah', status: 'packed', notes: '4-person tent' },
        { id: 2, name: 'Sleeping Bag', category: 'camping', assignedTo: 'mike', status: 'unpacked', notes: '' },
        { id: 3, name: 'First Aid Kit', category: 'essentials', assignedTo: 'me', status: 'packed', notes: 'Check expiration dates' },
        { id: 4, name: 'Toothbrush', category: 'hygiene', assignedTo: 'me', status: 'delivered', notes: '' },
        { id: 5, name: 'Phone Charger', category: 'tech', assignedTo: 'sarah', status: 'unpacked', notes: 'Bring extra' },
        { id: 6, name: 'Sunscreen', category: 'beach', assignedTo: 'mike', status: 'unpacked', notes: 'SPF 50' },
        { id: 7, name: 'Beach Towels', category: 'beach', assignedTo: 'me', status: 'packed', notes: '2 large towels' },
        { id: 8, name: 'Water Bottles', category: 'essentials', assignedTo: 'sarah', status: 'delivered', notes: '4 reusable bottles' }
    ];
    
    let categories = JSON.parse(localStorage.getItem('packpal_categories')) || [
        { id: 'all', name: 'All Items', icon: 'list' },
        { id: 'clothing', name: 'Clothing', icon: 'tshirt' },
        { id: 'hygiene', name: 'Hygiene', icon: 'tooth' },
        { id: 'tech', name: 'Tech Gear', icon: 'laptop' },
        { id: 'food', name: 'Food & Snacks', icon: 'utensils' },
        { id: 'camping', name: 'Camping', icon: 'campground' },
        { id: 'beach', name: 'Beach Gear', icon: 'umbrella-beach' },
        { id: 'essentials', name: 'Essentials', icon: 'first-aid' }
    ];
    
    const members = [
        { id: 'me', name: 'You', role: 'owner', email: 'owner@example.com' },
        { id: 'sarah', name: 'Sarah', role: 'admin', email: 'sarah@example.com' },
        { id: 'mike', name: 'Mike', role: 'member', email: 'mike@example.com' },
        { id: 'emma', name: 'Emma', role: 'viewer', email: 'emma@example.com' }
    ];
    
    // App State
    let currentUser = JSON.parse(localStorage.getItem('packpal_currentUser')) || null;
    let currentCategory = localStorage.getItem('packpal_currentCategory') || 'all';
    let currentView = localStorage.getItem('packpal_currentView') || 'dashboard';
    
    // Settings state
    let settings = JSON.parse(localStorage.getItem('packpal_settings')) || {
        groupName: 'My Group',
        description: 'Our awesome group for organizing trips and events',
        eventDate: '',
        notifications: {
            email: true,
            app: true,
            sms: false
        },
        theme: 'light',
        colorScheme: 'default'
    };
    
    // Initialize the app
    function initApp() {
        // Event Listeners
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => switchView(item.dataset.section));
        });
        
        // Modals
        addItemBtn.addEventListener('click', () => showModal(addItemModal));
        addCategoryBtn.addEventListener('click', () => showModal(addCategoryModal));
        addMemberBtn.addEventListener('click', () => showModal(addMemberModal));
        exportListBtn.addEventListener('click', () => showModal(exportModal));
        
        saveItemBtn.addEventListener('click', saveNewItem);
        saveCategoryBtn.addEventListener('click', saveNewCategory);
        inviteMemberBtn.addEventListener('click', inviteNewMember);
        generateExportBtn.addEventListener('click', generateExport);
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                renderChecklistItems();
            });
        });
        
        // Add icon selection functionality
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all icons
                iconOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked icon
                option.classList.add('active');
            });
        });
        
        // Add edit button handler
        saveEditBtn.addEventListener('click', saveEditItem);
        
        // Setup demo login info
        setupDemoLogin();

        // Render the initial member list
        renderMemberList();

        // Initialize settings
        initSettings();
    }

    document.body.style.overflow = 'hidden';    
    
    // Check authentication state on page load
    function checkAuthState() {
        const authData = JSON.parse(localStorage.getItem(AUTH_KEY));
        const userData = JSON.parse(localStorage.getItem(USER_KEY));
        
        if (authData && authData.isAuthenticated && userData) {
            // User is authenticated, hide login and show main content
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            
            // Update UI with user data
            updateUIWithUserData(userData);
            
            // Initialize the app
            initApp();
            return true;
        }
        
        // Not authenticated, show login
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('main-content').style.display = 'none';
        return false;
    }

    // Handle successful login
    function handleLoginSuccess(userData) {
        // Store authentication state
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            isAuthenticated: true,
            timestamp: new Date().getTime()
        }));
        
        // Store user data
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        // Update UI
        updateUIWithUserData(userData);
        
        // Hide login, show main content
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
        // Initialize the app
        initApp();
    }

    // Update UI with user data
    function updateUIWithUserData(userData) {
        // Update any UI elements that display user information
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name || userData.email;
        }
        
        // Update any other user-specific UI elements
        // Add more UI updates as needed based on your application
    }

    // Handle logout
    function handleLogout() {
        // Clear authentication data
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
        
        // Show login, hide main content
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('main-content').style.display = 'none';
        
        // Optionally clear other user-specific data
        // Add any additional cleanup needed
    }

    // Modify your existing login function
    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Add your login validation logic here
        if (email && password) {
            // Example user data - modify according to your needs
            const userData = {
                email: email,
                name: email.split('@')[0], // Example: use email as name
                // Add other user data as needed
            };
            
            handleLoginSuccess(userData);
        } else {
            alert('Please enter both email and password');
        }
    }

    // Login Handler
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const role = roleSelect.value;
        
        if (!username || !password) {
            showNotification('Please enter both username and password');
            return;
        }
        
        // Simple validation for demo purposes
        if (password !== `${role}123`) {
            showNotification('Invalid credentials. Please try again.');
            return;
        }
        
        currentUser = {
            username,
            role,
            id: role // For demo purposes
        };
        
        // Save user state to localStorage
        localStorage.setItem('packpal_currentUser', JSON.stringify(currentUser));
        
        // Update UI based on role
        updateUIForRole(role);
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Switch screens and render data
        loginScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        mainScreen.classList.add('active');
        
        // Show welcome message
        showNotification(`Welcome, ${username}! (${role})`);
        
        // Render initial data
        renderDashboardStats();
        renderChecklistItems();
    }
    
    // Update UI based on user role
    function updateUIForRole(role) {
        currentRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        
        // Hide/show elements based on role
        const ownerAdminElements = document.querySelectorAll('[data-role="owner"], [data-role="admin"]');
        const memberElements = document.querySelectorAll('[data-role="member"]');
        const viewerElements = document.querySelectorAll('[data-role="viewer"]');
        
        ownerAdminElements.forEach(el => {
            el.style.display = (role === 'owner' || role === 'admin') ? '' : 'none';
        });
        
        memberElements.forEach(el => {
            el.style.display = role === 'member' ? '' : 'none';
        });
        
        viewerElements.forEach(el => {
            el.style.display = role === 'viewer' ? '' : 'none';
        });
        
        // Disable elements for viewer
        if (role === 'viewer') {
            const editableElements = document.querySelectorAll('input, select, textarea, button');
            editableElements.forEach(el => {
                if (!el.classList.contains('close-modal') && el.id !== 'logout-btn') {
                    el.disabled = true;
                }
            });
        }
    }
    
    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
    }
    
    // Switch between views
    function switchView(view) {
        currentView = view;
        
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === view) {
                item.classList.add('active');
            }
        });
        
        // Show the corresponding section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${view}-section`) {
                section.classList.add('active');
            }
        });
        
        // Update content if needed
        if (view === 'dashboard') {
            renderDashboardStats();
        } else if (view === 'checklists') {
            renderChecklistItems();
        }
    }
    
    // Show modal
    function showModal(modal) {
        closeAllModals();
        
        modal.classList.add('active');
    }
    
    // Close all modals
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove('active'));
    }
    
    // Show notification toast
    function showNotification(message) {
        const toastMessage = notificationToast.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        notificationToast.classList.add('show');
        
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 3000);
    }
    
    // Render dashboard stats
    function renderDashboardStats() {
        const totalItems = sampleItems.length;
        const packedItems = sampleItems.filter(item => item.status === 'packed').length;
        const deliveredItems = sampleItems.filter(item => item.status === 'delivered').length;
        const totalMembers = members.length;
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('packed-items').innerHTML = `${packedItems} <span class="percentage">(${Math.round((packedItems / totalItems) * 100)}%)</span>`;
        document.getElementById('delivered-items').innerHTML = `${deliveredItems} <span class="percentage">(${Math.round((deliveredItems / totalItems) * 100)}%)</span>`;
        document.getElementById('total-members').textContent = totalMembers;
        
        // Update progress bar
        const packedPercentage = (packedItems / totalItems) * 100;
        const deliveredPercentage = (deliveredItems / totalItems) * 100;
        
        document.querySelector('.progress.packed').style.width = `${packedPercentage}%`;
        document.querySelector('.progress.delivered').style.width = `${deliveredPercentage}%`;
        
        // Update legend
        const unpackedPercentage = 100 - packedPercentage - deliveredPercentage;
        document.querySelector('.chart-legend').innerHTML = `
            <span><i class="fas fa-square packed"></i> Packed (${Math.round(packedPercentage)}%)</span>
            <span><i class="fas fa-square delivered"></i> Delivered (${Math.round(deliveredPercentage)}%)</span>
            <span><i class="fas fa-square unpacked"></i> Unpacked (${Math.round(unpackedPercentage)}%)</span>
        `;
    }
    
    // Render checklist items
    function renderChecklistItems() {
        checklistItemsContainer.innerHTML = '';
        
        // Filter items based on current category
        let itemsToDisplay = [...sampleItems];
        if (currentCategory !== 'all') {
            itemsToDisplay = sampleItems.filter(item => item.category === currentCategory);
        }
        
        // Filter items based on user role
        if (currentUser.role === 'member') {
            itemsToDisplay = itemsToDisplay.filter(item => item.assignedTo === 'me');
        }
        
        if (itemsToDisplay.length === 0) {
            checklistItemsContainer.innerHTML = '<div class="empty-state">No items found. Add some items to get started!</div>';
            return;
        }
        
        itemsToDisplay.forEach(item => {
            const category = categories.find(cat => cat.id === item.category);
            const assignedMember = members.find(member => member.id === item.assignedTo);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.innerHTML = `
                <div class="item-name">
                    ${item.name}
                    ${category ? `<span class="item-category">${category.name}</span>` : ''}
                </div>
                <div class="item-assigned">
                    <i class="fas fa-user-circle"></i>
                    ${assignedMember ? assignedMember.name : 'Unassigned'}
                </div>
                <div class="item-status">
                    <span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                </div>
                <div class="item-actions">
                    ${currentUser.role !== 'viewer' ? `
                    <button class="btn-icon" data-action="edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" data-action="delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            `;
            
            checklistItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.item-actions button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const itemId = parseInt(this.dataset.id);
                
                if (action === 'edit') {
                    editItem(itemId);
                } else if (action === 'delete') {
                    deleteItem(itemId);
                }
            });
        });
    }
    
    // Save new item
    function saveNewItem() {
        const itemName = document.getElementById('item-name').value.trim();
        const itemCategory = document.getElementById('item-category').value;
        const itemAssigned = document.getElementById('item-assigned').value;
        const itemQuantity = document.getElementById('item-quantity').value;
        const itemNotes = document.getElementById('item-notes').value.trim();
        
        if (!itemName) {
            showNotification('Please enter an item name');
            return;
        }
        
        const newItem = {
            id: sampleItems.length + 1,
            name: itemName,
            category: itemCategory,
            assignedTo: itemAssigned,
            status: 'unpacked',
            notes: itemNotes,
            quantity: itemQuantity
        };
        
        sampleItems.push(newItem);
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item added successfully!');
        
        // Clear form
        document.getElementById('item-name').value = '';
        document.getElementById('item-notes').value = '';
    }
    
    // Save new category
    function saveNewCategory() {
        const categoryName = document.getElementById('category-name').value.trim();
        const selectedIcon = document.querySelector('.icon-option.active');
        
        if (!categoryName) {
            showNotification('Please enter a category name');
            return;
        }
        
        if (!selectedIcon) {
            showNotification('Please select an icon');
            return;
        }
        
        const iconName = selectedIcon.dataset.icon;
        
        const newCategory = {
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            icon: iconName
        };
        
        categories.push(newCategory);
        
        // Save to localStorage
        localStorage.setItem('packpal_categories', JSON.stringify(categories));
        
        // Update UI
        updateCategoryTabs();
        closeAllModals();
        showNotification('Category added successfully!');
        
        // Clear form
        document.getElementById('category-name').value = '';
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('active'));
    }
    
    // Update category tabs
    function updateCategoryTabs() {
        const tabsContainer = document.querySelector('.tabs-container');
        tabsContainer.innerHTML = '';
        
        // Add "All Items" tab
        const allTab = document.createElement('button');
        allTab.className = 'tab active';
        allTab.dataset.category = 'all';
        allTab.textContent = 'All Items';
        tabsContainer.appendChild(allTab);
        
        // Add category tabs
        categories.filter(cat => cat.id !== 'all').forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'tab';
            tab.dataset.category = category.id;
            tab.innerHTML = `<i class="fas fa-${category.icon}"></i> ${category.name}`;
            tabsContainer.appendChild(tab);
        });
        
        // Reattach event listeners
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                localStorage.setItem('packpal_currentCategory', currentCategory);
                renderChecklistItems();
            });
        });
    }
    
    // Invite new member
    function inviteNewMember() {
        const memberName = document.getElementById('member-name').value.trim();
        const memberEmail = document.getElementById('member-email').value.trim();
        const memberRole = document.getElementById('member-role').value;

        if (!memberName || !memberEmail) {
            showNotification('Please enter member name and email');
            return;
        }

        // Add the new member to the members array
        const newMember = {
            id: memberName.toLowerCase().replace(/\s+/g, '-'),
            name: memberName,
            role: memberRole,
            email: memberEmail
        };
        members.push(newMember);

        // Save the updated members list to localStorage
        localStorage.setItem('packpal_members', JSON.stringify(members));

        // Re-render the member list
        renderMemberList();

        // Show notification
        showNotification(`${memberName} (${memberEmail}) as ${memberRole} added Successfully!`);
        closeAllModals();

        // Clear form
        document.getElementById('member-name').value = '';
        document.getElementById('member-email').value = '';
        document.getElementById('member-role').value = 'member'; // Reset to default role
    }
    
    // Generate export
    function generateExport() {
        const exportFormat = document.getElementById('export-format').value;
        const exportContent = document.querySelectorAll('input[type="checkbox"]:checked');
        const exportLayout = document.getElementById('export-layout').value;
        
        if (exportFormat === 'csv') {
            // Create CSV content
            let csvContent = 'Item Name,Category,Assigned To,Status,Quantity,Notes\n';
            
            // Get items based on layout
            let itemsToExport = [...sampleItems];
            
            if (exportLayout === 'categorized') {
                // Sort by category
                itemsToExport.sort((a, b) => a.category.localeCompare(b.category));
            } else if (exportLayout === 'members') {
                // Sort by assigned member
                itemsToExport.sort((a, b) => a.assignedTo.localeCompare(b.assignedTo));
            }
            
            // Add items to CSV
            itemsToExport.forEach(item => {
                const category = categories.find(cat => cat.id === item.category)?.name || item.category;
                const assignedTo = members.find(member => member.id === item.assignedTo)?.name || item.assignedTo;
                
                // Escape fields that might contain commas
                const escapeCsvField = (field) => {
                    if (field && field.includes(',')) {
                        return `"${field}"`;
                    }
                    return field;
                };
                
                const row = [
                    escapeCsvField(item.name),
                    escapeCsvField(category),
                    escapeCsvField(assignedTo),
                    item.status,
                    item.quantity || '1',
                    escapeCsvField(item.notes || '')
                ].join(',');
                
                csvContent += row + '\n';
            });
            
            // Create and download the CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'packpal_checklist.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Checklist exported as CSV successfully!');
        } else if (exportFormat === 'pdf') {
            showNotification('PDF export coming soon!');
        } else if (exportFormat === 'print') {
            window.print();
            showNotification('Preparing printer-friendly version...');
        }
        
        closeAllModals();
    }
    
    // Edit item
    function editItem(itemId) {
        const item = sampleItems.find(item => item.id === itemId);
        if (!item) return;
        
        // Fill the edit form with item data
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-assigned').value = item.assignedTo;
        document.getElementById('edit-item-status').value = item.status;
        document.getElementById('edit-item-quantity').value = item.quantity || 1;
        document.getElementById('edit-item-notes').value = item.notes || '';
        
        // Show the edit modal
        showModal(editItemModal);
    }

    // Delete item
    function deleteItem(itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            const index = sampleItems.findIndex(item => item.id === itemId);
            if (index !== -1) {
                sampleItems.splice(index, 1);
                // Save to localStorage
                localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
                renderChecklistItems();
                renderDashboardStats();
                showNotification('Item deleted successfully');
            }
        }
    }
    
    // Add new function to save edited item
    function saveEditItem() {
        const itemId = parseInt(document.getElementById('edit-item-id').value);
        const itemIndex = sampleItems.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            showNotification('Item not found');
            return;
        }
        
        const updatedItem = {
            id: itemId,
            name: document.getElementById('edit-item-name').value.trim(),
            category: document.getElementById('edit-item-category').value,
            assignedTo: document.getElementById('edit-item-assigned').value,
            status: document.getElementById('edit-item-status').value,
            quantity: document.getElementById('edit-item-quantity').value,
            notes: document.getElementById('edit-item-notes').value.trim()
        };
        
        if (!updatedItem.name) {
            showNotification('Please enter an item name');
            return;
        }
        
        // Update the item in the array
        sampleItems[itemIndex] = updatedItem;
        
        // Save to localStorage
        localStorage.setItem('packpal_items', JSON.stringify(sampleItems));
        
        // Update UI
        renderChecklistItems();
        renderDashboardStats();
        closeAllModals();
        showNotification('Item updated successfully!');
    }
    
    // Setup demo login info
    function setupDemoLogin() {
        // Pre-fill demo credentials based on role selection
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            usernameInput.value = role;
            passwordInput.value = `${role}123`;
        });
    }
    
    // Render member list
    function renderMemberList() {
        const memberListContainer = document.querySelector('.members-list'); // Ensure this element exists in your HTML
        memberListContainer.innerHTML = ''; // Clear the existing list
    
        members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'member-card';
            memberElement.innerHTML = `
                <div class="member-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="member-info">
                    <h3>${member.name} (${member.role.charAt(0).toUpperCase() + member.role.slice(1)})</h3>
                    <p>${member.email}</p>
                </div>
                <div class="member-stats">
                    <div class="stat">
                        <span class="stat-label">Items Assigned</span>
                        <span class="stat-value">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Packed</span>
                        <span class="stat-value">0</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn-icon">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            `;
            memberListContainer.appendChild(memberElement);
        });
    }
    
    // Initialize settings
    function initSettings() {
        // Load saved settings
        document.getElementById('group-name-input').value = settings.groupName;
        document.getElementById('group-description').value = settings.description;
        document.getElementById('group-event-date').value = settings.eventDate;
        document.getElementById('email-notifications').checked = settings.notifications.email;
        document.getElementById('app-notifications').checked = settings.notifications.app;
        document.getElementById('sms-notifications').checked = settings.notifications.sms;
        document.getElementById('theme-select').value = settings.theme;
        
        // Set active color scheme
        document.querySelector(`.color-option[data-color="${settings.colorScheme}"]`).classList.add('active');
        
        // Apply theme and color scheme
        applyThemeAndColor();
        
        // Event listeners
        saveSettingsBtn.addEventListener('click', saveSettings);
        resetSettingsBtn.addEventListener('click', resetSettings);
        deleteGroupBtn.addEventListener('click', confirmDeleteGroup);
        leaveGroupBtn.addEventListener('click', confirmLeaveGroup);
        themeSelect.addEventListener('change', applyThemeAndColor);
        
        // Color scheme selection
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                settings.colorScheme = option.dataset.color;
                applyThemeAndColor();
            });
        });
    }

    // Save settings
    function saveSettings() {
        // Get values
        settings.groupName = document.getElementById('group-name-input').value;
        settings.description = document.getElementById('group-description').value;
        settings.eventDate = document.getElementById('group-event-date').value;
        settings.notifications.email = document.getElementById('email-notifications').checked;
        settings.notifications.app = document.getElementById('app-notifications').checked;
        settings.notifications.sms = document.getElementById('sms-notifications').checked;
        settings.theme = document.getElementById('theme-select').value;
        
        // Save to localStorage
        localStorage.setItem('packpal_settings', JSON.stringify(settings));
        
        // Update UI
        document.getElementById('group-name').textContent = settings.groupName;
        
        // Show success notification
        showNotification('Settings saved successfully!');
    }

    // Reset settings
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            settings = {
                groupName: 'My Group',
                description: 'Our awesome group for organizing trips and events',
                eventDate: '',
                notifications: {
                    email: true,
                    app: true,
                    sms: false
                },
                theme: 'light',
                colorScheme: 'default'
            };
            
            // Update UI
            initSettings();
            showNotification('Settings reset to default');
        }
    }

    // Apply theme and color scheme
    function applyThemeAndColor() {
        const root = document.documentElement;
        const theme = settings.theme;
        const colorScheme = settings.colorScheme;
        
        // Apply theme
        document.body.className = theme;
        
        // Apply color scheme
        switch (colorScheme) {
            case 'blue':
                root.style.setProperty('--primary-color', '#2196f3');
                break;
            case 'green':
                root.style.setProperty('--primary-color', '#4caf50');
                break;
            case 'purple':
                root.style.setProperty('--primary-color', '#9c27b0');
                break;
            default:
                root.style.setProperty('--primary-color', '#4a6fa5');
        }
    }

    // Confirm delete group
    function confirmDeleteGroup() {
        if (confirm('Are you sure you want to delete this group? This action cannot be undone!')) {
            if (prompt('Type "DELETE" to confirm:') === 'DELETE') {
                // Clear all data
                localStorage.clear();
                // Redirect to login
                window.location.reload();
            }
        }
    }

    // Confirm leave group
    function confirmLeaveGroup() {
        if (confirm('Are you sure you want to leave this group?')) {
            // Remove user from group
            showNotification('You have left the group');
            // Redirect to login
            setTimeout(() => {
                localStorage.removeItem('packpal_currentUser');
                window.location.reload();
            }, 1500);
        }
    }
    
    // Initialize the app
    initApp();

    // Add event listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Check auth state when page loads
        checkAuthState();
        
        // Add login form submit handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Add logout button handler
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
    });

    // Add this to handle page refresh
    window.addEventListener('load', checkAuthState);
});