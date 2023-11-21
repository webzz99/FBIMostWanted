document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api.fbi.gov/@wanted?pageSize=2000?poster_classification=All', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      // Add any other headers or authentication tokens here
      "access-control-allow-credentials": "true",
      "access-control-expose-headers": "*",
      "alt-svc": "h3=\":443\"; ma=86400",
      "cf-cache-status": "DYNAMIC",
      "cf-ray": "82302be45f77d184-LHR",
      "content-length": "27",
      "content-type": "application/json",
      "date": "Wed, 08 Nov 2023 19:20:07 GMT",
      "server": "cloudflare",
      "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
      "x-content-type-options": "nosniff"
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); 
    })
    .then(data => {
      const body = document.body;

      const totalItemsElement = document.createElement('p');
      totalItemsElement.textContent = `Total items: ${data.total}`;
      body.appendChild(totalItemsElement);

      // Populate crime categories dynamically
      const crimeCategorySelect = document.createElement('select');
      crimeCategorySelect.classList = 'crimeCategorySelect';
      crimeCategorySelect.innerHTML = `<option value="$poster_classification">All Categories</option>`;
      
      const uniqueCategories = [...new Set(data.items.map(item => item.poster_classification))];
      uniqueCategories.forEach(category => {
        const optionElement = document.createElement('option');
        optionElement.value = category;
        optionElement.textContent = category;
        crimeCategorySelect.appendChild(optionElement);
      });

      body.appendChild(crimeCategorySelect);

      // Assuming there is an array of items in the response
      data.items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const titleElement = document.createElement('h3');
        titleElement.textContent = `Title: ${item.title}`;
        itemContainer.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = `Description: ${item.description}`;
        itemContainer.appendChild(descriptionElement);

        const crimeCategoryElement = document.createElement('p');
        crimeCategoryElement.textContent = `Poster Classification: ${item.poster_classification}`;
        itemContainer.appendChild(crimeCategoryElement);

        const warningMElement = document.createElement('p');
        warningMElement.textContent = `Warning Message: ${item.warning_message}`;
        itemContainer.appendChild(warningMElement);

        const maxRewardElement = document.createElement('p');
        maxRewardElement.textContent = `Reward Max: ${item.reward_text}`;
        itemContainer.appendChild(maxRewardElement);


        // Display only the first image
        if (item.images && item.images.length > 0) {
          const imagesContainer = document.createElement('div');
          imagesContainer.classList.add('images-container');

          const imgElement = document.createElement('img');
          imgElement.src = item.images[0].original; // Use only the first image
          imgElement.alt = `Image for ${item.title}`;

          imagesContainer.appendChild(imgElement);
          itemContainer.appendChild(imagesContainer);
        }

        body.appendChild(itemContainer);
       
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});