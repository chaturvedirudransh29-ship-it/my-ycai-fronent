// 1. Define the API URL with your laptop's Wi-Fi IP address
onst API_URL = "http://192.168.137.1:1337/api/about-page?populate=*";

// 2. Helper function to parse Strapi Rich Text Blocks into styled HTML sub-cards
function parseBlocksToHTML(blocks) {
  if (!blocks) return '';
  if (typeof blocks === 'string') return `<div class="sub-card"><p>${blocks}</p></div>`;
  
  if (Array.isArray(blocks)) {
    return blocks.map(block => {
      // Heading blocks (h1-h6)
      if (block.type === 'heading') {
        const level = block.level || 3;
        const headingText = block.children ? block.children.map(c => {
          let text = c.text || '';
          if (c.bold) text = `<strong>${text}</strong>`;
          if (c.italic) text = `<em>${text}</em>`;
          return text;
        }).join('') : '';
        return `<div class="sub-card"><h${level}>${headingText}</h${level}></div>`;
      }
      
      // Paragraph blocks
      if (block.type === 'paragraph') {
        const paragraphText = block.children ? block.children.map(c => {
          let text = c.text || '';
          if (c.bold) text = `<strong>${text}</strong>`;
          if (c.italic) text = `<em>${text}</em>`;
          return text;
        }).join('') : '';
        return `<div class="sub-card"><p>${paragraphText}</p></div>`;
      }

      // List blocks
      if (block.type === 'list') {
        const listTag = block.format === 'ordered' ? 'ol' : 'ul';
        const items = block.children ? block.children.map(item => {
          const itemText = item.children ? item.children.map(c => c.text || '').join('') : '';
          return `<li>${itemText}</li>`;
        }).join('') : '';
        return `<div class="sub-card"><${listTag}>${items}</${listTag}></div>`;
      }

      return '';
    }).join('');
  }
  
  return '';
}

// 3. Main function to fetch data and render the About Page content
async function loadAboutPage() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const result = await response.json();
    const data = result.data;
    if (!data) return;

    // Set Title and Subtitle
    const titleEl = document.getElementById("about-title");
    const subtitleEl = document.getElementById("about-subtitle");
    if (titleEl) titleEl.textContent = data.title || "";
    if (subtitleEl) subtitleEl.textContent = data.subtitle || "";

    // Parse Rich Text Blocks for Story and Mission
    const storyEl = document.getElementById("about-story");
    const missionEl = document.getElementById("about-mission");
    if (storyEl) storyEl.innerHTML = parseBlocksToHTML(data.story);
    if (missionEl) missionEl.innerHTML = parseBlocksToHTML(data.mission);

    // Cover Image Handling
    const imgEl = document.getElementById("about-image");
    if (imgEl && data.coverImage) {
      const imgData = data.coverImage;
      let imgUrl = "";

      if (Array.isArray(imgData) && imgData.length > 0) {
        imgUrl = imgData[0].url;
      } else if (imgData.url) {
        imgUrl = imgData.url;
      }

      if (imgUrl) {
        // Prepend backend host if image URL is relative
        if (imgUrl.startsWith("/")) {
          imgUrl = `http://192.168.137.1:1337${imgUrl}`;
        }
        imgEl.src = imgUrl;
        imgEl.style.display = "block";
      }
    }
  } catch (error) {
    console.error("Error fetching About page data:", error);
  }
}

// 4. Run setup when page finishes loading
document.addEventListener("DOMContentLoaded", loadAboutPage);
