// content.js
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

function saveData() {
  const roomName = document.querySelector('input[placeholder="Enter name"]').value;
  const billDate = document.querySelector('input[type="date"]').value;
  const billNo = document.querySelector('input[placeholder="Enter bill no"]').value;
  const categoryLevel1 = document.querySelector('#categoryLevel1').value;
  const categoryLevel2 = document.querySelector('#categoryLevel2').value;
  const lengthOfStay = document.querySelector('input[type="text"][apptwodigitdecimanumber]').value;
  const amount = document.querySelector('input[type="text"][numberplusminusonly]').value;
  const nme = document.querySelector('.selected--text').innerText;

  const data = { 
    roomName, billDate, billNo, 
    categoryLevel1, categoryLevel2, 
    lengthOfStay, amount, nme 
  };

  localStorage.setItem('savedData', JSON.stringify(data));

  alert('Data saved!');
  console.log('Saved Data:', data);
}

function restoreData() {
  console.log('Restoring data...');
  const savedData = JSON.parse(localStorage.getItem('savedData'));
  if (savedData) {
    document.querySelector('input[placeholder="Enter name"]').value = savedData.roomName;
    document.querySelector('input[type="date"]').value = savedData.billDate;
    document.querySelector('input[placeholder="Enter bill no"]').value = savedData.billNo;
    document.querySelector('#categoryLevel1').value = savedData.categoryLevel1;
    document.querySelector('#categoryLevel2').value = savedData.categoryLevel2;
    document.querySelector('input[type="text"][apptwodigitdecimanumber]').value = savedData.lengthOfStay;
    document.querySelector('input[type="text"][numberplusminusonly]').value = savedData.amount;
    document.querySelector('.selected--text').innerText = savedData.nme;
    console.log('Data restored:', savedData);
  } else {
    console.log('No data found to restore.');
  }
}

createSaveButton();
createRestoreButton();
restoreData();
