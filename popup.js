document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['inputValues'], (result) => {
    const valuesDiv = document.getElementById('values');
    const inputValues = result.inputValues || {};
    for (const key in inputValues) {
      const p = document.createElement('p');
      p.textContent = `${key}: ${inputValues[key]}`;
      valuesDiv.appendChild(p);
    }
  });
});
