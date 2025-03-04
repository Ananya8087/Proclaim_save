function disableSaveButton() {
    const saveButton = document.querySelector('.btn.secondary.has-right-icon');
    if (saveButton) {
        saveButton.disabled = true;
        console.log('Save & Exit button disabled.');
    } else {
        console.log('Save & Exit button not found.');
    }
}

function disableUnlockButton() {
    const unlockDetails = document.querySelector('unlock-details');
    
    const unlockButton = unlockDetails.querySelector('.btn-primary');
    
    //unlockButton.remove();
    unlockButton.disabled = true;
    console.log('Unlock button disabled.');
    
    
}

// Check for unlock-details and disable the button every 1 second
setInterval(disableUnlockButton, 10);

// Check every 1 second if the button exists and disable it
setInterval(disableSaveButton, 10);
function observeRows() {
    const container = document.querySelector('.tabulation-content');
    if (!container) {
        console.error('Container for rows not found.');
        return;
    }

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('tablation--row--main')) {
                        console.log('Row added.');
                        saveAllData();
                        
                        node.setAttribute('data-processed', 'true');
                        restoreCategories(node);
                        addEventListenersToAmountInputs(); // Add event listeners to new inputs
                        calculateAndDisplayTotal(); // Recalculate total on new row addition
                        printRowData(node);
                    }
                });

                mutation.removedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('tablation--row--main')) {
                        console.log('Row removed.');
                        calculateAndDisplayTotal(); // Recalculate total on row removal
                    }
                });
            }
        });
    });

    // Observe mutations in the container itself, in case it's dynamically added or modified
    observer.observe(container, { childList: true, subtree: true });

    // Initial processing of any rows already present
    const initialRows = document.querySelectorAll('.tablation--row--main');
    console.log(`Initial load: Found ${initialRows.length} rows.`);
    initialRows.forEach((row) => {
        if (!row.hasAttribute('data-processed')) {
            row.setAttribute('data-processed', 'true');
            restoreCategories(row);
            addEventListenersToAmountInputs(); // Add event listeners to existing inputs
        }
    });

    // Create buttons for saving and restoring data
    createSaveButton();
    createRestoreButton();
}

// Delay the execution of observeRows by 10 seconds after the page loads
setTimeout(observeRows, 10000);


// Function to restore values for Category Level 1 and Category Level 2 from saved data
function restoreCategories(row, index) {
    console.log(`Processing row ${index + 1}`);

    // Assuming savedData is fetched from localStorage or another source
    const savedData = JSON.parse(localStorage.getItem('savedData'));

    if (savedData && savedData.length > index) {
        const rowData = savedData[index];
        document.querySelector('input[placeholder="Enter name"]').value = roomName;
        console.log("roomname:",roomName); // Restore roomName



        const categoryLevel1 = row.querySelector('#categoryLevel1');
        if (categoryLevel1) {
            console.log(`Row ${index + 1}: Category Level 1 dropdown found.`);
            const categoryLevel1Option = Array.from(categoryLevel1.options).find(option => option.value === rowData.categoryLevel1);
            if (categoryLevel1Option) {
                categoryLevel1Option.selected = true;
                categoryLevel1.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`Row ${index + 1}: Selected "${rowData.categoryLevel1}" for Category Level 1.`);
            } else {
                console.log(`Row ${index + 1}: Option "${rowData.categoryLevel1}" not found in Category Level 1.`);
            }
        } else {
            console.log(`Row ${index + 1}: Category Level 1 dropdown not found.`);
        }

        // Wait for Category Level 2 to be enabled before selecting
        const observer2 = new MutationObserver(() => {
            const categoryLevel2 = row.querySelector('#categoryLevel2');
            if (categoryLevel2 && !categoryLevel2.disabled) {
                console.log(`Row ${index + 1}: Category Level 2 dropdown is now enabled.`);
                const categoryLevel2Option = Array.from(categoryLevel2.options).find(option => option.value === rowData.categoryLevel2);
                if (categoryLevel2Option) {
                    categoryLevel2Option.selected = true;
                    categoryLevel2.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Row ${index + 1}: Selected "${rowData.categoryLevel2}" for Category Level 2.`);
                } else {
                    console.log(`Row ${index + 1}: Option "${rowData.categoryLevel2}" not found in Category Level 2.`);
                }
                observer2.disconnect();
            }
        });

        observer2.observe(categoryLevel2, { attributes: true, attributeFilter: ['disabled'] });
        console.log(`Row ${index + 1}: Observer set up for Category Level 2.`);
    } else {
        console.log(`Row ${index + 1}: No saved data found for restoration.`);
    }
}

// Function to save data from all rows
function saveAllData() {
    const rows = document.querySelectorAll('.tablation--row--main');
    const data = [];
    const roomName = document.querySelector('input[placeholder="Enter name"]').value;
    console.log(rows);
    console.log(data);
    
    rows.forEach(row => {
        const rowData = {
            rowId: row.id,
            roomName: roomName,
            billDate: row.querySelector('input[type="date"]').value,
            billNo: row.querySelector('input[placeholder="Enter bill no"]').value,
            categoryLevel1: row.querySelector('#categoryLevel1').value,
            categoryLevel2: row.querySelector('#categoryLevel2').value,
            lengthOfStay: row.querySelector('input[apptwodigitdecimanumber]').value,
            amount: row.querySelector('input[numberplusminusonly]').value,
            additionalInfo: []
        };

        const additionalInfoDivs = row.querySelectorAll('.show-NME-list .capsule-label small');
        additionalInfoDivs.forEach(div => {
            rowData.additionalInfo.push(div.innerText);
        });

        data.push(rowData);
    });

    localStorage.setItem('savedData', JSON.stringify(data));
    //alert('Data saved for all rows!');
    console.log('Saved Data:', data);


}
// Function to create new rows
function createNewRow() {
  const newRowButton = document.querySelector('.btn.new-bill--btn');
  if (newRowButton) {
    newRowButton.click(); // Simulate a click on the "New Bill" button
    setTimeout(() => {
      observeRows(); // Call observeRows() after a delay to process the new row
    }, 1000); // Adjust the delay as needed
  } else {
    console.error('New Bill button not found.');
  }
}

// Example usage: Call createNewRow() when you want to add a new row
//createNewRow();
function addAdditionalInfo(row, additionalInfo) {
    const nmeListContainer = row.querySelector('.show-NME-list');

    // Clear any existing additional info
    while (nmeListContainer.firstChild) {
        nmeListContainer.removeChild(nmeListContainer.firstChild);
    }

    additionalInfo.forEach(info => {
        const nmeName = info; // Assuming info contains the NME name
        const nmeAmount = ''; // You need to parse the amount from info if available

        // Create NME entry
        const infoDiv = document.createElement('div');
        infoDiv.className = 'capsule-label';
        infoDiv.innerHTML = `<small>${nmeName} <span class="ml-2">${nmeAmount}</span></small>`; // Adjust the structure as needed

        nmeListContainer.appendChild(infoDiv);
    });
}


// Function to restore all saved data into rows
function restoreAllData() {
    console.log('Restoring all data...');
    const savedData = JSON.parse(localStorage.getItem('savedData'));

    if (savedData && savedData.length) {
        savedData.forEach((rowData, index) => {
            document.querySelector('input[placeholder="Enter name"]').value = rowData.roomName;
           
            console.log("roomname:",rowData.roomName);
            
            createNewRow(rowData.rowId);
            

            const row = document.getElementById(rowData.rowId);
            row.querySelector('input[type="date"]').value = rowData.billDate;
            row.querySelector('input[placeholder="Enter bill no"]').value = rowData.billNo;

            const categoryLevel1 = row.querySelector('#categoryLevel1');
            const categoryLevel1Option = Array.from(categoryLevel1.options).find(option => option.value === rowData.categoryLevel1);
            if (categoryLevel1Option) {
                categoryLevel1Option.selected = true;
                categoryLevel1.dispatchEvent(new Event('change', { bubbles: true }));
            }

            const observer = new MutationObserver(() => {
                const categoryLevel2Select = row.querySelector('#categoryLevel2');
                if (categoryLevel2Select && !categoryLevel2Select.disabled) {
                    const categoryLevel2Option = Array.from(categoryLevel2Select.options).find(option => option.value === rowData.categoryLevel2);
                    if (categoryLevel2Option) {
                        categoryLevel2Option.selected = true;
                        categoryLevel2Select.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    observer.disconnect();
                }
            });

            observer.observe(row.querySelector('#categoryLevel2'), { attributes: true, attributeFilter: ['disabled'] });

            row.querySelector('input[apptwodigitdecimanumber]').value = rowData.lengthOfStay;
            row.querySelector('input[numberplusminusonly]').value = rowData.amount;
            addAdditionalInfo(row, rowData.additionalInfo);

            // Restore Additional Info (NME)
            // Restore Additional Info (NME)
            const nmeListContainer = row.querySelector('.show-NME-list');
            rowData.additionalInfo.forEach(info => {
                const nmeName = info; // Assuming info contains the NME name
                const nmeAmount = ''; // You need to parse the amount from info if available

                // Create NME entry if not already present
                const nmeInput = row.querySelector('input[placeholder="Enter NME"]');
                if (nmeInput && nmeName) {
                    const existingNME = Array.from(nmeListContainer.querySelectorAll('.capsule-label small')).find(div => div.innerText.trim() === nmeName);
                    if (!existingNME) {
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'capsule-label';
                        infoDiv.innerHTML = `<small>${nmeName}</small><input class="nme-amount-input" type="number" value="${nmeAmount}" />`; // Added NME amount input
                        nmeListContainer.appendChild(infoDiv);
                    }
                }
            });

            // Click on "Enter NME" button if exists
            const enterNMEButton = row.querySelector('.enter-nme-button');
            if (enterNMEButton) {
                enterNMEButton.click();
            }
        });

        calculateAndDisplayTotal();
        console.log('Data restored for all rows:', savedData);
    } else {
        console.log('No saved data found to restore.');
    }
}

    
function calculateAndDisplayTotal() {
    const totalSpan = document.querySelector('div.text-right.text-truncate > span');
    if (!totalSpan) return;

    let totalAmount = 0;
    const amountInputs = document.querySelectorAll('input[numberplusminusonly]');
    const nmeAmountInputs = document.querySelectorAll('.nme-amount-input'); // Adjust the selector as needed

    amountInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalAmount += value;
    });

    nmeAmountInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalAmount += value;
    });

    totalSpan.innerText = totalAmount.toFixed(2); // Adjust as per your formatting needs
}

// Function to add event listeners to amount inputs
function addEventListenersToAmountInputs() {
    const amountInputs = document.querySelectorAll('input[numberplusminusonly]');
    const nmeAmountInputs = document.querySelectorAll('.nme-amount-input'); // Adjust the selector as needed

    amountInputs.forEach(input => {
        input.addEventListener('input', calculateAndDisplayTotal);
    });

    nmeAmountInputs.forEach(input => {
        input.addEventListener('input', calculateAndDisplayTotal);
    });
}

// Call the function initially to calculate and display the initial total
calculateAndDisplayTotal();
addEventListenersToAmountInputs();


// Call the function initially to calculate and display the initial total
calculateAndDisplayTotal();
addEventListenersToAmountInputs();

    

// Call the function initially to calculate and display the initial total
//calculateAndDisplayTotal();
    
// Function to print row data
function printRowData(row) {
    const rowData = {
        roomName: document.querySelector('input[placeholder="Enter name"]').value,
        billDate: row.querySelector('input[type="date"]').value,
        billNo: row.querySelector('input[placeholder="Enter bill no"]').value,
        categoryLevel1: row.querySelector('#categoryLevel1').value,
        categoryLevel2: row.querySelector('#categoryLevel2').value,
        lengthOfStay: row.querySelector('input[apptwodigitdecimanumber]').value,
        amount: row.querySelector('input[numberplusminusonly]').value,
        additionalInfo: []
    };

    const additionalInfoDivs = row.querySelectorAll('.show-NME-list .capsule-label small');
    additionalInfoDivs.forEach(div => {
        rowData.additionalInfo.push(div.innerText);
    });

    console.log('Row Data:', rowData);
}

// Function to create save button
function createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save All Data';
    saveButton.id = 'save-all-data-button';
    saveButton.style.position = 'fixed';
    saveButton.style.top = '61px';
    saveButton.style.right = '210px';
    document.body.appendChild(saveButton);

    saveButton.addEventListener('click', saveAllData);
}

// Function to create restore button
function createRestoreButton() {
    const restoreButton = document.createElement('button');
    restoreButton.innerText = 'Restore All Data';
    restoreButton.id = 'restore-all-data-button';
    restoreButton.style.position = 'fixed';
    restoreButton.style.top = '61px';
    restoreButton.style.right = '70px';
    document.body.appendChild(restoreButton);

    restoreButton.addEventListener('click', restoreAllData);
    //restoreButton.addEventListener('click', calculateAndDisplayTotal);
}

// Initial setup: Create save and restore buttons
createSaveButton();
createRestoreButton();
