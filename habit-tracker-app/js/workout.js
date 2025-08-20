export function setupWorkout() {
  const workoutDateEl = document.getElementById("workout-date");
  const nameInput = document.getElementById("exercise-name-input");
  const addExerciseBtn = document.getElementById("add-exercise-btn");
  const workoutLogList = document.getElementById("workout-log-list");
  const categorySelect = document.getElementById("workout-category-select");
  const saveCategoryBtn = document.getElementById("save-category-btn");

  //CONST PARA CALENDARIO
  const toggleHistoryBtn = document.getElementById("toggle-history-view-btn");
  const todayWorkoutView = document.getElementById("today-workout-view");
  const historyView = document.getElementById("workout-history-view");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const currentMonthDisplay = document.getElementById("current-month-display");
  const calendarGrid = document.getElementById("calendar-grid");
  const detailsDateEl = document.getElementById("details-date");
  const detailsCategoryEl = document.getElementById("details-category");
  const detailsExerciseListEl = document.getElementById(
    "details-exercise-list"
  );

  //CONST PARA PROGRESO
  const toggleProgressBtn = document.getElementById("toggle-progress-view-btn");
  const progressView = document.getElementById("workout-progress-view");
  const exerciseSelect = document.getElementById("progress-exercise-select");
  const progressDetails = document.getElementById("progress-details");

  let currentDate = new Date();
  let workoutLogs = JSON.parse(localStorage.getItem("workoutLogs")) || [];

  // guardar ejercicios
  function saveWorkouts() {
    localStorage.setItem("workoutLogs", JSON.stringify(workoutLogs));
  }
  function getTodayLog() {
    const today = new Date().toISOString().split("T")[0];
    let todayLog = workoutLogs.find((log) => log.date === today);

    if (!todayLog) {
      todayLog = { date: today, exercises: [] };
      workoutLogs.push(todayLog);
    }
    return todayLog;
  }
  function renderWorkoutLog() {
    workoutLogList.innerHTML = "";
    const todayLog = getTodayLog();

    categorySelect.value = todayLog.category || "";

    if (todayLog && todayLog.exercises) {
      todayLog.exercises.forEach((exercise, exerciseIndex) => {
        const li = document.createElement("li");

        // Genera el HTML para cada serie registrada
        const setsHTML = exercise.sets
          .map(
            (set, setIndex) =>
              `<li>
                    <span>Serie ${setIndex + 1}</span>
                    <span>${set.reps} reps</span>
                    <span>${set.weight} kg</span>
                </li>`
          )
          .join("");

        // Construye el HTML completo del ejercicio
        li.innerHTML = `
          <div class="exercise-header">
              <span class="exercise-name">${exercise.name}</span>
              <button class="delete-exercise-btn" data-exercise-index="${exerciseIndex}" title="Eliminar ejercicio">✖</button>
          </div>
          ${
            exercise.sets.length > 0
              ? `<div class="sets-list-header"><span></span><span></span><span></span></div>`
              : ""
          }
          <ul class="sets-list">${setsHTML}</ul>
          <form class="add-set-form" data-exercise-index="${exerciseIndex}">
              <input type="number" class="reps-input" placeholder="Reps" required>
              <input type="text" class="weight-input" placeholder="Peso (kg)" required>
              <button type="submit">Añadir Serie</button>
          </form>`;
        workoutLogList.appendChild(li);
      });
    }
  }
  function addExercise() {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Por favor, ingresa un ejercicio");
      return;
    }
    const todayLog = getTodayLog();
    todayLog.exercises.push({ name: name, sets: [] });

    nameInput.value = "";
    saveWorkouts();
    renderWorkoutLog();
  }
  function addSet(exerciseIndex, reps, weight) {
    const todayLog = getTodayLog();
    if (todayLog && todayLog.exercises[exerciseIndex]) {
      todayLog.exercises[exerciseIndex].sets.push({ reps, weight });
      saveWorkouts();
      renderWorkoutLog();
    }
  }
  function deleteExercise(exerciseIndex) {
    const todayLog = getTodayLog();
    if (confirm("¿Estás seguro de eliminar este ejercicio?")) {
      todayLog.exercises.splice(exerciseIndex, 1);
      saveWorkouts();
      renderWorkoutLog();
    }
  }
  function saveCategory() {
    const todayLog = getTodayLog();
    todayLog.category = categorySelect.value;
    saveWorkouts();
    alert(`Categoria '${todayLog.category}' guardada para hoy.`);
  }
  function renderCalendar(year, month) {
    calendarGrid.innerHTML = "";
    currentMonthDisplay.textContent = new Date(year, month).toLocaleDateString(
      "es-ES",
      { month: "long", year: "numeric" }
    );

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    //Rellenar días vacíos inicio del mes
    for (let i = 0; i < firstDay; i++) {
      calendarGrid.innerHTML += `<div class="calendar-day"></div>`;
    }

    //Rellenar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];
      const workout = workoutLogs.find((log) => log.date === dateString);

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("calendar-day");
      dayDiv.innerHTML = `<span class="day-number">${day}</span>`;

      if (workout) {
        dayDiv.classList.add("has-workout");
        dayDiv.dataset.date = dateString;

        if (workout.category) {
          const categoryClass = `workout-${workout.category
            .toLowerCase()
            .replace(/[/ ]/g, "-")}`;
          dayDiv.classList.add(categoryClass);
        }

        dayDiv.innerHTML = `<span class="workout-category">${
          workout.category || ""
        }</span>`;
      }
      calendarGrid.appendChild(dayDiv);
    }
  }
  function showWorkoutDetails(date) {
    const workout = workoutLogs.find((log) => log.date === date);
    if (!workout) return;

    detailsDateEl.textContent = new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    detailsCategoryEl.textContent = `Categoria: ${
      workout.category || "Sin categoria"
    }`;
    detailsExerciseListEl.innerHTML = "";

    workout.exercises.forEach((exercise) => {
      const exerciseHTML = `
      <li>
        <strong>${exercise.name}</strong>
        <ul>
          ${exercise.sets
            .map((set) => `<li>${set.reps} reps on ${set.weight} kg</li>`)
            .join("")}
        </ul>
      </li>
      `;
      detailsExerciseListEl.innerHTML += exerciseHTML;
    });
  }
  function populatedExerciseSelect() {
    const allExercises = new Set();
    workoutLogs.forEach((log) => {
      log.exercises.forEach((exercise) => {
        allExercises.add(exercise.name);
      });
    });

    exerciseSelect.innerHTML =
      '<option value="">-- Choose a Exercise --</option>';
    allExercises.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      exerciseSelect.appendChild(option);
    });
  }
  function findBestLiftForMonth(exerciseName, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    let maxWeight = 0;

    workoutLogs.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate.getFullYear() === year && logDate.getMonth() === month) {
        log.exercises.forEach((exercise) => {
          if (exercise.name === exerciseName) {
            exercise.sets.forEach((set) => {
              const weight = parseFloat(set.weight);
              if (weight > maxWeight) {
                maxWeight = weight;
              }
            });
          }
        });
      }
    });
    return maxWeight > 0 ? maxWeight : null;
  }
  function displayProgress() {
    const selectedExercise = exerciseSelect.value;
    if (!selectedExercise) {
      progressDetails.innerHTML = "";
      return;
    }

    const currentMonthDate = new Date();
    const prevMonthDate = new Date();
    prevMonthDate.setMonth(currentMonthDate.getMonth() - 1);

    const currentBest = findBestLiftForMonth(
      selectedExercise,
      currentMonthDate
    );
    const prevBest = findBestLiftForMonth(selectedExercise, prevMonthDate);

    const diff = currentBest && prevBest ? currentBest - prevBest : 0;
    const diffSign = diff > 0 ? "+" : "";
    const diffClass = diff > 0 ? "positive" : diff < 0 ? "negative" : "";

    progressDetails.innerHTML = `
      <div class="progress-card">
        <h4>Last Month</h4>
        <p>${prevBest || "--"} kg</p>
      </div>
      <div class ="progress-card difference ${diffClass}">
        <h4>Difference</h4>
        <p>${diffSign}${diff.toFixed(1)} kg</p>
      </div>
    `;
  }
  if (addExerciseBtn) {
    const todayFormatted = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    workoutDateEl.textContent = todayFormatted;

    addExerciseBtn.addEventListener("click", addExercise);
    saveCategoryBtn.addEventListener("click", saveCategory);

    // Listener para los formularios de añadir series
    workoutLogList.addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-exercise-btn")) {
        const exerciseIndex = event.target.dataset.exerciseIndex;
        deleteExercise(exerciseIndex);
      }
    });

    workoutLogList.addEventListener("submit", function (event) {
      event.preventDefault();
      if (event.target.classList.contains("add-set-form")) {
        const exerciseIndex = event.target.dataset.exerciseIndex;
        const reps = event.target.querySelector(".reps-input").value;
        const weight = event.target.querySelector(".weight-input").value;
        if (reps && weight) {
          addSet(exerciseIndex, reps, weight);
        }
      }
    });

    toggleHistoryBtn.addEventListener("click", () => {
      const isHistoryVisible = historyView.style.display === "block";
      historyView.style.display = isHistoryVisible ? "none" : "block";
      todayWorkoutView.style.display = isHistoryVisible ? "block" : "none";
      toggleHistoryBtn.textContent = isHistoryVisible
        ? "Workout History"
        : "See Todays Workout";
      if (!isHistoryVisible) {
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      }
    });

    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    calendarGrid.addEventListener("click", (event) => {
      const dayDiv = event.target.closest(".calendar-day,has-workout");
      if (dayDiv) {
        showWorkoutDetails(dayDiv.dataset.date);
      }
    });

    toggleProgressBtn.addEventListener("click", () => {
      const isProgressVisible = progressView.style.display === "block";
      progressView.style.display = isProgressVisible ? "none" : "block";
      toggleProgressBtn.textContent = isProgressVisible
        ? "Exercise Progress"
        : "Close Progress";
      if (!isProgressVisible) {
        populatedExerciseSelect();
      }
    });

    exerciseSelect.addEventListener("change", displayProgress);

    renderWorkoutLog();
    console.log("Módulo listo");
  }
}
