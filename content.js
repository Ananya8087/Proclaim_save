console.log("save proclaim");

function createSaveButton() {
  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save Data';
  saveButton.id = 'save-data-button';
  saveButton.style.marginTop = '100px';
  saveButton.style.marginRight = '110px';
  document.body.appendChild(saveButton);

  saveButton.addEventListener('click', saveData);
}

function createRestoreButton() {
  const restoreButton = document.createElement('button');
  restoreButton.innerText = 'Restore Data';
  restoreButton.id = 'restore-data-button';
  restoreButton.style.marginTop = '20px';
  document.body.appendChild(restoreButton);

  restoreButton.addEventListener('click', restoreData);
}

function enableCategoryLevel2(row) {
  const categoryLevel2Select = row.querySelector('#categoryLevel2');
  categoryLevel2Select.disabled = false;
  console.log('categoryLevel2 is now enabled for row:', row.id);
}

function createNewRow(rowId) {
  const newRowButton = document.querySelector('.btn.new-bill--btn');
  newRowButton.click(); // Simulate clicking the "New Bill" button to add a new row
  const rows = document.querySelectorAll('.tablation--row--main');
  const newRow = rows[rows.length - 1]; // Get the last row added
  
  newRow.id = rowId; // Assign the rowId to the new row

  // Add change event listener to categoryLevel1 to enable categoryLevel2
  newRow.querySelector('#categoryLevel1').addEventListener('change', function() {
    setTimeout(() => enableCategoryLevel2(newRow), 2000);
  });
}

function saveData() {
  const rows = document.querySelectorAll('.tablation--row--main');
  const data = [];

  rows.forEach(row => {
    const rowData = {
      rowId: row.id,
      billDate: row.querySelector('input[type="date"]').value,
      billNo: row.querySelector('input[placeholder="Enter bill no"]').value,
      categoryLevel1: row.querySelector('#categoryLevel1').value,
      categoryLevel2: row.querySelector('#categoryLevel2').value,
      lengthOfStay: row.querySelector('input[apptwodigitdecimanumber]').value,
      amount: row.querySelector('input[numberplusminusonly]').value,
    };
    data.push(rowData);
  });

  localStorage.setItem('savedData', JSON.stringify(data));
  alert('Data saved!');
  console.log('Saved Data:', data);
}

function restoreData() {
  console.log('Restoring data...');
  const savedData = JSON.parse(localStorage.getItem('savedData'));

  if (savedData && savedData.length) {
    savedData.forEach(rowData => {
      createNewRow(rowData.rowId);

      const row = document.getElementById(rowData.rowId);
      row.querySelector('input[type="date"]').value = rowData.billDate;
      row.querySelector('input[placeholder="Enter bill no"]').value = rowData.billNo;
      row.querySelector('#categoryLevel1').value = rowData.categoryLevel1;
      row.querySelector('#categoryLevel2').value = rowData.categoryLevel2;
      row.querySelector('input[apptwodigitdecimanumber]').value = rowData.lengthOfStay;
      row.querySelector('input[numberplusminusonly]').value = rowData.amount;
    });
    console.log('Data restored:', savedData);
  } else {
    console.log('No data found to restore.');
  }
}

// Create the save and restore buttons
createSaveButton();
createRestoreButton();

// Restore data if available
restoreData();
