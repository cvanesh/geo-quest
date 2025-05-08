// DOM Elements
const homeScreen = document.getElementById('home-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const countriesScreen = document.getElementById('countries-screen');
const flagCountBtns = document.querySelectorAll('.flag-count-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');
const flagImage = document.getElementById('flag-image');
const countryInfo = document.getElementById('country-info');
const countryName = document.getElementById('country-name');
const countryCapital = document.getElementById('country-capital');
const countryContinent = document.getElementById('country-continent');
const nextFlagBtn = document.getElementById('next-flag-btn');
const currentFlagEl = document.getElementById('current-flag');
const totalFlagsEl = document.getElementById('total-flags');
const continentSelector = document.getElementById('continent-selector');
const letterSelector = document.getElementById('letter-selector');
const playAgainBtn = document.getElementById('play-again-btn');
const goHomeBtn = document.getElementById('go-home-btn');
const goToQuizBtn = document.getElementById('go-to-quiz');
const goToCountriesBtn = document.getElementById('go-to-countries');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const countryContinentFilter = document.getElementById('country-continent-filter');
const countryLetterFilter = document.getElementById('country-letter-filter');
const countriesTableBody = document.getElementById('countries-table-body');

// App State
let countries = [];
let quizCountries = [];
let currentIndex = 0;
let flagCount = 0;
let selectedContinent = 'all';
let selectedLetter = 'all';
let hasSeenCurrentFlag = false;

// Initialize the app
async function initApp() {
  try {
    // Fetch country data
    const response = await fetch('data/country.json');
    if (!response.ok) {
      throw new Error('Failed to load country data');
    }
    countries = await response.json();
    
    // Populate continent dropdowns
    populateContinentDropdown(continentSelector);
    populateContinentDropdown(countryContinentFilter);
    
    // Populate letter dropdowns
    populateLetterDropdown(letterSelector);
    populateLetterDropdown(countryLetterFilter);
    
    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing app:', error);
    alert('Failed to load country data. Please try again later.');
  }
}

// Populate continent dropdown
function populateContinentDropdown(selectElement) {
  // Check if countries data is available
  if (!countries || countries.length === 0) {
    console.error('No country data available for populating continents');
    return;
  }
  
  // Get unique continents - handle potential undefined values
  const continents = [...new Set(
    countries
      .map(country => country.continent)
      .filter(continent => continent && continent.trim() !== '')
  )].sort();
  
  // Log for debugging
  console.log('Found continents:', continents);
  
  // Add "All Continents" option
  selectElement.innerHTML = '<option value="all">All Continents</option>';
  
  // Add continent options
  continents.forEach(continent => {
    const option = document.createElement('option');
    option.value = continent;
    option.textContent = continent;
    selectElement.appendChild(option);
  });
}

// Populate letter dropdown
function populateLetterDropdown(selectElement) {
  // Check if countries data is available
  if (!countries || countries.length === 0) {
    console.error('No country data available for populating letters');
    return;
  }
  
  // Get unique first letters
  const letters = [...new Set(
    countries
      .map(country => country.name.charAt(0).toUpperCase())
      .filter(letter => letter && letter.trim() !== '')
  )].sort();
  
  // Log for debugging
  console.log('Found starting letters:', letters);
  
  // Add "All Letters" option
  selectElement.innerHTML = '<option value="all">All Letters</option>';
  
  // Add letter options
  letters.forEach(letter => {
    const option = document.createElement('option');
    option.value = letter;
    option.textContent = letter;
    selectElement.appendChild(option);
  });
}

// Set up event listeners
// Add this to your DOM Elements section
const quizOfficialCountriesOnly = document.getElementById('quiz-official-countries-only');
const countriesCountValue = document.getElementById('countries-count-value');
const officialCountriesOnly = document.getElementById('official-countries-only');

// Add this to your App State section
const officialCountryCodes = [
  'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 
  'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 
  'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 
  'CX', 'CC', 'CO', 'KM', 'CD', 'CG', 'CK', 'CR', 'HR', 'CU', 'CW', 'CY', 'CZ', 'CI', 'DK', 
  'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 
  'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 
  'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 
  'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 
  'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 
  'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 
  'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MK', 'MP', 
  'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 
  'RO', 'RU', 'RW', 'RE', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 
  'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 
  'SD', 'SR', 'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 
  'TN', 'TM', 'TC', 'TV', 'TR', 'UG', 'UA', 'AE', 'GB', 'UM', 'US', 'UY', 'UZ', 'VU', 'VE', 
  'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW', 'AX'
];

// Add to setupEventListeners function
function setupEventListeners() {
  // Make the app title clickable to return to home
  const appTitle = document.getElementById('app-title');
  if (appTitle) {
    appTitle.addEventListener('click', () => {
      showScreen(homeScreen);
    });
  }
  
  // Home screen navigation
  goToQuizBtn.addEventListener('click', () => {
    showScreen(welcomeScreen);
  });
  
  goToCountriesBtn.addEventListener('click', () => {
    showScreen(countriesScreen);
    renderCountriesList();
  });
  
  backToHomeBtn.addEventListener('click', () => {
    showScreen(homeScreen);
  });
  
  goHomeBtn.addEventListener('click', () => {
    showScreen(homeScreen);
  });
  
  // Flag count selection
  flagCountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flagCountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      const count = btn.dataset.count;
      flagCount = count === 'all' ? countries.length : parseInt(count);
      
      startQuizBtn.disabled = false;
    });
  });
  
  // Continent selection
  continentSelector.addEventListener('change', (e) => {
    selectedContinent = e.target.value;
    
    // Reset letter selection if continent is selected
    if (selectedContinent !== 'all') {
      letterSelector.value = 'all';
      selectedLetter = 'all';
    }
  });
  
  // Letter selection
  letterSelector.addEventListener('change', (e) => {
    selectedLetter = e.target.value;
    
    // Reset continent selection if letter is selected
    if (selectedLetter !== 'all') {
      continentSelector.value = 'all';
      selectedContinent = 'all';
    }
  });
  
  // Countries list filters
  countryContinentFilter.addEventListener('change', renderCountriesList);
  countryLetterFilter.addEventListener('change', renderCountriesList);
  
  // Official countries checkbox
  officialCountriesOnly.addEventListener('change', renderCountriesList);
  
  // Make label click also trigger the checkbox change
  const officialCountriesLabel = document.querySelector('label[for="official-countries-only"]');
  if (officialCountriesLabel) {
    officialCountriesLabel.addEventListener('click', (e) => {
      // Prevent default to avoid double-triggering with the checkbox's own change event
      e.preventDefault();
      // Toggle the checkbox
      officialCountriesOnly.checked = !officialCountriesOnly.checked;
      // Manually trigger the render
      renderCountriesList();
    });
  }
  
  // Start quiz button
  startQuizBtn.addEventListener('click', startQuiz);
  
  // Flag click to toggle info or move to next flag
  flagImage.addEventListener('click', handleFlagClick);
  
  // Play again button
  playAgainBtn.addEventListener('click', resetQuiz);
}

// Helper function to show a specific screen
function showScreen(screen) {
  // Hide all screens
  homeScreen.classList.remove('active');
  welcomeScreen.classList.remove('active');
  quizScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  countriesScreen.classList.remove('active');
  
  // Show the requested screen
  screen.classList.add('active');
}

// Start the quiz
function startQuiz() {
  // Filter countries by continent or letter
  let filteredCountries = countries;
  
  // Apply official countries filter if checked
  if (quizOfficialCountriesOnly.checked) {
    filteredCountries = filteredCountries.filter(country => 
      officialCountryCodes.includes(country.code.toUpperCase())
    );
  }
  
  if (selectedContinent !== 'all') {
    filteredCountries = filteredCountries.filter(country => 
      country.continent === selectedContinent
    );
  } else if (selectedLetter !== 'all') {
    filteredCountries = filteredCountries.filter(country => 
      country.name.charAt(0).toUpperCase() === selectedLetter
    );
  }
  
  // Check if we have enough countries for the quiz
  if (filteredCountries.length === 0) {
    if (selectedContinent !== 'all') {
      alert('No countries found for the selected continent. Please choose another option.');
    } else if (selectedLetter !== 'all') {
      alert('No countries found starting with the selected letter. Please choose another option.');
    } else {
      alert('No countries found. Please try again later.');
    }
    return;
  }
  
  // Adjust flag count if needed
  const actualFlagCount = Math.min(flagCount, filteredCountries.length);
  
  // Shuffle and select countries
  quizCountries = shuffleArray([...filteredCountries]).slice(0, actualFlagCount);
  
  // Update UI
  currentIndex = 0;
  currentFlagEl.textContent = 1;
  totalFlagsEl.textContent = quizCountries.length;
  
  // Show first flag
  showFlag(quizCountries[0]);
  
  // Switch screens
  showScreen(quizScreen);
}

// Show a flag
function showFlag(country) {
  // Reset state for new flag
  hasSeenCurrentFlag = false;
  
  // Hide country info but maintain its space
  countryInfo.classList.add('hidden');
  
  // Hide the next flag button (we don't need it anymore)
  if (nextFlagBtn) {
    nextFlagBtn.classList.add('hidden');
  }
  
  // Set flag image
  const flagPath = `data/flags/4x3/${country.code.toLowerCase()}.svg`;
  flagImage.src = flagPath;
  flagImage.alt = `Flag to identify`;
  
  // Prepare country info (hidden until clicked)
  countryName.textContent = country.name;
  countryCapital.textContent = country.capital || 'N/A';
  countryContinent.textContent = country.continent || 'N/A';
}

// Handle flag click - either reveal info or move to next flag
function handleFlagClick() {
  if (!hasSeenCurrentFlag) {
    // First click: reveal country info
    countryInfo.classList.remove('hidden');
    hasSeenCurrentFlag = true;
  } else {
    // Second click: move to next flag
    showNextFlag();
  }
}

// Show next flag
function showNextFlag() {
  // Move to next flag or end quiz
  currentIndex++;
  
  if (currentIndex < quizCountries.length) {
    currentFlagEl.textContent = currentIndex + 1;
    showFlag(quizCountries[currentIndex]);
  } else {
    endQuiz();
  }
}

// End the quiz and show results
function endQuiz() {
  // Switch to results screen
  showScreen(resultsScreen);
}

// Reset quiz to start again
function resetQuiz() {
  showScreen(welcomeScreen);
  
  // Reset selection
  flagCountBtns.forEach(btn => btn.classList.remove('selected'));
  startQuizBtn.disabled = true;
}

// Render the countries list based on filters
function renderCountriesList() {
  // Get filter values
  const continentFilter = countryContinentFilter.value;
  const letterFilter = countryLetterFilter.value;
  const officialOnly = officialCountriesOnly.checked;
  
  // Filter countries
  let filteredCountries = [...countries];
  
  // Apply official countries filter if checked
  if (officialOnly) {
    filteredCountries = filteredCountries.filter(country => 
      officialCountryCodes.includes(country.code.toUpperCase())
    );
  }
  
  // Apply continent filter
  if (continentFilter !== 'all') {
    filteredCountries = filteredCountries.filter(country => 
      country.continent === continentFilter
    );
  }
  
  // Apply letter filter
  if (letterFilter !== 'all') {
    filteredCountries = filteredCountries.filter(country => 
      country.name.charAt(0).toUpperCase() === letterFilter
    );
  }
  
  // Sort countries alphabetically
  filteredCountries.sort((a, b) => a.name.localeCompare(b.name));
  
  // Update count display
  countriesCountValue.textContent = filteredCountries.length;
  
  // Clear existing table
  countriesTableBody.innerHTML = '';
  
  // Populate table with filtered countries
  filteredCountries.forEach(country => {
    const row = document.createElement('tr');
    
    // Flag cell
    const flagCell = document.createElement('td');
    const flagImg = document.createElement('img');
    flagImg.src = `data/flags/4x3/${country.code.toLowerCase()}.svg`;
    flagImg.alt = `${country.name} flag`;
    flagImg.className = 'mini-flag';
    flagCell.appendChild(flagImg);
    
    // Country name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = country.name;
    
    // Capital cell
    const capitalCell = document.createElement('td');
    capitalCell.textContent = country.capital || 'N/A';
    
    // Continent cell
    const continentCell = document.createElement('td');
    continentCell.textContent = country.continent || 'N/A';
    
    // Add cells to row
    row.appendChild(flagCell);
    row.appendChild(nameCell);
    row.appendChild(capitalCell);
    row.appendChild(continentCell);
    
    // Add row to table
    countriesTableBody.appendChild(row);
  });
  
  // Show message if no countries found
  if (filteredCountries.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'No countries found matching the selected filters.';
    cell.style.textAlign = 'center';
    cell.style.padding = '20px';
    row.appendChild(cell);
    countriesTableBody.appendChild(row);
  }
}

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', initApp);