document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('nomineesGrid');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    const statsDisplay = document.getElementById('statsDisplay');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    let allData = {
        nominees: [],
        scholars: []
    };
    let currentTab = 'nominees';

    // SVG Icons
    const icons = {
        school: `<svg viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>`,
        recommender: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        city: `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        degree: `<svg viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
        university: `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`
    };

    // Fetch data
    const isLocalFile = window.location.protocol === 'file:';
    const nomineesPath = isLocalFile ? 'nominees.json' : 'nominees.json?t=' + Date.now();
    const scholarsPath = isLocalFile ? 'scholars.json' : 'scholars.json?t=' + Date.now();

    Promise.all([
        fetch(nomineesPath).then(res => res.json()),
        fetch(scholarsPath).then(res => res.json()).catch(() => []) // Handle case where scholars.json might be missing
    ]).then(([nomineesData, scholarsData]) => {
        allData.nominees = nomineesData;
        allData.scholars = scholarsData;
        
        updateUI();
    }).catch(error => {
        console.error('Error loading data:', error);
        statsDisplay.textContent = 'Failed to load data.';
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTab = e.target.getAttribute('data-tab');
            searchInput.value = ''; // Reset search on tab switch
            updateUI();
        });
    });

    function updateUI() {
        const data = allData[currentTab];
        statsDisplay.textContent = `Displaying ${data.length} ${currentTab === 'nominees' ? 'nominees' : 'scholars'}`;
        renderList(data);
    }

    // Render function
    function renderList(data) {
        grid.innerHTML = '';
        
        if (data.length === 0) {
            noResults.classList.remove('hidden');
            grid.classList.add('hidden');
            return;
        }

        noResults.classList.add('hidden');
        grid.classList.remove('hidden');

        const fragment = document.createDocumentFragment();

        data.forEach((person, index) => {
            const card = document.createElement('article');
            
            // Format ID prefix (e.g. [NOM-001], [SCH-001])
            const idNumber = String(index + 1).padStart(3, '0');
            const prefix = currentTab === 'nominees' ? `[NOM-${idNumber}]` : `[SCH-${idNumber}]`;

            if (currentTab === 'nominees') {
                card.className = 'card';
            } else {
                card.className = 'card scholar-card';
            }
            
            card.style.animationDelay = `${(index % 20) * 0.05}s`;

            let cardBody = '';
            
            if (currentTab === 'nominees') {
                cardBody = `
                    <div class="info-item">
                        <div class="icon">${icons.school}</div>
                        <div class="info-content">
                            <span class="info-label">School</span>
                            <span class="info-value school-name">${person.school || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon">${icons.city}</div>
                        <div class="info-content">
                            <span class="info-label">Location</span>
                            <span class="info-value">${person.city || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon">${icons.recommender}</div>
                        <div class="info-content">
                            <span class="info-label">Recommender</span>
                            <span class="info-value">${person.recommender || 'N/A'}</span>
                        </div>
                    </div>
                `;
            } else {
                // Scholars view
                cardBody = `
                    <div class="info-item">
                        <div class="icon">${icons.university}</div>
                        <div class="info-content">
                            <span class="info-label">University</span>
                            <span class="info-value school-name">${person.university || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon">${icons.degree}</div>
                        <div class="info-content">
                            <span class="info-label">Degree</span>
                            <span class="info-value">${person.degree || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon">${icons.school}</div>
                        <div class="info-content">
                            <span class="info-label">High School</span>
                            <span class="info-value">${person.school || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="icon">${icons.city}</div>
                        <div class="info-content">
                            <span class="info-label">Home Location</span>
                            <span class="info-value">${person.city || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-prefix">${prefix}</div>
                <div class="card-header">
                    <h2>${person.name}</h2>
                </div>
                <div class="card-body">
                    ${cardBody}
                </div>
            `;
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }

    // Search functionality with debounce
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const data = allData[currentTab];
            const typeName = currentTab === 'nominees' ? 'nominees' : 'scholars';

            if (!searchTerm) {
                renderList(data);
                statsDisplay.textContent = `Displaying ${data.length} ${typeName}`;
                return;
            }

            const filtered = data.filter(person => {
                const nameMatch = person.name && person.name.toLowerCase().includes(searchTerm);
                const schoolMatch = person.school && person.school.toLowerCase().includes(searchTerm);
                const cityMatch = person.city && person.city.toLowerCase().includes(searchTerm);
                const degreeMatch = person.degree && person.degree.toLowerCase().includes(searchTerm);
                const universityMatch = person.university && person.university.toLowerCase().includes(searchTerm);
                
                return nameMatch || schoolMatch || cityMatch || degreeMatch || universityMatch;
            });

            renderList(filtered);
            statsDisplay.textContent = `Found ${filtered.length} matching ${typeName}`;
        }, 300);
    });
});
