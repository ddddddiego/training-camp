// js/main.js

import { setupHabits } from "./habits.js";
import { setupWeight } from "./weight.js";
import { setupWorkout } from "./workout.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- NAVEGACIÓN GENERAL ---
  const menuButtons = document.querySelectorAll(".menu-button");
  const sections = document.querySelectorAll(".page-section");
  const mainMenu = document.getElementById("main-menu");
  const backButtons = document.querySelectorAll(".back-to-menu-btn");

  function showSection(sectionId) {
    mainMenu.style.display = "none";
    sections.forEach((section) => section.classList.remove("active"));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.add("active");
    }
  }

  function showMainMenu() {
    mainMenu.style.display = "flex";
    sections.forEach((section) => section.classList.remove("active"));
  }

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.section;
      showSection(sectionId);
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", showMainMenu);
  });

  // --- INICIALIZACIÓN DE MÓDULOS ---
  setupHabits();
  setupWeight();
  setupWorkout();

  console.log("Aplicación inicializada correctamente.");
});
