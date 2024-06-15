const searchInput = document.getElementById('search-input');
const searchResult = document.getElementById('search-result');
const searchBtn = document.getElementById('search-btn');
const addItemBtn = document.getElementById('add-item-btn');

// Load items from local storage
let items = JSON.parse(localStorage.getItem('items')) || [];

// Function to update local storage
const updateLocalStorage = () => {
  localStorage.setItem('items', JSON.stringify(items));
};

// Function to add an item
const addItem = (item) => {
  const newItem = { ...item, dateAdded: new Date().toISOString() };
  items.push(newItem);
  updateLocalStorage();
};

const updateRecentActivity = (action, item) => {
  const listItem = document.createElement('li');
  listItem.textContent = `${action}: ${item.name} - ${new Date().toLocaleString()}`;
  recentActivityList.prepend(listItem);
};

const adjustMainContainerPosition = () => {
  const searchResultHeight = document.getElementById('search-result').offsetHeight;
  const mainContainer = document.querySelector('.main-container');
  const headerHeight = document.querySelector('header').offsetHeight;
  const marginTop = searchResultHeight + headerHeight + 40; // 40px for additional margin
  
  mainContainer.style.marginTop = `${marginTop}px`;
};


// Function to perform search
const performSearch = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  // Check if items array is empty or undefined
  if (!items || items.length === 0) {
    searchResult.textContent = 'No items found';
    return;
	
  }

  const searchTerms = searchTerm.split(' ');

  const filteredItems = items.filter(item => {
    // Convert all item properties to lowercase for case-insensitive search
    const lowerCaseItem = Object.keys(item).reduce((acc, key) => {
      acc[key] = item[key].toString().toLowerCase();
      return acc;
    }, {});

    // Check if any item property contains all search terms
    return searchTerms.every(term =>
      Object.values(lowerCaseItem).some(value => value.includes(term))
    );
  });

  if (filteredItems.length > 0) {
    const searchResultsHTML = `
      <table class='result-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model No</th>
            <th>Measurement</th>
            <th>Color</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Date Added</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.modelNo}</td>
              <td>${item.measurement}</td>
              <td>${item.color}</td>
              <td>${item.category}</td>
              <td>${item.inventory}</td>
              <td>${new Date(item.dateAdded).toLocaleString()}</td>
              <td>${item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : ''}</td>
              <td>
                <button class="update-btn" data-item-index="${items.indexOf(item)}">Update Quantity</button>
                <button class="delete-btn" data-item-index="${items.indexOf(item)}">Delete Item</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    searchResult.innerHTML = searchResultsHTML;

    // Add event listeners for update and delete buttons
    // Updated JavaScript for updating quantity...
  } else {
    searchResult.textContent = 'No matching items found';
  }
      document.querySelectorAll('.update-btn').forEach(button => {
      button.addEventListener('click', function() {
        const itemIndex = parseInt(this.getAttribute('data-item-index'));
        const updateInputContainer = document.createElement('div');
        updateInputContainer.classList.add('update-input-container');

        const updateInput = document.createElement('input');
        updateInput.type = 'number';
        updateInput.placeholder = 'New Quantity';
        updateInput.classList.add('update-input');

        const confirmUpdateBtn = document.createElement('button');
        confirmUpdateBtn.textContent = 'Update';
        confirmUpdateBtn.classList.add('confirm-update-btn');

        const cancelUpdateBtn = document.createElement('button');
        cancelUpdateBtn.textContent = 'Cancel';
        cancelUpdateBtn.classList.add('cancel-update-btn');

        updateInputContainer.appendChild(updateInput);
        updateInputContainer.appendChild(confirmUpdateBtn);
        updateInputContainer.appendChild(cancelUpdateBtn); // Add cancel button

        // Replace the existing button with the update input
        const parentDiv = this.parentElement;
        parentDiv.replaceChild(updateInputContainer, this);

        confirmUpdateBtn.addEventListener('click', () => {
  const newInventory = parseInt(updateInput.value);
  if (!isNaN(newInventory) && newInventory >= 0) {
    items[itemIndex].inventory = newInventory;
    items[itemIndex].lastUpdated = new Date().toISOString(); // Update lastUpdated timestamp
    updateLocalStorage();
    performSearch(); // Refresh search results
  } else {
    alert('Please enter a valid positive number for inventory.');
  }
});

        cancelUpdateBtn.addEventListener('click', () => {
          parentDiv.replaceChild(button, updateInputContainer); // Replace with original button
        });
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const itemIndex = parseInt(this.getAttribute('data-item-index'));
        const confirmDelete = confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
          items.splice(itemIndex, 1);
          updateLocalStorage();
          performSearch(); // Refresh search results
        }
      });
    });
};


// Event listeners
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    if (searchInput.value.trim() !== '') {
      performSearch();
    } else {
      searchResult.textContent = 'Invalid input';
    }
  }
});

searchBtn.addEventListener('click', function() {
  if (searchInput.value.trim() !== '') {
    performSearch();
  } else {
    searchResult.textContent = 'Invalid input';
  }
});

const toggleAddItemContainer = () => {
  const addItemContainer = document.getElementById('add-item-container');
  const addNewItemBtn = document.getElementById('toggle-add-item-btn');
  addItemContainer.style.display = addItemContainer.style.display === 'none' ? 'block' : 'none';
  if(addItemContainer.style.display === 'block'){
	  addNewItemBtn.innerHTML = 'Cancel';
  }else{
	   addNewItemBtn.innerHTML = 'Add new Item';
  }
  addNewItemBtn.classList.toggle('active');
};

document.getElementById('toggle-add-item-btn').addEventListener('click', toggleAddItemContainer);

document.getElementById('add-item-btn').addEventListener('click', function() {
  const name = document.getElementById('new-item-input').value.trim();
  const modelNo = document.getElementById('modelNo-input').value.trim();
  const measurement = document.getElementById('measurement-input').value.trim();
  const color = document.getElementById('color-input').value.trim();
  const category = document.getElementById('category-input').value.trim();
  const inventory = document.getElementById('inventory-input').value.trim();

  if (name !== '' && modelNo !== '' && measurement !== '' && color !== '' && category !== '' && inventory !== '') {
    const inventoryValue = parseInt(inventory);
    if (!isNaN(inventoryValue)) { 
      addItem({ name,modelNo, measurement, color, category, inventory: inventoryValue });
      // Clear input fields after adding the item
      document.getElementById('new-item-input').value = '';
      document.getElementById('modelNo-input').value = '';
      document.getElementById('measurement-input').value = '';
      document.getElementById('color-input').value = '';
      document.getElementById('category-input').value = '';
      document.getElementById('inventory-input').value = '';
      // Hide the add item container after adding the item
      toggleAddItemContainer();
      alert('Item added successfully!');
    } else {
      alert('Please enter a valid inventory number!');
    }
  } else {
    alert('Please enter valid details for all fields!');
  }
});

const countCategories = () => {
  const categories = {};
  // Initialize categories with count 0
  document.querySelectorAll('.cat-list-item').forEach(item => {
    const category = item.textContent.trim().toLowerCase().split(' ')[0]; // Trim and convert to lowercase
    categories[category] = 0;
  });

  // Increment count for each item's category
  items.forEach(item => {
    const itemCategory = item.category.toLowerCase(); // Convert item's category to lowercase
    if (categories.hasOwnProperty(itemCategory)) {
      categories[itemCategory]++;
    }
  });
  return categories;
};

// Function to update category list
const updateCategoryList = () => {
  const categoryGrid = document.querySelector('.cat-list-grid');
  const categories = countCategories();

  // Clear previous category list
  categoryGrid.innerHTML = '';

  // Update category list
  for (const category in categories) {
    const categoryCount = categories[category];
    const catListItem = document.createElement('div');
    catListItem.classList.add('cat-list-item');
    // Capitalize each word in the category name and include category count
    const capitalizedCategory = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    catListItem.textContent = `${capitalizedCategory} (${categoryCount})`;
    categoryGrid.appendChild(catListItem);
  }
};

// Call the function to update the category list initially
updateCategoryList();

document.getElementById('name-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value.trim();
    if (name === 'de.thammy' || name === 'de.arnel' || 'de.office') {
        // Display welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome, ${name}!`;
        welcomeMessage.style.display = 'block';
        
        // Display proceed button
        const proceedBtn = document.getElementById('proceed-btn');
        proceedBtn.style.display = 'block';
        
        // Hide name form
        this.style.display = 'none';
    } else {
        alert('Wrong Password');
    }
});



document.getElementById('proceed-btn').addEventListener('click', function() {
    // Proceed to the main web application
    console.log('Proceeding to the web app...');
    // You can redirect to the main web app page here if needed
    
    // Display main content
    document.querySelector('header').style.display = 'block';
    document.querySelector('.main-container').style.display = 'block';

    // Hide welcome message and the proceed button
    document.getElementById('welcome-message').style.display = 'none';
    this.style.display = 'none'; // Hide the "Proceed to Web App" button
    
    // Remove the "Welcome to Inventory System" heading
    document.querySelector('h1').style.display = 'none';
});



