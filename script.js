fetch('http://localhost:1337/api/about-page?populate=*')
  .then(res => res.json())
  .then(response => {
    const data = response.data;
    if (!data) return;

    // 1. Helper function to parse Strapi Rich Text Blocks into HTML paragraphs
   function parseBlocksToHTML(blocks) {
  if (!blocks) return '';
  if (typeof blocks === 'string') return `<div class="sub-card"><p>${blocks}</p></div>`;

  let html = '';
  let inSection = false;

  blocks.forEach(block => {
    // 1. Process Headings (What We Do, Why Text-Based?, Who We Are, etc.)
    if (block.type === 'heading') {
      const headingText = block.children ? block.children.map(c => c.text).join('') : '';
      
      if (inSection) html += `</div>`; // Close previous card
      html += `<div class="sub-card"><h4><strong>${headingText}</strong></h4>`;
      inSection = true;
    } 
    // 2. Process Paragraphs & Bold Inline Labels
    else if (block.type === 'paragraph' && block.children) {
      let paragraphContent = '';

      block.children.forEach(child => {
        let text = child.text || '';

        // Bold any text marked bold in Strapi OR auto-bold prefix before a colon (e.g. "Core Programming Logic:")
        if (child.bold) {
          paragraphContent += `<strong>${text}</strong>`;
        } else if (text.includes(':')) {
          const parts = text.split(':');
          paragraphContent += `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}`;
        } else {
          paragraphContent += text;
        }
      });

      if (paragraphContent.trim()) {
        if (!inSection) {
          html += `<div class="sub-card">`;
          inSection = true;
        }
        html += `<p>${paragraphContent}</p>`;
      }
    }
  });

  if (inSection) html += `</div>`;

  return html;
}
    // 2. Render Text Fields
    if (document.getElementById('about-title') && data.Title) {
      document.getElementById('about-title').innerText = data.Title;
    }
    
    if (document.getElementById('about-subtitle') && data.Subtitle) {
      document.getElementById('about-subtitle').innerText = data.Subtitle;
    }

    if (document.getElementById('about-story') && data.Hero_Story) {
      document.getElementById('about-story').innerHTML = parseBlocksToHTML(data.Hero_Story);
    }

    if (document.getElementById('about-mission') && data.Our_Mission) {
      document.getElementById('about-mission').innerHTML = parseBlocksToHTML(data.Our_Mission);
    }

    // 3. Image extraction
    const imgElement = document.getElementById('about-image');
    if (imgElement && data.Cover_Image) {
      const cover = Array.isArray(data.Cover_Image) ? data.Cover_Image[0] : data.Cover_Image;
      const relativeUrl = cover.url || (cover.data && cover.data.attributes ? cover.data.attributes.url : null);

      if (relativeUrl) {
        imgElement.src = `http://localhost:1337${relativeUrl}`;
        imgElement.style.display = 'block';
      }
    }
  })
  .catch(err => console.error('Error loading Strapi data:', err));