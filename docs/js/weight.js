export function setupWeight() {
  const newWeightInput = document.getElementById("new-weight-input");
  const addWeightBtn = document.getElementById("add-weight-btn");
  const historyList = document.getElementById("weight-history-list");
  const weeklyAverageEl = document.getElementById("weekly-average-weight");
  const monthlyAverageEl = document.getElementById("monthly-average-weight");

  let weightEntries = JSON.parse(localStorage.getItem("weightEntries")) || [];

  // FUNCIONES

  // guarda peso
  function saveEntries() {
    localStorage.setItem("weightEntries", JSON.stringify(weightEntries));
  }
  // muestra las entradas
  function renderEntries() {
    historyList.innerHTML = "";
    [...weightEntries].reverse().forEach((entry) => {
      const li = document.createElement("li");
      const entryDate = new Date(entry.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
      li.innerHTML = `
                <span class="date">${entryDate}</span>
                <span class= "weight">${entry.weight} kg</span>
            `;
      historyList.appendChild(li);
    });
  }
  // calcular promedio semanal del peso
  function calcWeeklyAverage() {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const lastWeekEntries = weightEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });

    if (lastWeekEntries.length === 0) {
      return null;
    }

    const sum = lastWeekEntries.reduce(
      (total, entry) => total + parseFloat(entry.weight),
      0
    );
    const average = sum / lastWeekEntries.length;
    return average.toFixed(1);
  }
  function renderSummary() {
    const average = calcWeeklyAverage();
    if (average !== null) {
      weeklyAverageEl.textContent = average;
    } else {
      weeklyAverageEl.textContent = "--";
    }
  }
  // funcion ingresar peso
  function addWeightEntry() {
    const weightValue = parseFloat(newWeightInput.value);
    if (!weightValue || weightValue <= 0) {
      alert("Ingresa un peso válido.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const existingEntryIndex = weightEntries.findIndex(
      (entry) => entry.date === today
    );
    if (existingEntryIndex !== -1) {
      weightEntries[existingEntryIndex].weight = weightValue;
    } else {
      weightEntries.push({ date: today, weight: weightValue });
    }

    newWeightInput.value = "";
    saveEntries();
    renderEntries();
    renderSummary();
    renderMonthlySummary();
    console.log("Módulo de peso listo.");
  }
  // calculo mensual de peso
  function calcMonthlylyAverage() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const thisMonthEntries = weightEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });
    if (thisMonthEntries.length === 0) {
      return null;
    }

    const sum = thisMonthEntries.reduce(
      (total, entry) => total + entry.weight,
      0
    );
    const average = sum / thisMonthEntries.lenght;
    return average.toFixed(1);
  }
  // funcion mostrar resumen mensual
  function renderMonthlySummary() {
    const average = calcMonthlylyAverage();
    if (average !== null) {
      monthlyAverageEl.textContent = average;
    } else {
      monthlyAverageEl.textContent = "--";
    }
  }

  addWeightBtn.addEventListener("click", addWeightEntry);
  renderEntries();
  renderSummary();
  console.log("Módulo de peso list.");
}
