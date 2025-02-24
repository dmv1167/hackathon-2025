function increaseOpacity(elementId) {
    var element = document.getElementById(elementId);
    var opacity = 0; // Start with 0 opacity (fully transparent)
  
    // Ensure the element is hidden initially if it is not
    element.style.opacity = opacity;
  
    // Function to increment opacity step by step
    function incrementOpacity() {
      opacity += 0.01;
      if (opacity >= 1) {
        opacity = 1; // Cap opacity at 1 (fully opaque)
      }
      element.style.opacity = opacity; // Update the element's opacity
  
      if (opacity < 1) {
        // Call incrementOpacity again after the specified interval
        setTimeout(incrementOpacity, 10);
      }
    }
  
    // Start the opacity increase process
    incrementOpacity();
  }

