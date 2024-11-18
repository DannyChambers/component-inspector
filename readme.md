# Component Inspector

Component Inspector is a Chrome extension designed to assist developers and designers in visually identifying and interacting with web components. This tool provides an interface to highlight components in live pages and report on numbers of components and instances.

## Features

- **Component Detection**: Automatically detects all web components with a data-component attribute For example: data-component="Button"
- **Visual Highlighting**: Allows users to select web components from a dropdown menu to highlight them on the page.

## Installation

1. **Install the extension:**

   ```bash

   ```

- Navigate to Chrome Extensions:
- Open Google Chrome.
- Enter chrome://extensions/ in the address bar.
- Enable Developer Mode (toggle switch at the top right corner).
- Load the unpacked extension:
- Click on 'Load unpacked'.
- Navigate to the component-inspector directory and select.

  ```

  ```

## Usage

1. Open a webpage that contains your system components (components prefixed with the "data-component" attribute).
2. Click on the extension icon in the Chrome toolbar to open the popup interface.
3. Interact with the following elements in the popup:

- Detected System: Displays if a system is detected.
- Component Instances: Shows the total number of component instances found.
- Unique Components: Lists the number of unique components.
- Highlight Components Select: Dropdown to choose a component to highlight. Includes a 'None' option to remove highlights.

4. Select a component to highlight: Choose a component from the 'Highlight Components' dropdown. The selected component will be visually highlighted on the webpage.
