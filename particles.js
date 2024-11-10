document.addEventListener("DOMContentLoaded", function () {
  // Initialize particles.js with proper configuration
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 100, // Number of particles
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ff6600", // Initial color
        animation: {
          enable: true,
          speed: 5,
          sync: false,
          color: {
            value: ["#ff6600", "#ff0000", "#ff9900", "#ffcc00", "#ff33cc"]  // Color transitions
          }
        }
      },
      shape: {
        type: "circle", // Shape of particles
        stroke: {
          width: 0,
          color: "#ffffff"
        },
        polygon: {
          nb_sides: 6
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 4,
        random: true,
        anim: {
          enable: true,
          speed: 5,
          size_min: 1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff", // Lines between particles
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce", // Bounce particles off the edges
        bounce: true,
        attract: {
          enable: true,
          rotateX: 1000,
          rotateY: 2000
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse" // Repulse particles on hover
        },
        onclick: {
          enable: true,
          mode: "push" // Push more particles on click
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 0.8
          }
        },
        bubble: {
          distance: 200,
          size: 10,
          duration: 2,
          opacity: 0.7,
          speed: 3
        },
        repulse: {
          distance: 150,
          duration: 0.5
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });
});