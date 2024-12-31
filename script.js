let systemName = "";

const data = [
  {
    name: "Bateson",
  },
];

const detectSystems = (data) => {
  let systemDetections = [],
    nonSystemComponents = [],
    localDSSettings,
    componentNames = [];

  // Iterate over all elements in the document
  document.querySelectorAll("[data-component]").forEach((element) => {
    const componentName = element.getAttribute("data-component");
    if (componentName) {
      systemDetections.push(element);
      componentNames.push(componentName);
    } else {
      nonSystemComponents.push(element);
    }
  });

  let uniqueDSComponentDetections = [...new Set(componentNames)]; // Ensure unique entries

  // Load or initialize local settings
  if (localStorage.getItem("COMPONENT-TOOLS")) {
    localDSSettings = JSON.parse(localStorage.getItem("COMPONENT-TOOLS"));
  } else {
    // Initialize COMPONENT-TOOLS if it doesn't exist
    localStorage.setItem("COMPONENT-TOOLS", JSON.stringify({}));
    localDSSettings = {};
  }

  return {
    systemDetections,
    nonSystemComponents,
    DSComponentDetections: componentNames,
    uniqueDSComponentDetections,
    localDSSettings,
  };
};

const buildPopUpTools = (
  systemDetections,
  DSComponentDetections,
  uniqueDSComponentDetections,
  localDSSettings
) => {
  data.forEach((item) => {
    if (systemDetections.length) {
      systemName = item.name;

      // Update system detection information in the UI
      document.getElementById(
        "detected-system"
      ).innerHTML = `<em>${systemName}</em> was detected on this page.`;
      document.getElementById("components-label").innerHTML =
        "Number of component instances:";
      document.getElementById(
        "components-value"
      ).innerHTML = `${DSComponentDetections.length}`;
      document.getElementById("unique-components-label").innerHTML =
        "Number of unique components:";
      document.getElementById(
        "unique-components-value"
      ).innerHTML = `${uniqueDSComponentDetections.length}`;
      document.getElementById("system-controls").style.display = "block";

      // Build component options with 'None' as the first option
      let componentOptions = '<option value="none" selected>None</option>';
      uniqueDSComponentDetections.forEach((component) => {
        componentOptions += `<option value="${component}">${component}</option>`;
      });
      document.getElementById("highlight-components-select").innerHTML =
        componentOptions;
    }
  });
};

const highlightComponents = (selectedComponent) => {
  const removeExistingHighlights = () => {
    document.querySelectorAll("span.highlight-wrapper").forEach((wrapper) => {
      while (wrapper.firstChild) {
        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
      }
      wrapper.parentNode.removeChild(wrapper);
    });
  };

  if (selectedComponent === "none") {
    removeExistingHighlights();
    return;
  }

  const applyHighlight = (element) => {
    const wrapper = document.createElement("span");
    wrapper.className = "highlight-wrapper";
    wrapper.style.border = "2px solid #7F00FF"; // Violet

    if (getComputedStyle(element).display === "inline") {
      wrapper.style.display = "block";
    } else {
      wrapper.style.display = getComputedStyle(element).display;
    }

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  };

  removeExistingHighlights();

  document
    .querySelectorAll(`[data-component="${selectedComponent}"]`)
    .forEach((el) => {
      applyHighlight(el);

      if (el.shadowRoot) {
        el.shadowRoot
          .querySelectorAll(`[data-component="${selectedComponent}"]`)
          .forEach((innerEl) => {
            applyHighlight(innerEl);
          });
      }
    });
};

// Events
document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id, allFrames: true },
        func: detectSystems,
        args: [data],
      },
      function (response) {
        if (
          response[0].result.systemDetections.length &&
          response[0].result.DSComponentDetections.length
        ) {
          buildPopUpTools(
            response[0].result.systemDetections,
            response[0].result.DSComponentDetections,
            response[0].result.uniqueDSComponentDetections,
            response[0].result.localDSSettings
          );
        }
      }
    );
  });

  document
    .querySelector("#highlight-components-select")
    .addEventListener("change", function (event) {
      const selectedComponent = document.querySelector(
        "#highlight-components-select"
      ).value;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: true },
          func: highlightComponents,
          args: [selectedComponent],
        });
      });
    });
});
