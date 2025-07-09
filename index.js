let notes = [];
let editNoteId = null;
function loadsNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
  event.preventDefault();
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");

  const titleNote = noteTitle.value.trim();
  const contentNote = noteContent.value.trim();
  if (editNoteId) {
    const editNoteIndex = notes.findIndex((note) => note.id === editNoteId);
    notes[editNoteIndex] = {
      ...notes[editNoteIndex],
      title: titleNote,
      content: contentNote,
    };
  } else {
    notes.unshift({
      id: generateID(),
      title: titleNote,
      content: contentNote,
    });
  }
  savesNotes();
  renderNotes();
  closeNoteDialog();
  noteTitle.value = "";
  noteContent.value = "";
  console.log(notes);
}
function savesNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}
function openNoteDialog(noteId) {
  const dialog = document.getElementById("noteDialog");
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");

  if (noteId) {
    const editNote = notes.find((note) => note.id === noteId);
    editNoteId = noteId;
    dialog.querySelector("h2").textContent = "Edit Note";
    noteTitle.value = editNote.title;
    noteContent.value = editNote.content;
  } else {
    dialog.querySelector("h2").textContent = "Add Note";
    noteTitle.value = "";
    noteContent.value = "";
  }

  dialog.showModal();
  noteTitle.focus();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (notes.length === 0) {
    notesContainer.innerHTML = `
  <p class="empty-message">
    📝 You haven't added any notes yet.<br>
    Click <strong>"Add Note"</strong> to get started!
  </p>`;

    return;
  }
  notesContainer.innerHTML = notes
    .map(
      (note) => `
      <div class="note-card">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
        </div>
        </div>`
    )
    .join("");
}
function deleteNote(noteId) {
  notes = notes.filter((note) => note.id != noteId);
  savesNotes();
  renderNotes();
}
function closeNoteDialog() {
  const dialog = document.getElementById("noteDialog");
  dialog.close();
}
document.addEventListener("DOMContentLoaded", function () {
  notes = loadsNotes();
  renderNotes();
  applyTheme();

  document
    .getElementById("noteDialog")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        closeNoteDialog();
      }
    });
});

document.getElementById("noteForm").addEventListener("submit", saveNote);

function generateID() {
  return Date.now().toString();
}

function themeToggle() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggleBtn").textContent = isDark ? "🌞" : "🌙";
}
function applyTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("themeToggleBtn").textContent = "🌞";
  }
}
function updateAddButtonText() {
  const addBtn = document.querySelector(".add-note-btn");
  if (window.innerWidth <= 768) {
    addBtn.textContent = "+";
  } else {
    addBtn.textContent = "+ Add Note";
  }
}

// Run on page load
updateAddButtonText();

// Run whenever window is resized
window.addEventListener("resize", updateAddButtonText);
