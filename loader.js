(function() {
    // PROPA NUG
    // INNIT BRUV?
    initPreloader();

    function initPreloader() {
        document.body.style.overflow = 'hidden';

        // Load anime.js if not already loaded
        if (!window.anime) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
            script.onload = startAnimations;
            document.head.appendChild(script);
        } else {
            startAnimations();
        }

        function startAnimations() {
            // Preloader overlay
            const preloader = document.createElement('div');
            preloader.id = 'preloader';
            preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #111;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
            `;

            // Rectangle now fits tightly around the row, no curved edges
            preloader.innerHTML = `
                <div id="preloader-center" style="position: relative; display: flex; flex-direction: column; align-items: center; min-width: 340px; min-height: 120px;">
                    <svg id="preloader-rect" width="540" height="140" style="position: absolute; top: 0; left: 0; pointer-events: none;">
                        <rect x="1" y="1" width="510" height="98"
                            stroke="#fff" stroke-width="2" fill="none"
                            stroke-dasharray="1356" stroke-dashoffset="1356"/>
                    </svg>
                    <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100px; min-width: 400px; padding: 0 10px;">
                        <div class="preloader-text" style="font-family: 'JetBrains Mono', monospace; color: #fff; font-size: 2.5rem; font-weight: 700; letter-spacing: 0.1em; opacity: 0; transform: translateX(100px); margin-right: 2.5rem;">
                            Nadhi.dev
                        </div>
                        <div class="vline" style="width: 2px; height: 0; background: #fff; margin-right: 2.5rem;"></div>
                        <button id="enterBtn" style="display: none; padding: 0.75rem 2rem; background: #fff; color: #111; font-family: monospace; font-size: 1.125rem; border: none; cursor: pointer; opacity: 0; border-radius: 2px;">
                            ENTER
                        </button>
                    </div>
                    <div id="desc" style="margin-top: 1.5rem; color: #bbb; font-family: 'JetBrains Mono', monospace; font-size: 1rem; text-align: center; letter-spacing: 0.01em; opacity: 0; transform: translateY(-30px);">
                        Welcome to Enidu, an opensource product of Nadhi.dev
                    </div>
                </div>
            `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
                #enterBtn:hover { background: #e5e5e5; }
            `;
            document.head.appendChild(style);
            document.body.appendChild(preloader);

            // Fade in preloader
            anime({
                targets: '#preloader',
                opacity: 1,
                duration: 500,
                easing: 'easeOutQuad'
            });

            // Animate background color: smooth, pastel pinks to dark shades, total ~3s
            anime({
                targets: '#preloader',
                keyframes: [
                    { backgroundColor: '#2e2e3a' }, // dark gray-blue
                    { backgroundColor: '#252533' }, // darker
                    { backgroundColor: '#1c1c29' }, // almost black
                    { backgroundColor: '#111' },    // deep black
                    { backgroundColor: '#000000' }, // OLED black
                    
                ],
                duration: 3000,           
                easing: 'easeInOutSine',  
                            
                });


            // Animate text sliding in from right
            anime({
                targets: '.preloader-text',
                opacity: 1,
                translateX: [100, 0],
                duration: 700,
                delay: 200,
                easing: 'easeOutCubic',
                complete: function() {
                    // Animate vertical line growing down
                    anime({
                        targets: '.vline',
                        height: ['0', '60px'],
                        duration: 500,
                        easing: 'easeInOutCubic',
                        complete: function() {
                            // Show ENTER button
                            const enterBtn = document.getElementById('enterBtn');
                            enterBtn.style.display = 'inline-block';
                            anime({
                                targets: enterBtn,
                                opacity: 1,
                                translateY: [-10, 0],
                                duration: 400,
                                easing: 'easeOutQuad',
                                complete: function() {
                                    // Draw rectangle around content (no rounded corners)
                                    anime({
                                        targets: '#preloader-rect rect',
                                        strokeDashoffset: [1032, 0],
                                        duration: 900,
                                        easing: 'easeInOutCubic'
                                    });
                                    anime({
                                        targets: '#desc',
                                        opacity: 1,
                                        translateY: [ -30, 0 ],
                                        duration: 600,
                                        easing: 'easeOutCubic'
                                    });
                                }
                            });
                        }
                    });
                }
            });
            
            

            // Enter key shortcut
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    const enterBtn = document.getElementById('enterBtn');
                    if (enterBtn && enterBtn.style.display !== 'none') {
                        enterBtn.click();
                    }
                }
            });

            // Handle enter button click
            document.getElementById('enterBtn').addEventListener('click', function() {
                anime({
                    targets: '#preloader',
                    opacity: 0,
                    duration: 500,
                    easing: 'easeInQuad',
                    complete: function() {
                        preloader.remove();
                        document.body.style.overflow = '';
                        document.dispatchEvent(new Event('preloaderDone'));
                    }
                });
            });
        }
    }
})();