elements_row = [document.getElementById('letter1'), document.getElementById('letter2'), document.getElementById('letter3'), document.getElementById('letter4'), document.getElementById('letter5'), document.getElementById('letter6'), document.getElementById('letter7'), document.getElementById('submit-btn'), document.getElementById('clear-btn')];

let wordSet = new Set();
fetch('https://raw.githubusercontent.com/rsura/WordHunt-Solver/main/src/EnglishWords.txt')
  .then(response => response.text())
  .then(text => {
    text.split('\n').forEach(word => wordSet.add(word.trim().toLowerCase()));
  });

function getCombinations(array, length) {
  function p(t, i) {
    if (t.length === length) return [t];
    if (i + 1 > array.length) return [];
    return p(t.concat(array[i]), i + 1).concat(p(t, i + 1));
  }
  return p([], 0);
}

function getPermutations(array) {
  function permute(arr, m = []) {
    if (arr.length === 0) {
      return [m];
    } else {
      return arr.flatMap((v, i) =>
        permute(arr.slice(0, i).concat(arr.slice(i + 1)), m.concat(v))
      );
    }
  }
  return permute(array);
}

function findValidWords(letters) {
  let validWords = new Set();
  let combs = [];
  
  // Get all combinations of letters
  for (let i = 1; i <= letters.length; i++) {
    combs.push(...getCombinations(letters, i));
  }

  // Get all permutations of each combination and check against the word set
  combs.forEach(comb => {
    getPermutations(comb).forEach(perm => {
      const word = perm.join('');
      if (wordSet.has(word) && word.length > 2) {
        validWords.add(word);
      }
    });
  });

  // Convert set to array and sort by length in descending order
  return Array.from(validWords).sort((a, b) => b.length - a.length);
}

function solve() {
  letters = [
    document.getElementById('letter1').value.toLowerCase(),
    document.getElementById('letter2').value.toLowerCase(),
    document.getElementById('letter3').value.toLowerCase(),
    document.getElementById('letter4').value.toLowerCase(),
    document.getElementById('letter5').value.toLowerCase(),
    document.getElementById('letter6').value.toLowerCase()
  ];
  if (document.getElementById('letter7') !== null){
    letters.push(document.getElementById('letter7').value.toLowerCase());
  }
  for (let i = 1; i <= letters.length; i++) {
    let temp = document.getElementById(`letter${i}`);
    if (temp !== null){
        temp.value = temp.value.toUpperCase();
    }
  }

  const validWords = findValidWords(letters);
  for (let i = 0; i < validWords.length; i++) {
    validWords[i] = validWords[i].toUpperCase();
  }
  
  // Display results in the results div
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (validWords.length === 0) {
    // resultsDiv.innerHTML = 'No valid words found.';
    resultsDiv.innerHTML = '<p style="color: red; text-align: center; justify-content: center; font-weight: bold; font-size: xx-large; background-color: white; padding: 10px; border-radius: 20px;">No valid words found</p>';
  } else {
    const wordGroups = {};

    // Group words by length
    validWords.forEach(word => {
      const length = word.length;
      if (!wordGroups[length]) {
        wordGroups[length] = [];
      }
      wordGroups[length].push(word);
    });

    // Create divs for each word length and sort them by length in descending order
    Object.keys(wordGroups).sort((a, b) => b - a).forEach(length => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'word-group';

      const header = document.createElement('h3');
      header.textContent = `${length} Letter Words`;
      groupDiv.appendChild(header);

      wordGroups[length].forEach(word => {
        const wordElem = document.createElement('p');
        wordElem.textContent = word;
        groupDiv.appendChild(wordElem);
      });

      resultsDiv.appendChild(groupDiv);
    });
  }
  document.getElementById('clear-btn').focus();
}

function clearInputs() {
  document.getElementById('letter1').value = '';
  document.getElementById('letter2').value = '';
  document.getElementById('letter3').value = '';
  document.getElementById('letter4').value = '';
  document.getElementById('letter5').value = '';
  document.getElementById('letter6').value = '';
  document.getElementById('results').innerHTML = '';
  document.getElementById('letter1').focus();

  if (document.getElementById('letter7') !== null){
    document.getElementById('letter7').value = '';
  }
}

function getNextValue(elem){
    for(let i = 0; i < elements_row.length; i++){
        if (elem === elements_row[i]){
            temp = elements_row[i+1];
            while(temp === null){
                i++;
                temp = elements_row[i+1];
            }
            return temp;
        }
    }
}

function check_and_move(event, element){
	var input = event.target.value;
    var valid_char = input.match(/^[A-Za-z]+$/);
	var valid_len = (input.length == 1);
    if (!(valid_char && valid_len)) {
		event.target.value = '';
		return;
    } else {
		if (element.value.length === element.maxLength) {
			getNextValue(element).focus();
		} else {
			element.value = '';
		}
	}
}

document.getElementById('letter1').focus();