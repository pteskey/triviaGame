const charts = document.querySelectorAll(".chart");
let currentChart = 0;
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");

// Make the first chart visible
gsap.set(charts[currentChart], { autoAlpha: 1, x: "0%", display: "block" });

document.getElementById("next").addEventListener("click", function () {
  nextButton.disabled = true;
  previousButton.disabled = true;
  // Use GSAP to animate the current chart out and to the left
  gsap.to(charts[currentChart], {
    autoAlpha: 0,
    x: "-100%",
    display: "none",
    duration: 1,
    ease: "power2.inOut", // Add easing
    onComplete: function () {
      // Increment currentChart, wrapping around to 0 if necessary
      currentChart = (currentChart + 1) % charts.length;

      // Use GSAP to animate the next chart in from the right
      gsap.fromTo(
        charts[currentChart],
        { x: "100%", display: "none" },
        {
          autoAlpha: 1,
          x: "0%",
          display: "block",
          duration: 1,
          ease: "power2.inOut",
          onComplete: function () {
            // Enable the buttons
            nextButton.disabled = false;
            previousButton.disabled = false;
          },
        } // Add easing
      );
    },
  });
});

document.getElementById("previous").addEventListener("click", function () {
  nextButton.disabled = true;
  previousButton.disabled = true;
  // Use GSAP to animate the current chart out and to the right
  gsap.to(charts[currentChart], {
    autoAlpha: 0,
    x: "100%",
    display: "none",
    duration: 1,
    ease: "power2.inOut", // Add easing
    onComplete: function () {
      // Decrement currentChart, wrapping around to the last chart if necessary
      currentChart = (currentChart - 1 + charts.length) % charts.length;

      // Use GSAP to animate the previous chart in from the left
      gsap.fromTo(
        charts[currentChart],
        { x: "-100%", display: "none" },
        {
          autoAlpha: 1,
          x: "0%",
          display: "block",
          duration: 1,
          ease: "power2.inOut",
          onComplete: function () {
            nextButton.disabled = false;
            previousButton.disabled = false;
          },
        } // Add easing
      );
    },
  });
});

// Define the formatLabel function
function formatLabel(label) {
  if (!label) return label;
  return label
    .replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Ensure all words are lowercased for comparison
    .split(" ") // Split the string into words
    .map((word) =>
      word === "and" ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ) // Capitalize all words except 'and'
    .join(" "); // Join the words back into a string
}

// Define color mapping
const difficultyColors = {
  easy: "rgba(75, 192, 192, 0.3)",
  medium: "rgba(255, 159, 64, 0.3)",
  hard: "rgba(255, 99, 132, 0.3)",
};

const difficultyBorderColors = {
  easy: "rgba(75, 192, 192, 1)",
  medium: "rgba(255, 159, 64, 1)",
  hard: "rgba(255, 99, 132, 1)",
};

const categoryColors = {
  color1: "rgba(0, 32, 46, 0.4)",
  color2: "rgba(0, 63, 92, 0.4)",
  color3: "rgba(44, 72, 117, 0.4)",
  color4: "rgba(138, 80, 143, 0.4)",
  color5: "rgba(188, 80, 144, 0.4)",
  color6: "rgba(255, 99, 97, 0.4)",
  color7: "rgba(255, 133, 49, 0.4)",
  color8: "rgba(255, 166, 0, 0.4)",
  color9: "rgba(255, 211, 128, 0.4)",
};

const categoryBorderColors = {
  color1: "rgba(0, 0, 0, 1)",
  color1: "rgba(0, 32, 46, 1)",
  color2: "rgba(0, 63, 92, 1)",
  color3: "rgba(44, 72, 117, 1)",
  color4: "rgba(138, 80, 143, 1)",
  color5: "rgba(188, 80, 144, 1)",
  color6: "rgba(255, 99, 97, 1)",
  color7: "rgba(255, 133, 49, 1)",
  color8: "rgba(255, 166, 0, 1)",
  color9: "rgba(255, 211, 128, 1)",
};

const categoryColorsArray = Object.values(categoryColors);
const categoryBorderColorsArray = Object.values(categoryBorderColors);

// Define font settings
const chartFont = {
  size: 13,
  family: "Roboto Condensed, sans-serif",
  weight: 500,
};
const chartTitle = {
  size: 18,
  family: "Roboto Condensed, sans-serif",
  weight: 900,
};

// Accuracy by category
new Chart(document.getElementById("accuracyByCategory"), {
  type: "bar",
  data: {
    labels: data.accuracyByCategory.map((item) => formatLabel(item.category)),
    datasets: [
      {
        label: formatLabel("Accuracy"),
        data: data.accuracyByCategory.map((item) => item.accuracy),
        backgroundColor: data.accuracyByCategory.map(
          (item, index) =>
            categoryColorsArray[index % categoryColorsArray.length]
        ),
        borderColor: data.accuracyByCategory.map(
          (item, index) =>
            categoryBorderColorsArray[index % categoryBorderColorsArray.length]
        ),
        borderWidth: 2,
        borderRadius: 2,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "percent",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + "%"; // convert it to percentage
          },
        },
      },
      x: {
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
          display: function (context) {
            return context.chart.width > 480;
          },
        },
      },
    },
    animation: {
      duration: 3000,
      easing: "easeInOutElastic",
    },
  },
});

// Questions by category
new Chart(document.getElementById("questionsByCategory"), {
  type: "bar",
  data: {
    labels: data.questionsByCategory.map((item) => formatLabel(item.category)),
    datasets: [
      {
        label: formatLabel("Questions"),
        data: data.questionsByCategory.map((item) => item.questions),
        backgroundColor: data.questionsByCategory.map(
          (item, index) =>
            categoryColorsArray[index % categoryColorsArray.length]
        ),
        borderColor: data.questionsByCategory.map(
          (item, index) =>
            categoryBorderColorsArray[index % categoryBorderColorsArray.length]
        ),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
        },
      },
      x: {
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
          display: function (context) {
            return context.chart.width > 480;
          },
        },
      },
    },
    animation: {
      duration: 3000,
      easing: "easeInOutElastic",
    },
  },
});

// Accuracy by difficulty
new Chart(document.getElementById("accuracyByDifficulty"), {
  type: "bar",
  data: {
    labels: data.accuracyByDifficulty.map((item) =>
      formatLabel(item.difficulty)
    ),
    datasets: [
      {
        label: formatLabel("Accuracy"),
        data: data.accuracyByDifficulty.map((item) => item.accuracy),
        backgroundColor: data.accuracyByDifficulty.map(
          (item) => difficultyColors[item.difficulty]
        ),
        borderColor: data.accuracyByDifficulty.map(
          (item) => difficultyBorderColors[item.difficulty]
        ),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "percent",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + "%"; // convert it to percentage
          },
        },
      },
      x: {
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
        },
      },
    },
    animation: {
      duration: 3000,
      easing: "easeInOutElastic",
    },
  },
});

// Questions by difficulty
new Chart(document.getElementById("questionsByDifficulty"), {
  type: "bar",
  data: {
    labels: data.questionsByDifficulty.map((item) =>
      formatLabel(item.difficulty)
    ),
    datasets: [
      {
        label: formatLabel("Questions"),
        data: data.questionsByDifficulty.map((item) => item.questions),
        backgroundColor: data.questionsByDifficulty.map(
          (item) => difficultyColors[item.difficulty]
        ),
        borderColor: data.questionsByDifficulty.map(
          (item) => difficultyBorderColors[item.difficulty]
        ),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
        },
      },
      x: {
        ticks: {
          font: chartFont,
          color: "rgba(0, 0, 0, 1)",
        },
      },
    },
    animation: {
      duration: 3000,
      easing: "easeInOutElastic",
    },
  },
});

document.getElementById("btn").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.remove("fade-in");
  document.body.classList.add("fade-out");

  setTimeout(function () {
    window.location.href = event.target.href;
  }, 950);
});
