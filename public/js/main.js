// ================= STATE MANAGEMENT =================
let currentHostel = 'Ellora';
let currentMeal = null;
let currentMealForForm = null;
let capturedBlob = null;
let currentStream = null;

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
  init();
});

function init() {
  setupEventListeners();
  loadMeals();
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Hostel buttons
  document.querySelectorAll('.hostel-btn').forEach(btn => {
    btn.addEventListener('click', () => switchHostel(btn.dataset.hostel));
  });

  // Meal sections
  document.querySelectorAll('.meal-section').forEach(section => {
    section.addEventListener('click', () => toggleMeal(section.dataset.meal));
  });

  // Hamburger menu
  document.getElementById('hamburger-menu').addEventListener('click', toggleHamburgerMenu);

  // Hamburger menu options
  document.getElementById('contributors-option').addEventListener('click', () => openModal('contributors-modal'));
  document.getElementById('report-issue-option').addEventListener('click', () => openModal('report-issue-modal'));
  document.getElementById('notifications-option').addEventListener('click', () => openModal('notifications-modal'));
  document.getElementById('contribute-option').addEventListener('click', contributeToProject);

  // Modal close buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
  });

  // Click outside to close modals
  document.addEventListener('click', handleClickOutside);

  // Report issue form
  document.getElementById('report-issue-form').addEventListener('submit', handleReportIssue);

  // Notifications form
  document.getElementById('notification-form').addEventListener('submit', handlePostNotification);

  // Add item modal
  document.getElementById('cancel-add').addEventListener('click', closeAddItemModal);
  document.getElementById('add-item-form').addEventListener('submit', handleAddItem);

  // Camera functionality
  document.getElementById('use-camera').addEventListener('click', startCamera);
  document.getElementById('capture-btn').addEventListener('click', captureImage);
  document.getElementById('retake-btn').addEventListener('click', retakeImage);
  document.getElementById('delete-file').addEventListener('click', deleteFile);
  document.getElementById('item-photo').addEventListener('change', handleFileSelect);
}

// ================= MODAL MANAGEMENT =================
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
  document.body.style.overflow = 'hidden';
  closeHamburgerMenu();
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = '';
}

function handleClickOutside(event) {
  const modals = ['contributors-modal', 'report-issue-modal', 'notifications-modal', 'add-item-overlay'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      closeModal(modalId);
    }
  });
}

// ================= ADD ITEM MODAL =================
function openAddItemModal(mealType) {
  currentMealForForm = mealType;
  const modal = document.getElementById('add-item-overlay');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeAddItemModal() {
  const modal = document.getElementById('add-item-overlay');
  modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scrolling
  // Reset form
  document.getElementById('add-item-form').reset();
  document.getElementById('file-preview').style.display = 'none';
  document.getElementById('camera-section').style.display = 'none';
  document.getElementById('preview-section').style.display = 'none';
  capturedBlob = null;
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

// ================= CAMERA FUNCTIONALITY =================
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    currentStream = stream;
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;
    document.getElementById('camera-section').style.display = 'block';
    document.getElementById('use-camera').style.display = 'none';
  } catch (error) {
    showToast('Camera access denied or not available', 'error');
  }
}

function captureImage() {
  const video = document.getElementById('camera-preview');
  const canvas = document.getElementById('capture-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    capturedBlob = blob;
    const img = document.getElementById('captured-preview');
    img.src = URL.createObjectURL(blob);
    document.getElementById('preview-section').style.display = 'block';
    document.getElementById('capture-btn').style.display = 'none';
  }, 'image/jpeg', 0.8);
}

function retakeImage() {
  document.getElementById('preview-section').style.display = 'none';
  document.getElementById('capture-btn').style.display = 'block';
  capturedBlob = null;
}

function deleteFile() {
  document.getElementById('item-photo').value = '';
  document.getElementById('file-preview').style.display = 'none';
  capturedBlob = null;
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-preview').style.display = 'flex';
  }
}

// ================= FORM HANDLERS =================
async function handleAddItem(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('item-name').value);
  formData.append('meal', currentMealForForm);
  formData.append('hostel', currentHostel);
  formData.append('creator', document.getElementById('item-creator').value || 'Anonymous');

  if (capturedBlob) {
    formData.append('photo', capturedBlob, 'captured.jpg');
  } else if (document.getElementById('item-photo').files[0]) {
    formData.append('photo', document.getElementById('item-photo').files[0]);
  }

  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      showToast('Item added successfully!');
      closeAddItemModal();
      loadMeals(); // Refresh the meals
    } else {
      throw new Error('Failed to add item');
    }
  } catch (error) {
    showToast('Failed to add item. Please try again.', 'error');
  }
}

async function handleReportIssue(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('issue-name').value,
    email: document.getElementById('issue-email').value,
    hostel: document.getElementById('issue-hostel').value,
    type: document.getElementById('issue-type').value,
    message: document.getElementById('issue-message').value
  };

  try {
    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showToast('Issue reported successfully!');
      closeModal('report-issue-modal');
      document.getElementById('report-issue-form').reset();
    } else {
      throw new Error('Failed to report issue');
    }
  } catch (error) {
    showToast('Failed to report issue. Please try again.', 'error');
  }
}

async function handlePostNotification(event) {
  event.preventDefault();

  const message = document.getElementById('notification-message').value.trim();
  if (!message) return;

  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, hostel: currentHostel })
    });

    if (response.ok) {
      showToast('Notification posted successfully!');
      document.getElementById('notification-message').value = '';
      loadNotifications();
    } else {
      throw new Error('Failed to post notification');
    }
  } catch (error) {
    showToast('Failed to post notification. Please try again.', 'error');
  }
}

// ================= DATA LOADING =================
async function loadMeals() {
  try {
    const response = await fetch(`/api/meals?hostel=${currentHostel}`);
    const meals = await response.json();

    Object.keys(meals).forEach(mealType => {
      renderMealItems(mealType, meals[mealType]);
    });
  } catch (error) {
    console.error('Failed to load meals:', error);
  }
}

async function loadNotifications() {
  try {
    const response = await fetch(`/api/notifications?hostel=${currentHostel}`);
    const notifications = await response.json();

    const container = document.getElementById('notifications-list');
    container.innerHTML = '';

    if (notifications.length === 0) {
      container.innerHTML = '<p class="no-notifications">No notifications yet.</p>';
      return;
    }

    notifications.forEach(notification => {
      const item = document.createElement('div');
      item.className = 'notification-item';
      item.innerHTML = `
        <div class="notification-content">${notification.message}</div>
        <div class="notification-meta">${new Date(notification.created_at).toLocaleDateString()}</div>
      `;
      container.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
}

// ================= UI RENDERING =================
function renderMealItems(mealType, items) {
  const section = document.querySelector(`[data-meal="${mealType}"]`);
  const content = section.querySelector('.meal-content');

  content.innerHTML = '';

  if (items.length === 0) {
    const noItemsMsg = document.createElement('p');
    noItemsMsg.className = 'no-items';
    noItemsMsg.textContent = 'Menu not added yet';
    content.appendChild(noItemsMsg);
  } else {
    const itemsList = document.createElement('ul');
    itemsList.className = 'items-list';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item-entry';
      li.innerHTML = `
        <div class="item-text">
          <span class="item-bullet">•</span>
          <span class="item-name">${item.name}</span>
          ${item.creator ? `<span class="item-by">by ${item.creator}</span>` : ''}
          <span class="item-date">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        ${item.photo_url ? `<div class="item-image-container"><img class="item-image" src="${item.photo_url}" alt="${item.name}" onclick="openImageModal('${item.photo_url}')"></div>` : ''}
      `;
      itemsList.appendChild(li);
    });

    content.appendChild(itemsList);
  }

  // Add "Add Item" button (always visible)
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-item';
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddItemModal(mealType);
  });

  content.appendChild(addBtn);
}

function switchHostel(hostel) {
  currentHostel = hostel;
  document.querySelectorAll('.hostel-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.hostel === hostel);
  });
  loadMeals();
  loadNotifications();
}

function toggleMeal(mealType) {
  const section = document.querySelector(`[data-meal="${mealType}"]`);
  const isExpanded = section.classList.contains('expanded');

  if (isExpanded) {
    section.classList.remove('expanded');
    currentMeal = null;
  } else {
    // Close other meals
    document.querySelectorAll('.meal-section.expanded').forEach(s => {
      s.classList.remove('expanded');
    });
    section.classList.add('expanded');
    currentMeal = mealType;

    // Load items if not already loaded
    if (!section.querySelector('.items-list')) {
      loadMeals();
    }
  }
}

function toggleHamburgerMenu() {
  const dropdown = document.getElementById('hamburger-dropdown');
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';
}

function closeHamburgerMenu() {
  document.getElementById('hamburger-dropdown').style.display = 'none';
}

function contributeToProject() {
  window.open('https://github.com/sathwikre/campus-mess', '_blank');
  closeHamburgerMenu();
}

function openImageModal(imageUrl) {
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${imageUrl}" alt="Item image">
      <button class="modal-close" onclick="this.closest('.image-modal').remove()">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// ================= UTILITIES =================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = msg;
  toast.className = `toast ${type}`;
  toast.style.display = 'flex';
  setTimeout(() => (toast.style.display = 'none'), 3000);
}
