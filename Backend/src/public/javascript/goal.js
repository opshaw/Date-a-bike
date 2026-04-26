async function fetchGoals() {
  const apiEndpoint = "/api/v1/users/current-user";
  try {
    const response = await fetch(apiEndpoint);
    if (response.ok) {
      const data = await response.json();
      document.getElementById('coin-count').textContent = data.data.finCoin;
      document.getElementById('goal-count').textContent = data.data.goals.length;
      renderGoals(data.data.goals);
    } else {
      console.error("Failed to fetch goals:", response.statusText);
      alert("Error fetching goals. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while fetching goals:", error);
    alert("An error occurred while fetching goals. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  fetchGoals();
});

function renderGoals(goals) {
  const goalList = document.getElementById("goal-list");
  goalList.innerHTML = "";
  goals.forEach((goal) => {
    const goalItem = document.createElement("div");
    goalItem.className = "goal-item";
    goalItem.className = `goal-item ${goal.achieve ? "achieved" : goal.failed ? "not-achieved" : ""}`;
    goalItem.setAttribute("data-goal-id", goal.goalId);
    const goalIdText = document.createElement("span");
    goalIdText.textContent = `ID: ${goal.goalId}`;
    goalIdText.style.fontWeight = "bold";
    const goalText = document.createElement("span");
    goalText.textContent = `Goal: ${goal.goal}`;
    const amountText = document.createElement("span");
    amountText.textContent = `Amount: ${goal.amount}`;
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "goal-buttons";
    if (!goal.achieve && !goal.failed) {
      const tickButton = document.createElement("button");
      tickButton.textContent = "✔";
      tickButton.className = "tick-button";
      tickButton.addEventListener("click", () => markGoalAchieved(goal.goalId));

      const crossButton = document.createElement("button");
      crossButton.textContent = "✘";
      crossButton.className = "cross-button";
      crossButton.addEventListener("click", () => markGoalFailed(goal.goalId));

      buttonsContainer.appendChild(tickButton);
      buttonsContainer.appendChild(crossButton);
    } else if (goal.achieve) {
      const achievedText = document.createElement("span");
      achievedText.textContent = "Achieved!";
      achievedText.style.color = "green";
      buttonsContainer.appendChild(achievedText);
    } else if (goal.failed) {
      const failedText = document.createElement("span");
      failedText.textContent = "Failed!";
      failedText.style.color = "red";
      buttonsContainer.appendChild(failedText);
    }
    goalItem.appendChild(goalIdText);
    goalItem.appendChild(goalText);
    goalItem.appendChild(amountText);
    goalItem.appendChild(buttonsContainer);
    goalList.appendChild(goalItem);
  });
}

document.getElementById("add-goal").addEventListener("click", () => {
  const goalInput = document.getElementById("goal");
  const amountInput = document.getElementById("amount");

  const goal = goalInput.value.trim();
  const amount = amountInput.value.trim();

  if (goal && amount) {
    addGoal(goal, amount);
    goalInput.value = "";
    amountInput.value = "";
  } else {
    alert("Please enter both goal and amount.");
  }
});

async function addGoal(goal, amount) {
  const apiEndpoint = "/api/v1/users/goals/addgoal";
  try {
    const response = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal, amount }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message || "Goal added successfully!");
      fetchGoals();
    } else {
      alert(data.message || "Failed to add the goal. Please try again.");
    }
  } catch (error) {
    alert("An error occurred while adding the goal. Please try again.");
    console.error("Error adding goal:", error);
  }
}

async function markGoalAchieved(goalId) {
  const apiEndpoint = `/api/v1/users/goals/achieved`; // Endpoint expecting goalId in req.body
  try {
    const response = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goalId }), // Send goalId in the request body
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message || "Goal marked as achieved!");
      fetchGoals(); // Refresh the goal list
    } else {
      alert(data.message || "Failed to update goal status. Please try again.");
    }
  } catch (error) {
    console.error("Error marking goal as achieved:", error);
    alert("An error occurred while updating the goal status.");
  }
}

// Function to handle marking a goal as failed
async function markGoalFailed(goalId) {
  const apiEndpoint = `/api/v1/users/goals/failed`; // Endpoint expecting goalId in req.body
  try {
    const response = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goalId }), // Send goalId in the request body
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message || "Goal marked as failed!");
      fetchGoals(); // Refresh the goal list
    } else {
      alert(data.message || "Failed to update goal status. Please try again.");
    }
  } catch (error) {
    console.error("Error marking goal as failed:", error);
    alert("An error occurred while updating the goal status.");
  }
}

