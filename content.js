let isMinimized = false;
let isRTL = false; // Cached RTL state
let tooltipElement = null;
let buttonElement = null;

function getCLBColor() {
    const isDark = document.body?.classList.contains('dark') || document.documentElement.classList.contains('dark');
    const fallbackInactive = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
    return `var(--WDS-content-deemphasized, ${fallbackInactive})`;
}

function getMinimizeSvg() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet">
        <defs>
            <mask id="wa-minimize-mask" style="mask-type: alpha">
                <image width="24" height="24" href="data:image/png;base64,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"></image>
            </mask>
        </defs>
        <rect width="24" height="24" fill="currentColor" mask="url(#wa-minimize-mask)"></rect>
    </svg>`;
}

function getExpandSvg() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet">
        <defs>
            <mask id="wa-expand-mask" style="mask-type: alpha">
                <image width="24" height="24" href="data:image/png;base64,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"></image>
            </mask>
        </defs>
        <rect width="24" height="24" fill="currentColor" mask="url(#wa-expand-mask)"></rect>
    </svg>`;
}

function applyState(minimized) {
    document.documentElement.classList.toggle('wa-chat-minimized', minimized);
    if (buttonElement) {
        const minSvg = buttonElement.querySelector('#wa-min-svg');
        const expSvg = buttonElement.querySelector('#wa-exp-svg');
        if (minSvg && expSvg) {
            minSvg.style.display = minimized ? 'none' : 'block';
            expSvg.style.display = minimized ? 'block' : 'none';
        }
        buttonElement.ariaLabel = minimized ? 'Expand Sidebar' : 'Minimize Sidebar';
    }
}

function toggleMinimizedState() {
    isMinimized = !isMinimized;
    chrome.storage.local.set({ waMinimized: isMinimized }, () => {
        applyState(isMinimized);
    });
}

function createTooltip() {
    if (tooltipElement) return;
    tooltipElement = document.createElement('div');
    tooltipElement.id = 'wa-sidebar-toggle-tooltip';
    tooltipElement.style.cssText = [
        'position:fixed', 'padding:4px 8px', 'border-radius:4px',
        'font-size:0.75rem', 'line-height:1rem', 'font-weight:400',
        'white-space:nowrap', 'pointer-events:none', 'z-index:2147483647',
        'opacity:0', 'display:flex', 'align-items:center',
        'transform:translateY(-50%) scale(1)', 'transform-origin:left center',
        'transition:transform 0 cubic-bezier(0.4, 0, 0.2, 1), opacity 0 cubic-bezier(0.4, 0, 0.2, 1)', 'font-family:inherit'
    ].join(';');
    document.body.appendChild(tooltipElement);
}

function injectNativeHeaderToggleButton() {
    const mePhoto = document.querySelector('[data-testid="navbar-item-me-tab-photo"]');
    if (!mePhoto) return false;

    const buttonWrapper = mePhoto.closest('span')?.parentElement;
    const container = buttonWrapper?.parentElement;
    if (!container) return false;

    let wrapper = document.getElementById('wa-sidebar-toggle-btn-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'wa-sidebar-toggle-btn-wrapper';
        wrapper.setAttribute('style', 'display: flex; align-items: center; justify-content: center;');

        const privacyButton = document.getElementById('wa-privacy-clb');
        if (privacyButton) {
            container.insertBefore(wrapper, privacyButton.parentElement);
        } else {
            container.insertBefore(wrapper, container.firstChild);
        }
    }

    if (!buttonElement) {
        createTooltip();

        buttonElement = document.createElement('button');
        buttonElement.id = 'wa-sidebar-toggle-btn';
        buttonElement.type = 'button';
        buttonElement.ariaLabel = isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar';

        buttonElement.style.cssText = [
            'display:flex', 'align-items:center', 'justify-content:center',
            'width:40px', 'height:40px', 'border:none', 'border-radius:50%',
            'background:transparent', 'cursor:pointer', 'padding:0',
            `color:${getCLBColor()}`,
            'transition:background .15s, color .2s, opacity .15s, transform .15s cubic-bezier(0.4, 0, 0.2, 1)',
            'flex-shrink:0',
        ].join(';');

        const parser = new DOMParser();
        const minDoc = parser.parseFromString(getMinimizeSvg(), 'image/svg+xml');
        const expDoc = parser.parseFromString(getExpandSvg(), 'image/svg+xml');
        const minSvg = minDoc.documentElement;
        const expSvg = expDoc.documentElement;
        minSvg.id = 'wa-min-svg';
        expSvg.id = 'wa-exp-svg';
        minSvg.style.display = isMinimized ? 'none' : 'block';
        expSvg.style.display = isMinimized ? 'block' : 'none';
        buttonElement.appendChild(minSvg);
        buttonElement.appendChild(expSvg);

        buttonElement.addEventListener('mouseenter', () => {
            tooltipElement.textContent = isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar';
            const rect = buttonElement.getBoundingClientRect();
            tooltipElement.style.top = `${rect.top + rect.height / 2}px`;

            if (isRTL) {
                tooltipElement.style.left = 'auto';
                tooltipElement.style.right = `${window.innerWidth - rect.left + 5}px`;
                tooltipElement.style.transformOrigin = 'right center';
            } else {
                tooltipElement.style.right = 'auto';
                tooltipElement.style.left = `${rect.right + 5}px`;
                tooltipElement.style.transformOrigin = 'left center';
            }

            const isDark = document.body?.classList.contains('dark') || document.documentElement.classList.contains('dark');
            if (isDark) {
                tooltipElement.style.background = '#EEEEEE';
                tooltipElement.style.color = '#0A0A0A';
            } else {
                tooltipElement.style.background = 'var(--WDS-surface-inverse, #EEEEEE)';
                tooltipElement.style.color = 'var(--WDS-content-inverse, #0A0A0A)';
            }
            tooltipElement.style.boxShadow = '0 0 20px rgba(0,0,0,0.2), 0 1px rgba(0,0,0,0.04)';
            tooltipElement.style.transform = 'translateY(-50%) scale(1)';
            tooltipElement.style.opacity = '1';
        });

        buttonElement.addEventListener('mouseleave', () => {
            tooltipElement.style.transform = 'translateY(-50%) scale(0.95)';
            tooltipElement.style.opacity = '0';
        });

        buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltipElement.style.transform = 'translateY(-50%) scale(0.95)';
            tooltipElement.style.opacity = '0';
            toggleMinimizedState();
        });
    }

    if (buttonElement.parentElement !== wrapper) {
        wrapper.appendChild(buttonElement);
    }

    return true; // Successfully injected
}

// Global observer to catch initial load
const observer = new MutationObserver(() => {
    if (buttonElement && document.body.contains(buttonElement)) {
        return;
    }
    injectNativeHeaderToggleButton();
});

function init() {
    // Check RTL state once
    isRTL = document.documentElement.dir === 'rtl' ||
        document.body?.dir === 'rtl' ||
        window.getComputedStyle(document.body).direction === 'rtl';

    // Load state
    chrome.storage.local.get('waMinimized', (data) => {
        if (data && data.waMinimized !== undefined) {
            isMinimized = data.waMinimized;
        }
        applyState(isMinimized);
    });

    // Start looking for the header
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Start looking for DOM target updates (Replaces CSS :has)
    targetObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
    applyJsTargets();

    // Handle theme changes efficiently (only update color)
    const themeObserver = new MutationObserver(() => {
        if (buttonElement) {
            buttonElement.style.color = getCLBColor();
        }
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Keyboard shortcut: Alt + .
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === '.') {
            e.preventDefault();
            toggleMinimizedState();
        }
    });
}

// --- Custom Pipeline Engine (Replaces CSS :has) ---
const MINIMIZER_TARGETS = [
    // 'div[id="side"] | closest:div',
    // 'div[data-testid="drawer-left"]'
    'div | has:> header[data-testid="chatlist-header"] | has:> div[id="side"]',
    'div[data-testid="drawer-left"]'
];

function evaluatePipeline(pipelineStr) {
    const commands = pipelineStr.split('|').map(s => s.trim());
    const baseSelector = commands.shift();
    let results = [];

    try {
        const initialNodes = document.querySelectorAll(baseSelector);
        initialNodes.forEach(node => {
            let current = node;
            let isValid = true;
            let finalTargets = [current];

            for (const cmd of commands) {
                if (!current || !isValid) break;

                const colonIdx = cmd.indexOf(':');
                const action = colonIdx > -1 ? cmd.substring(0, colonIdx).trim() : cmd.trim();
                const value = colonIdx > -1 ? cmd.substring(colonIdx + 1).trim() : '';

                if (action === 'closest') {
                    current = current.closest(value);
                    finalTargets = [current];
                } else if (action === 'up') {
                    const steps = parseInt(value) || 1;
                    for (let i = 0; i < steps; i++) {
                        if (current) current = current.parentElement;
                    }
                    finalTargets = [current];
                } else if (action === 'find') {
                    let queryValue = value;
                    if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
                    finalTargets = Array.from(current.querySelectorAll(queryValue));
                } else if (action === 'has') {
                    let queryValue = value;
                    if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
                    if (!current.querySelector(queryValue)) isValid = false;
                } else if (action === 'not-has') {
                    let queryValue = value;
                    if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
                    if (current.querySelector(queryValue)) isValid = false;
                }
            }

            if (isValid && current && finalTargets.length > 0) {
                results.push(...finalTargets.filter(t => t != null));
            }
        });
    } catch (e) { }
    return results;
}

function applyJsTargets() {
    MINIMIZER_TARGETS.forEach(targetStr => {
        const elements = evaluatePipeline(targetStr);
        elements.forEach(el => {
            if (!el.classList.contains('wa-js-target-minimizer')) {
                el.classList.add('wa-js-target-minimizer');
            }
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const applyJsTargetsDebounced = debounce(applyJsTargets, 50);
const targetObserver = new MutationObserver((mutations) => {
    const hasElementChanges = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
    if (hasElementChanges) {
        applyJsTargetsDebounced();
    }
});

// Setup after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
