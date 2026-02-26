// Gallery grid — loads manifest and renders sketch cards
async function loadManifest() {
  try {
    const res = await fetch('/manifest.json');
    return await res.json();
  } catch {
    return [];
  }
}

function createCard(sketch) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = `/runner.html?sketch=${sketch.name}`;

  if (sketch.thumb) {
    const img = document.createElement('img');
    img.src = `/${sketch.thumb}`;
    img.alt = sketch.name;
    img.loading = 'lazy';
    card.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.textContent = sketch.name.charAt(0).toUpperCase();
    card.appendChild(placeholder);
  }

  const info = document.createElement('div');
  info.className = 'info';
  info.innerHTML = `<span class="name">${sketch.name}</span><span class="date">${sketch.date}</span>`;
  card.appendChild(info);

  return card;
}

async function init() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  const sketches = await loadManifest();

  if (sketches.length === 0) {
    grid.innerHTML = '<p class="empty">No sketches yet. Run <code>npm run dev</code> to start jamming.</p>';
    return;
  }

  sketches.forEach((sketch) => {
    grid.appendChild(createCard(sketch));
  });
}

init();
