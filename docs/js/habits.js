// js/habits.js

export function setupHabits() {
  // --- ELEMENTOS DEL DOM ---
  const newHabitInput = document.getElementById("new-habit-input");
  const addHabitBtn = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");
  const streakCounter = document.getElementById("general-streak-counter");

  // --- VARIABLES DE ESTADO ---
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  let generalStreak = JSON.parse(localStorage.getItem("generalStreak")) || {
    count: 0,
    lastCompleted: null,
  };

  // --- FUNCIONES ---
  function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
  }
  function saveGeneralStreak() {
    localStorage.setItem("generalStreak", JSON.stringify(generalStreak));
  }

  function renderHabits() {
    if (!habitList) return; // Añadido para seguridad
    habitList.innerHTML = "";
    habits.forEach((habit, index) => {
      const li = document.createElement("li");
      const today = new Date().toDateString();
      const isCompletedToday = habit.lastCompleted === today;
      if (isCompletedToday) {
        li.classList.add("completed");
      }
      li.innerHTML = `<div class="habit-info"><span class="habit-name">${
        habit.name
      }</span><span class="habit-streak">Racha: 🔥 ${
        habit.streak
      }</span></div><div><button class="complete-btn" data-index="${index}" ${
        isCompletedToday ? "disabled" : ""
      }>${
        isCompletedToday ? "Hecho" : "Completar"
      }</button><button class="delete-btn" data-index="${index}">Eliminar</button></div>`;
      habitList.appendChild(li);
    });
  }

  function renderGeneralStreak() {
    if (streakCounter) {
      streakCounter.innerHTML = `Racha Diaria: 🔥 ${generalStreak.count}`;
    }
  }

  function addHabit() {
    const habitText = newHabitInput.value.trim();
    if (habitText === "") {
      alert("Escribe un hábito.");
      return;
    }
    const newHabit = { name: habitText, streak: 0, lastCompleted: null };
    habits.push(newHabit);
    newHabitInput.value = "";
    saveHabits();
    renderHabits();
  }

  function deleteHabit(index) {
    if (confirm("¿Estás seguro que quieres eliminar este hábito?")) {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    }
  }

  function checkGeneralStreak() {
    const today = new Date().toDateString();
    if (habits.length === 0 || generalStreak.lastCompleted === today) {
      return;
    }
    const allCompletedToday = habits.every(
      (habit) => habit.lastCompleted === today
    );
    if (allCompletedToday) {
      const yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);
      if (generalStreak.lastCompleted === yesterday.toDateString()) {
        generalStreak.count++;
      } else {
        generalStreak.count = 1;
      }
      generalStreak.lastCompleted = today;
      saveGeneralStreak();
      renderGeneralStreak();
    }
  }

  function handleHabitClick(event) {
    const target = event.target;
    if (target.classList.contains("complete-btn")) {
      const index = parseInt(target.dataset.index, 10);
      const habit = habits[index];
      if (habit) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (habit.lastCompleted === yesterday.toDateString()) {
          habit.streak++;
        } else if (habit.lastCompleted !== today.toDateString()) {
          habit.streak = 1;
        }
        habit.lastCompleted = today.toDateString();
        saveHabits();
        renderHabits();
        checkGeneralStreak();
      }
    } else if (target.classList.contains("delete-btn")) {
      const index = parseInt(target.dataset.index, 10);
      deleteHabit(index);
    }
  }

  // --- INICIALIZACIÓN ---
  if (addHabitBtn) {
    // Solo añadir listeners si los botones existen
    addHabitBtn.addEventListener("click", addHabit);
    habitList.addEventListener("click", handleHabitClick);
    renderHabits();
    renderGeneralStreak();
    console.log("Módulo de hábitos listo.");
  }
}
