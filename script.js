fetch('http://localhost:1337/api/about?populate=*')
  .then(res => res.json())
  .then(response => {
    // Check what data came back in your console
    console.log("Local Strapi Data:", response.data);

    // In Strapi v5, data is accessed directly from response.data
    const aboutData = response.data;

    // Update your web page elements
    document.getElementById('about-title').innerText = aboutData.title;
    document.getElementById('about-content').innerText = aboutData.description; // or whatever field name you created
  })
  .catch(error => {
    console.error("Error fetching Strapi data:", error);
  });fetch('http://localhost:1337/api/about?populate=*')
  .then(res => res.json())
  .then(response => {
    // Check what data came back in your console
    console.log("Local Strapi Data:", response.data);

    const aboutData = response.data;

    if (aboutData) {
      // Updates elements safely
      const titleElem = document.getElementById('about-title');
      const contentElem = document.getElementById('about-content');

      if (titleElem) {
        titleElem.innerText = aboutData.title || "No Title Found";
      }

      if (contentElem) {
        // Fallback checks for common Strapi field names
        contentElem.innerText = aboutData.description || aboutData.content || aboutData.text || "No Content Found";
      }
    }
  })
  .catch(error => {
    console.error("Error fetching Strapi data:", error);
  });