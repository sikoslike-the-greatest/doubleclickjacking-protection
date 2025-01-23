(function() {
    let isInteractionDetected = false;
    const requiredDistance = 30;
    let lastX = 0;
    let lastY = 0;
    let totalDistance = 0;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2147483647;
        background: transparent;
        cursor: default;
    `;

    function enableInteractions() {
        if (!isInteractionDetected) {
            isInteractionDetected = true;
            overlay.remove();
        }
    }

    function setupInteractionListeners() {
        let timeoutId;

        // Клик мышью
        document.addEventListener('mousedown', (e) => {
            if (!isInteractionDetected) {
                timeoutId = setTimeout(enableInteractions, 1000);
            }
        });

        // Тачскрин
        document.addEventListener('touchstart', () => {
            if (!isInteractionDetected) {
                timeoutId = setTimeout(enableInteractions, 1000);
            }
        });
        document.addEventListener('touchmove', () => {
            clearTimeout(timeoutId);
            enableInteractions();
        });

        // Движение мыши
        document.addEventListener('mousemove', (e) => {
            if (!isInteractionDetected) {
                if (timeoutId) clearTimeout(timeoutId);

                if (lastX === 0 && lastY === 0) {
                    lastX = e.pageX;
                    lastY = e.pageY;
                    return;
                }

                const deltaX = e.pageX - lastX;
                const deltaY = e.pageY - lastY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                totalDistance += distance;

                if (totalDistance >= requiredDistance) {
                    enableInteractions();
                }

                lastX = e.pageX;
                lastY = e.pageY;
            }
        });

        // Клавиатура
        document.addEventListener('keydown', () => {
            if (timeoutId) clearTimeout(timeoutId);
            enableInteractions();
        });
    }

    function init() {
        document.body.appendChild(overlay);
        setupInteractionListeners();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();