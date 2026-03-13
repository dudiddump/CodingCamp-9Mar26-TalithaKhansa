const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');

const STORAGE_KEY = 'app_items';

function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderItems() {
    const items = loadItems();
    itemList.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
            <span class="item-text">${item}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        itemList.appendChild(li);
    });
}

function addItem() {
    const value = itemInput.value.trim();
    if (!value) return;
    
    const items = loadItems();
    items.push(value);
    saveItems(items);
    
    itemInput.value = '';
    renderItems();
}

function deleteItem(index) {
    const items = loadItems();
    items.splice(index, 1);
    saveItems(items);
    renderItems();
}

addBtn.addEventListener('click', addItem);

itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

itemList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteItem(index);
    }
});

renderItems();
