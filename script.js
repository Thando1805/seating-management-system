// Table data storage
let tables = [];
let selectedTableId = null;
let nextTableId = 1;

// Initialize with sample tables
function initializeSampleTables() {
    tables = [
        { id: nextTableId++, top: 10, left: 20, capacity: 4, status: "available", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 10, left: 150, capacity: 2, status: "occupied", guests: 2, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 10, left: 280, capacity: 6, status: "available", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 130, left: 30, capacity: 4, status: "occupied", guests: 4, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 130, left: 170, capacity: 8, status: "available", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 130, left: 340, capacity: 4, status: "reserved", guests: 0, reservation: "Thando Mazibuko", reservationTime: "7:30 PM" },
        { id: nextTableId++, top: 250, left: 50, capacity: 2, status: "occupied", guests: 1, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 250, left: 180, capacity: 6, status: "available", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 250, left: 320, capacity: 4, status: "cleaning", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 370, left: 100, capacity: 8, status: "available", guests: 0, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 370, left: 250, capacity: 4, status: "occupied", guests: 3, reservation: null, reservationTime: null },
        { id: nextTableId++, top: 370, left: 400, capacity: 2, status: "available", guests: 0, reservation: null, reservationTime: null }
    ];
    
    renderFloorPlan();
    updateStatistics();
}

// Render the floor plan with tables
function renderFloorPlan() {
    const floorPlan = document.getElementById('floorPlan');
    floorPlan.innerHTML = '';
    
    tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = `table capacity-${table.capacity} ${table.status}`;
        tableElement.style.top = `${table.top}px`;
        tableElement.style.left = `${table.left}px`;
        tableElement.id = `table-${table.id}`;
        
        tableElement.innerHTML = `
            <div class="table-number">Table ${table.id}</div>
            <div class="table-status">${table.status.toUpperCase()}</div>
            <div class="table-capacity">${table.capacity} seats</div>
        `;
        
        tableElement.addEventListener('click', () => selectTable(table.id));
        floorPlan.appendChild(tableElement);
    });
    
    updateStatistics();
}

// Update statistics counters
function updateStatistics() {
    const availableCount = tables.filter(t => t.status === 'available').length;
    const occupiedCount = tables.filter(t => t.status === 'occupied').length;
    const reservedCount = tables.filter(t => t.status === 'reserved').length;
    const totalCount = tables.length;
    
    document.getElementById('availableCount').textContent = availableCount;
    document.getElementById('occupiedCount').textContent = occupiedCount;
    document.getElementById('reservedCount').textContent = reservedCount;
    document.getElementById('totalCount').textContent = totalCount;
}

// Select a table and show its details
function selectTable(tableId) {
    selectedTableId = tableId;
    const table = tables.find(t => t.id === tableId);
    
    // Update visual selection
    document.querySelectorAll('.table').forEach(el => {
        el.classList.remove('selected');
        if (el.id === `table-${tableId}`) {
            el.classList.add('selected');
        }
    });
    
    // Update form with table data
    document.getElementById('tableStatus').value = table.status;
    document.getElementById('guestsCount').value = table.guests;
    document.getElementById('reservationName').value = table.reservation || '';
    document.getElementById('reservationTime').value = table.reservationTime || '';
    
    // Update table info panel
    const tableInfo = document.getElementById('tableInfo');
    tableInfo.innerHTML = `
        <h3>Table ${table.id}</h3>
        <div class="table-details">
            <div class="detail-item">
                <span>Status:</span>
                <span class="status-${table.status}">${table.status.toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <span>Capacity:</span>
                <span>${table.capacity} seats</span>
            </div>
            <div class="detail-item">
                <span>Current Guests:</span>
                <span>${table.guests}</span>
            </div>
            <div class="detail-item">
                <span>Reservation:</span>
                <span>${table.reservation || 'None'}</span>
            </div>
            <div class="detail-item">
                <span>Reservation Time:</span>
                <span>${table.reservationTime || 'N/A'}</span>
            </div>
        </div>
    `;
    
    // Enable/disable form fields based on status
    updateFormFields();
}

// Update form fields based on selected status
function updateFormFields() {
    const status = document.getElementById('tableStatus').value;
    const guestsInput = document.getElementById('guestsCount');
    const reservationNameInput = document.getElementById('reservationName');
    const reservationTimeInput = document.getElementById('reservationTime');
    
    if (status === 'reserved') {
        guestsInput.value = 0;
        guestsInput.disabled = true;
        reservationNameInput.disabled = false;
        reservationTimeInput.disabled = false;
    } else if (status === 'available' || status === 'cleaning') {
        guestsInput.value = 0;
        guestsInput.disabled = true;
        reservationNameInput.disabled = true;
        reservationTimeInput.disabled = true;
    } else { // occupied
        guestsInput.disabled = false;
        reservationNameInput.disabled = true;
        reservationTimeInput.disabled = true;
    }
}

// Apply changes from form to selected table
function applyChanges() {
    if (!selectedTableId) {
        showNotification('Please select a table first', 'error');
        return;
    }
    
    const tableIndex = tables.findIndex(t => t.id === selectedTableId);
    const status = document.getElementById('tableStatus').value;
    const guests = parseInt(document.getElementById('guestsCount').value) || 0;
    const reservationName = document.getElementById('reservationName').value.trim();
    const reservationTime = document.getElementById('reservationTime').value.trim();
    
    // Validate guests count doesn't exceed capacity
    if (status === 'occupied' && guests > tables[tableIndex].capacity) {
        showNotification(`Guests (${guests}) cannot exceed table capacity (${tables[tableIndex].capacity})`, 'error');
        return;
    }
    
    // Update table data
    tables[tableIndex].status = status;
    tables[tableIndex].guests = guests;
    
    if (status === 'reserved') {
        tables[tableIndex].reservation = reservationName || "Reserved";
        tables[tableIndex].reservationTime = reservationTime || "N/A";
        tables[tableIndex].guests = 0; // Reserved tables have no current guests
    } else {
        tables[tableIndex].reservation = null;
        tables[tableIndex].reservationTime = null;
    }
    
    // Update the table display
    const tableElement = document.getElementById(`table-${selectedTableId}`);
    tableElement.className = `table capacity-${tables[tableIndex].capacity} ${status} selected`;
    tableElement.querySelector('.table-status').textContent = status.toUpperCase();
    
    updateStatistics();
    selectTable(selectedTableId); // Refresh the details panel
    
    showNotification(`Table ${selectedTableId} updated to ${status} status`, 'success');
}

// Auto-assign a table based on party size
function autoAssignTable() {
    const partySize = parseInt(prompt("Enter party size (1-8):", "2"));
    if (isNaN(partySize) || partySize < 1 || partySize > 8) {
        showNotification("Please enter a valid party size between 1 and 8", 'error');
        return;
    }
    
    // Find available tables with sufficient capacity
    const suitableTables = tables.filter(t => 
        t.status === 'available' && t.capacity >= partySize
    );
    
    if (suitableTables.length === 0) {
        showNotification(`No available tables for ${partySize} guests. Try a different party size or check reserved tables.`, 'warning');
        return;
    }
    
    // Select the table with the closest capacity
    const bestTable = suitableTables.reduce((prev, curr) => 
        Math.abs(curr.capacity - partySize) < Math.abs(prev.capacity - partySize) ? curr : prev
    );
    
    selectTable(bestTable.id);
    showNotification(`Table ${bestTable.id} recommended for ${partySize} guests (${bestTable.capacity} seats)`, 'success');
}

// Mark selected table as reserved
function reserveSelectedTable() {
    if (!selectedTableId) {
        showNotification('Please select a table first', 'error');
        return;
    }
    
    const tableIndex = tables.findIndex(t => t.id === selectedTableId);
    
    if (tables[tableIndex].status === 'occupied') {
        showNotification('Cannot reserve an occupied table', 'error');
        return;
    }
    
    const reservationName = prompt("Enter reservation name:", "Thando Mazibuko");
    if (!reservationName) return;
    
    const reservationTime = prompt("Enter reservation time:", "7:30 PM");
    
    tables[tableIndex].status = 'reserved';
    tables[tableIndex].reservation = reservationName;
    tables[tableIndex].reservationTime = reservationTime || "N/A";
    tables[tableIndex].guests = 0;
    
    renderFloorPlan();
    selectTable(selectedTableId);
    showNotification(`Table ${selectedTableId} reserved for ${reservationName}`, 'success');
}

// Mark selected table for cleaning
function markTableForCleaning() {
    if (!selectedTableId) {
        showNotification('Please select a table first', 'error');
        return;
    }
    
    const tableIndex = tables.findIndex(t => t.id === selectedTableId);
    tables[tableIndex].status = 'cleaning';
    tables[tableIndex].guests = 0;
    tables[tableIndex].reservation = null;
    tables[tableIndex].reservationTime = null;
    
    renderFloorPlan();
    selectTable(selectedTableId);
    showNotification(`Table ${selectedTableId} marked for cleaning`, 'success');
}

// Add a new table
function addNewTable() {
    const capacity = parseInt(prompt("Enter table capacity (2, 4, 6, or 8):", "4"));
    if (![2, 4, 6, 8].includes(capacity)) {
        showNotification("Table capacity must be 2, 4, 6, or 8", 'error');
        return;
    }
    
    // Find a position for the new table
    const top = Math.floor(Math.random() * 300) + 50;
    const left = Math.floor(Math.random() * 400) + 20;
    
    const newTable = {
        id: nextTableId++,
        top: top,
        left: left,
        capacity: capacity,
        status: "available",
        guests: 0,
        reservation: null,
        reservationTime: null
    };
    
    tables.push(newTable);
    renderFloorPlan();
    selectTable(newTable.id);
    showNotification(`New table ${newTable.id} added (${capacity} seats)`, 'success');
}

// Mark all tables as available
function markAllTablesAvailable() {
    if (!confirm("Mark ALL tables as available? This will clear all reservations and occupancy.")) {
        return;
    }
    
    tables.forEach(table => {
        table.status = 'available';
        table.guests = 0;
        table.reservation = null;
        table.reservationTime = null;
    });
    
    renderFloorPlan();
    showNotification('All tables marked as available', 'success');
}

// Mark all tables as occupied (for simulation/testing)
function markAllTablesOccupied() {
    if (!confirm("Mark ALL tables as occupied? This is for simulation purposes.")) {
        return;
    }
    
    tables.forEach(table => {
        table.status = 'occupied';
        table.guests = Math.min(table.capacity, Math.floor(Math.random() * table.capacity) + 1);
        table.reservation = null;
        table.reservationTime = null;
    });
    
    renderFloorPlan();
    showNotification('All tables marked as occupied (simulation)', 'success');
}

// Reset form to default values
function resetForm() {
    document.getElementById('tableStatus').value = 'available';
    document.getElementById('guestsCount').value = 0;
    document.getElementById('reservationName').value = '';
    document.getElementById('reservationTime').value = '';
    updateFormFields();
}

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    
    // Add type class
    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'warning') {
        notification.classList.add('warning');
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize the application
function initApp() {
    initializeSampleTables();
    
    // Event listeners for buttons
    document.getElementById('autoAssignBtn').addEventListener('click', autoAssignTable);
    document.getElementById('reserveTableBtn').addEventListener('click', reserveSelectedTable);
    document.getElementById('clearTableBtn').addEventListener('click', markTableForCleaning);
    document.getElementById('addTableBtn').addEventListener('click', addNewTable);
    document.getElementById('applyChangesBtn').addEventListener('click', applyChanges);
    document.getElementById('resetFormBtn').addEventListener('click', resetForm);
    document.getElementById('markAllAvailableBtn').addEventListener('click', markAllTablesAvailable);
    document.getElementById('markAllOccupiedBtn').addEventListener('click', markAllTablesOccupied);
    
    // Update form fields when status changes
    document.getElementById('tableStatus').addEventListener('change', updateFormFields);
    
    // Initialize form fields
    updateFormFields();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);