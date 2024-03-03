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
  easy: "rgba(75, 192, 192, 0.3)", // green
  medium: "rgba(255, 159, 64, 0.3)", // yellow
  hard: "rgba(255, 99, 132, 0.3)", // red
};

const difficultyBorderColors = {
  easy: "rgba(75, 192, 192, 1)", // green
  medium: "rgba(255, 159, 64, 1)", // yellow
  hard: "rgba(255, 99, 132, 1)", // red
};

const categoryColors = {
  color1: "rgba(0, 32, 46, 0.3)",
  color2: "rgba(0, 63, 92, 0.3)",
  color3: "rgba(44, 72, 117, 0.3)",
  color4: "rgba(138, 80, 143, 0.3)",
  color5: "rgba(188, 80, 144, 0.3)",
  color6: "rgba(255, 99, 97, 0.3)",
  color7: "rgba(255, 133, 49, 0.3)",
  color8: "rgba(255, 166, 0, 0.3)",
  color9: "rgba(255, 211, 128, 0.3)",
};

const categoryBorderColors = {
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
        borderWidth: 1,
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
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + "%"; // convert it to percentage
          },
        },
      },
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
        borderWidth: 1,
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
      },
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
        borderWidth: 1,
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
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + "%"; // convert it to percentage
          },
        },
      },
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
        borderWidth: 1,
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
      },
    },
  },
});

// Calculate total accuracy
const totalAccuracy = data.correctAnswers / data.totalQuestions;

// Create pie chart
new Chart(document.getElementById("totalAccuracy"), {
  type: "pie",
  data: {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [totalAccuracy, 1 - totalAccuracy],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  },
});
// Accuracy over time
new Chart(document.getElementById("accuracyOverTime"), {
  type: "line",
  data: {
    labels: data.accuracyOverTime.map((item) => item.time),
    datasets: [
      {
        label: formatLabel("Accuracy Over Time"),
        data: data.accuracyOverTime.map((item) => item.accuracy),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
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
          callback: function (value, index, values) {
            return (value * 100).toFixed(0) + "%"; // convert it to percentage
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  },
});
