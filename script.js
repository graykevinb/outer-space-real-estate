document.addEventListener('DOMContentLoaded', function() {
    displayListings(listings);

    document.getElementById('apply-filters').addEventListener('click', applyFilters);
});

function displayListings(listingsToShow) {
    const container = document.getElementById('listings-container');
    container.innerHTML = '';

    listingsToShow.forEach(listing => {
        const listingDiv = document.createElement('div');
        listingDiv.className = 'listing';
        listingDiv.onclick = () => showDetails(listing);

        listingDiv.innerHTML = `
            <img src="${listing.image}" alt="${listing.title}">
            <div class="listing-content">
                <h3>${listing.title}</h3>
                <div class="price">$${listing.price.toLocaleString()}</div>
                <div class="features">
                    ${listing.features.map(feature => `<span>${feature}</span>`).join('')}
                </div>
                <div class="description">${listing.description}</div>
            </div>
        `;

        container.appendChild(listingDiv);
    });
}

function applyFilters() {
    const planet = document.getElementById('planet-select').value;
    const minPrice = parseInt(document.getElementById('price-min').value) || 0;
    const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;

    const checkedFeatures = Array.from(document.querySelectorAll('.features-checkboxes input:checked')).map(cb => cb.value);

    const filtered = listings.filter(listing => {
        if (planet && listing.planet !== planet) return false;
        if (listing.price < minPrice || listing.price > maxPrice) return false;
        if (checkedFeatures.length > 0) {
            const hasFeature = checkedFeatures.some(feature => listing.features.includes(feature));
            if (!hasFeature) return false;
        }
        return true;
    });

    displayListings(filtered);
}

function showDetails(listing) {
    openListingModal(listing);
}

// Modal helpers
function openListingModal(listing) {
    const modal = document.getElementById('listing-modal');
    modal.setAttribute('aria-hidden', 'false');

    document.getElementById('modal-image').src = listing.image;
    document.getElementById('modal-image').alt = listing.title;
    document.getElementById('modal-title').textContent = listing.title;
    document.getElementById('modal-price').textContent = `$${listing.price.toLocaleString()}`;
    document.getElementById('modal-description').textContent = listing.description;

    const featuresContainer = document.getElementById('modal-features');
    featuresContainer.innerHTML = '';
    listing.features.forEach(f => {
        const span = document.createElement('span');
        span.textContent = f;
        featuresContainer.appendChild(span);
    });

    // focus trap-ish
    document.getElementById('modal-close').focus();

    // close handlers
    document.getElementById('modal-close').onclick = closeListingModal;
    document.getElementById('close-btn').onclick = closeListingModal;
    document.getElementById('modal-backdrop')?.addEventListener('click', closeListingModal);
    document.addEventListener('keydown', escKeyClose);

    // Inquire button (placeholder)
    document.getElementById('inquire-btn').onclick = () => {
        window.location.href = `mailto:info@example.com?subject=Inquiry%20about%20${encodeURIComponent(listing.title)}`;
    };
}

function closeListingModal() {
    const modal = document.getElementById('listing-modal');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', escKeyClose);
}

function escKeyClose(e) {
    if (e.key === 'Escape') closeListingModal();
}
