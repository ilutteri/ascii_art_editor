/* ============================================
   ASCII Art Tracer - Main Application
   ============================================ */

// Application State
const state = {
    cols: 80,
    rows: 40,
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    currentChar: '#',
    currentTool: 'draw',
    isDrawing: false,
    canvas: [],
    imageLoaded: false,
    startPos: null,
    // Undo/Redo history
    history: [],
    redoStack: [],
    maxHistory: 50,
    // Image position
    imgPosX: 0,
    imgPosY: 0,
    imgScale: 100,
    // Grid
    showGrid: true,
    gridOpacity: 40,
    gridThickness: 1
};

// Character sets for auto conversion
const charsets = {
    detailed: '@%#*+=-:. ',
    blocks: '█▓▒░ ',
    simple: '#*+- ',
    dots: '●◐○· '
};

// Character categories for picker
const charCategories = {
    basic: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    box: ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', 
          '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬',
          '╭', '╮', '╯', '╰', '╱', '╲', '╳', '╴', '╵', '╶', '╷',
          '┄', '┅', '┆', '┇', '┈', '┉', '┊', '┋', '┌', '┍', '┎', '┏',
          '━', '┃', '┏', '┓', '┗', '┛', '┣', '┫', '┳', '┻', '╋'],
    blocks: ['█', '▓', '▒', '░', '▀', '▄', '▌', '▐', '▖', '▗', '▘', '▙', '▚', '▛', '▜', '▝', '▞', '▟',
             '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▉', '▊', '▋', '▌', '▍', '▎', '▏'],
    shapes: ['●', '○', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗',
             '■', '□', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩',
             '◆', '◇', '◈', '◉', '◊', '○', '◌', '◍', '◎', '◯',
             '▲', '△', '▴', '▵', '▶', '▷', '▸', '▹', '►', '▻',
             '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅',
             '★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮',
             '♠', '♡', '♢', '♣', '♤', '♥', '♦', '♧', '♩', '♪', '♫', '♬'],
    arrows: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙',
             '⇐', '⇑', '⇒', '⇓', '⇔', '⇕', '⇖', '⇗', '⇘', '⇙',
             '➔', '➜', '➝', '➞', '➟', '➠', '➡', '➢', '➣', '➤',
             '⬅', '⬆', '➡', '⬇', '⬈', '⬉', '⬊', '⬋', '⬌', '⬍'],
    math: ['±', '×', '÷', '≠', '≤', '≥', '≈', '≡', '∞', '∑',
           '√', '∛', '∜', '∫', '∬', '∭', '∮', '∯', '∰', '∱',
           '∀', '∁', '∂', '∃', '∄', '∅', '∆', '∇', '∈', '∉',
           '∩', '∪', '⊂', '⊃', '⊄', '⊅', '⊆', '⊇', '⊈', '⊉',
           'π', 'Σ', 'Δ', 'Ω', 'μ', 'α', 'β', 'γ', 'θ', 'λ'],
    misc: ['©', '®', '™', '℃', '℉', '№', '℗', '℠', '℡', '™',
           '☀', '☁', '☂', '☃', '☄', '★', '☆', '☇', '☈', '☉',
           '☐', '☑', '☒', '☓', '☔', '☕', '☖', '☗', '☘', '☙',
           '☚', '☛', '☜', '☝', '☞', '☟', '☠', '☡', '☢', '☣',
           '⌘', '⌥', '⌫', '⌦', '⎋', '⏎', '⏏', '␣', '⌨', '🔒']
};

// Default characters for quick palette (sidebar)
const defaultChars = ['#', '@', '*', '+', '-', '=', '.', ':', '│', '─', '┌', '┐', '└', '┘', '█', '▓', '▒', '░', '●', '○', '■', '□', '/', '\\'];

// DOM Elements
const elements = {};

// Initialize DOM references
function initElements() {
    elements.asciiCanvas = document.getElementById('asciiCanvas');
    elements.backgroundImage = document.getElementById('backgroundImage');
    elements.canvasContainer = document.getElementById('canvasContainer');
    elements.editorArea = document.getElementById('editorArea');
    elements.uploadZone = document.getElementById('uploadZone');
    elements.imageInput = document.getElementById('imageInput');
    elements.opacitySlider = document.getElementById('opacitySlider');
    elements.opacityValue = document.getElementById('opacityValue');
    elements.scaleSlider = document.getElementById('scaleSlider');
    elements.scaleValue = document.getElementById('scaleValue');
    elements.colsSlider = document.getElementById('colsSlider');
    elements.colsValue = document.getElementById('colsValue');
    elements.rowsSlider = document.getElementById('rowsSlider');
    elements.rowsValue = document.getElementById('rowsValue');
    elements.fontSizeSlider = document.getElementById('fontSizeSlider');
    elements.fontSizeValue = document.getElementById('fontSizeValue');
    elements.charPalette = document.getElementById('charPalette');
    elements.customChar = document.getElementById('customChar');
    elements.cursorPos = document.getElementById('cursorPos');
    elements.canvasSize = document.getElementById('canvasSize');
    elements.charCount = document.getElementById('charCount');
    elements.exportModal = document.getElementById('exportModal');
    elements.exportPreview = document.getElementById('exportPreview');
    elements.clearBtn = document.getElementById('clearBtn');
    elements.exportBtn = document.getElementById('exportBtn');
    elements.copyBtn = document.getElementById('copyBtn');
    elements.drawTool = document.getElementById('drawTool');
    elements.eraserTool = document.getElementById('eraserTool');
    elements.fillTool = document.getElementById('fillTool');
    elements.lineTool = document.getElementById('lineTool');
    elements.rectTool = document.getElementById('rectTool');
    elements.eyedropperTool = document.getElementById('eyedropperTool');
    elements.closeModal = document.getElementById('closeModal');
    elements.downloadBtn = document.getElementById('downloadBtn');
    elements.downloadPngBtn = document.getElementById('downloadPngBtn');
    elements.copyExportBtn = document.getElementById('copyExportBtn');
    elements.autoConvertBtn = document.getElementById('autoConvertBtn');
    elements.convertNowBtn = document.getElementById('convertNowBtn');
    elements.charsetSelect = document.getElementById('charsetSelect');
    elements.customCharset = document.getElementById('customCharset');
    elements.customCharsetGroup = document.getElementById('customCharsetGroup');
    elements.contrastSlider = document.getElementById('contrastSlider');
    elements.contrastValue = document.getElementById('contrastValue');
    elements.invertColors = document.getElementById('invertColors');
    elements.themeSelect = document.getElementById('themeSelect');
    elements.undoBtn = document.getElementById('undoBtn');
    elements.posXSlider = document.getElementById('posXSlider');
    elements.posXValue = document.getElementById('posXValue');
    elements.posYSlider = document.getElementById('posYSlider');
    elements.posYValue = document.getElementById('posYValue');
    elements.showGrid = document.getElementById('showGrid');
    elements.resetImageBtn = document.getElementById('resetImageBtn');
    elements.removeImageBtn = document.getElementById('removeImageBtn');
    elements.gridOverlay = document.getElementById('gridOverlay');
    elements.gridOpacitySlider = document.getElementById('gridOpacitySlider');
    elements.gridOpacityValue = document.getElementById('gridOpacityValue');
    elements.gridThicknessSlider = document.getElementById('gridThicknessSlider');
    elements.gridThicknessValue = document.getElementById('gridThicknessValue');
    elements.redoBtn = document.getElementById('redoBtn');
    elements.charPickerBtn = document.getElementById('charPickerBtn');
    elements.charPickerModal = document.getElementById('charPickerModal');
    elements.charPickerGrid = document.getElementById('charPickerGrid');
    elements.closeCharPicker = document.getElementById('closeCharPicker');
    elements.currentCharDisplay = document.getElementById('currentCharDisplay');
    elements.charSearch = document.getElementById('charSearch');
    elements.saveBtn = document.getElementById('saveBtn');
    elements.openBtn = document.getElementById('openBtn');
    elements.projectInput = document.getElementById('projectInput');
    elements.fontSelect = document.getElementById('fontSelect');
}

/* ============================================
   Theme Management
   ============================================ */

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ascii-art-theme', theme);
}

function initTheme() {
    const saved = localStorage.getItem('ascii-art-theme') || 'monodraw';
    elements.themeSelect.value = saved;
    setTheme(saved);
}

/* ============================================
   Undo/Redo System
   ============================================ */

function saveState() {
    const canvasCopy = state.canvas.map(row => [...row]);
    state.history.push(canvasCopy);
    state.redoStack = []; // Clear redo stack on new action
    if (state.history.length > state.maxHistory) {
        state.history.shift();
    }
    updateUndoRedoButtons();
}

function undo() {
    if (state.history.length > 0) {
        // Save current state to redo stack
        state.redoStack.push(state.canvas.map(row => [...row]));
        state.canvas = state.history.pop();
        renderCanvas();
        updateStats();
        updateUndoRedoButtons();
    }
}

function redo() {
    if (state.redoStack.length > 0) {
        // Save current state to history
        state.history.push(state.canvas.map(row => [...row]));
        state.canvas = state.redoStack.pop();
        renderCanvas();
        updateStats();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    elements.undoBtn.disabled = state.history.length === 0;
    elements.redoBtn.disabled = state.redoStack.length === 0;
}

/* ============================================
   Grid System
   ============================================ */

function updateGrid() {
    if (!state.showGrid) {
        elements.gridOverlay.classList.add('hidden');
        return;
    }

    elements.gridOverlay.classList.remove('hidden');

    // Get char dimensions from CSS variables (set in renderCanvas)
    const charWidth = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-width')) || 7.2;
    const charHeight = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-height')) || 12;

    const width = charWidth * state.cols;
    const height = charHeight * state.rows;

    elements.gridOverlay.style.width = width + 'px';
    elements.gridOverlay.style.height = height + 'px';

    // Get theme color
    const style = getComputedStyle(document.documentElement);
    const gridColor = style.getPropertyValue('--accent-primary').trim() || '#888';

    const opacity = state.gridOpacity / 100;
    const thickness = state.gridThickness;

    // Create grid with SVG
    elements.gridOverlay.innerHTML = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="${charWidth}" height="${charHeight}" patternUnits="userSpaceOnUse">
                    <path d="M ${charWidth} 0 L 0 0 0 ${charHeight}" fill="none" stroke="${gridColor}" stroke-width="${thickness}" opacity="${opacity}"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect x="${thickness/2}" y="${thickness/2}" width="${width - thickness}" height="${height - thickness}" fill="none" stroke="${gridColor}" stroke-width="${thickness}" opacity="${opacity}"/>
        </svg>
    `;
}

/* ============================================
   Image Position
   ============================================ */

function updateImageTransform() {
    const scale = state.imgScale / 100;
    elements.backgroundImage.style.transform = `translate(${state.imgPosX}px, ${state.imgPosY}px) scale(${scale})`;
}

function resetImagePosition() {
    state.imgPosX = 0;
    state.imgPosY = 0;
    state.imgScale = 100;
    elements.posXSlider.value = 0;
    elements.posYSlider.value = 0;
    elements.scaleSlider.value = 100;
    elements.posXValue.textContent = '0';
    elements.posYValue.textContent = '0';
    elements.scaleValue.textContent = '100%';
    updateImageTransform();
}

function removeImage() {
    // Clear image
    elements.backgroundImage.src = '';
    elements.backgroundImage.style.display = 'none';

    // Reset upload zone
    elements.uploadZone.classList.remove('has-image');
    elements.uploadZone.innerHTML = `
        <div class="upload-icon">◻</div>
        <div class="upload-text">Drop image or tap here</div>
    `;

    // Reset file input to allow re-uploading
    elements.imageInput.value = '';

    // Reset image state
    state.imageLoaded = false;

    // Reset image controls
    resetImagePosition();
    elements.opacitySlider.value = 30;
    elements.opacityValue.textContent = '30%';
    elements.backgroundImage.style.opacity = 0.3;
}

/* ============================================
   Character Picker
   ============================================ */

let currentCharTab = 'basic';

function openCharPicker() {
    elements.charPickerModal.classList.add('active');
    renderCharPickerGrid(currentCharTab);
    updateCurrentCharDisplay();
}

function closeCharPickerModal() {
    elements.charPickerModal.classList.remove('active');
}

function renderCharPickerGrid(tab) {
    currentCharTab = tab;
    const chars = charCategories[tab] || charCategories.basic;
    
    elements.charPickerGrid.innerHTML = '';
    chars.forEach(char => {
        const item = document.createElement('button');
        item.className = 'char-picker-item' + (char === state.currentChar ? ' selected' : '');
        item.textContent = char;
        item.addEventListener('click', () => selectCharFromPicker(char));
        // Touch support
        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            selectCharFromPicker(char);
        });
        elements.charPickerGrid.appendChild(item);
    });
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
}

function selectCharFromPicker(char) {
    state.currentChar = char;
    updateCurrentCharDisplay();
    
    // Update sidebar palette
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === char);
    });
    
    // Update picker grid selection
    document.querySelectorAll('.char-picker-item').forEach(item => {
        item.classList.toggle('selected', item.textContent === char);
    });
    
    elements.customChar.value = '';
}

function updateCurrentCharDisplay() {
    elements.currentCharDisplay.textContent = state.currentChar;
}

function filterCharsBySearch(query) {
    if (!query) {
        renderCharPickerGrid(currentCharTab);
        return;
    }
    
    // If single char, select it directly
    if (query.length === 1) {
        selectCharFromPicker(query);
        return;
    }
    
    // Search across all categories
    const allChars = Object.values(charCategories).flat();
    const filtered = [...new Set(allChars)].filter(char => 
        char.toLowerCase().includes(query.toLowerCase())
    );
    
    elements.charPickerGrid.innerHTML = '';
    filtered.forEach(char => {
        const item = document.createElement('button');
        item.className = 'char-picker-item' + (char === state.currentChar ? ' selected' : '');
        item.textContent = char;
        item.addEventListener('click', () => selectCharFromPicker(char));
        elements.charPickerGrid.appendChild(item);
    });
}

/* ============================================
   Save / Open Project
   ============================================ */

function saveProject() {
    // Ask for filename
    const defaultName = 'ascii-art-project';
    const filename = prompt('Enter project name (without extension):', defaultName);
    if (!filename) return; // User cancelled

    const project = {
        version: 1,
        cols: state.cols,
        rows: state.rows,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        canvas: state.canvas,
        // Image data if loaded
        referenceImage: state.imageLoaded ? elements.backgroundImage.src : null,
        imgPosX: state.imgPosX,
        imgPosY: state.imgPosY,
        imgScale: state.imgScale,
        // Grid settings
        showGrid: state.showGrid,
        gridOpacity: state.gridOpacity,
        gridThickness: state.gridThickness
    };

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.ascii';
    a.click();

    URL.revokeObjectURL(url);
}

function openProject(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const project = JSON.parse(e.target.result);
            
            // Validate version
            if (!project.version || !project.canvas) {
                alert('Invalid project file');
                return;
            }
            
            // Restore canvas settings
            state.cols = project.cols || 80;
            state.rows = project.rows || 40;
            state.fontSize = project.fontSize || 12;
            state.fontFamily = project.fontFamily || "'IBM Plex Mono', monospace";
            state.canvas = project.canvas;
            
            // Update UI sliders
            elements.colsSlider.value = state.cols;
            elements.colsValue.textContent = state.cols;
            elements.rowsSlider.value = state.rows;
            elements.rowsValue.textContent = state.rows;
            elements.fontSizeSlider.value = state.fontSize;
            elements.fontSizeValue.textContent = state.fontSize + 'px';
            elements.fontSelect.value = state.fontFamily;
            
            // Restore image if present
            if (project.referenceImage) {
                elements.backgroundImage.src = project.referenceImage;
                elements.backgroundImage.style.display = 'block';
                elements.uploadZone.classList.add('has-image');
                elements.uploadZone.innerHTML = `<img src="${project.referenceImage}" alt="Reference">`;
                state.imageLoaded = true;
                
                // Restore image position
                state.imgPosX = project.imgPosX || 0;
                state.imgPosY = project.imgPosY || 0;
                state.imgScale = project.imgScale || 100;
                
                elements.posXSlider.value = state.imgPosX;
                elements.posXValue.textContent = state.imgPosX;
                elements.posYSlider.value = state.imgPosY;
                elements.posYValue.textContent = state.imgPosY;
                elements.scaleSlider.value = state.imgScale;
                elements.scaleValue.textContent = state.imgScale + '%';
                
                updateImageTransform();
            }
            
            // Restore grid settings
            if (project.showGrid !== undefined) {
                state.showGrid = project.showGrid;
                elements.showGrid.checked = state.showGrid;
            }
            if (project.gridOpacity !== undefined) {
                state.gridOpacity = project.gridOpacity;
                elements.gridOpacitySlider.value = state.gridOpacity;
                elements.gridOpacityValue.textContent = state.gridOpacity + '%';
            }
            if (project.gridThickness !== undefined) {
                state.gridThickness = project.gridThickness;
                elements.gridThicknessSlider.value = state.gridThickness;
                elements.gridThicknessValue.textContent = state.gridThickness + 'px';
            }
            
            // Clear history
            state.history = [];
            state.redoStack = [];
            
            // Render
            renderCanvas();
            updateStats();
            updateUndoRedoButtons();
            updateGrid();
            
        } catch (err) {
            alert('Error loading project: ' + err.message);
        }
    };
    reader.readAsText(file);
}

/* ============================================
   Character Palette
   ============================================ */

function initCharPalette() {
    elements.charPalette.innerHTML = '';
    defaultChars.forEach((char) => {
        const btn = document.createElement('button');
        btn.className = 'char-btn' + (char === state.currentChar ? ' active' : '');
        btn.textContent = char;
        btn.addEventListener('click', () => selectChar(char));
        elements.charPalette.appendChild(btn);
    });
}

function selectChar(char) {
    state.currentChar = char;
    document.querySelectorAll('.char-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === char);
    });
    elements.customChar.value = '';
}

/* ============================================
   Canvas Management
   ============================================ */

function initCanvas() {
    state.canvas = [];
    for (let y = 0; y < state.rows; y++) {
        state.canvas[y] = [];
        for (let x = 0; x < state.cols; x++) {
            state.canvas[y][x] = ' ';
        }
    }
    state.history = [];
    state.redoStack = [];
    renderCanvas();
    updateStats();
    updateUndoRedoButtons();
    updateGrid();
}

function renderCanvas() {
    // Measure character dimensions accurately
    const testSpan = document.createElement('span');
    testSpan.style.fontFamily = state.fontFamily;
    testSpan.style.fontSize = state.fontSize + 'px';
    testSpan.style.visibility = 'hidden';
    testSpan.style.position = 'absolute';
    testSpan.textContent = 'M';
    document.body.appendChild(testSpan);
    const charWidth = testSpan.offsetWidth;
    const charHeight = testSpan.offsetHeight;
    document.body.removeChild(testSpan);

    // Set CSS variables for precise sizing
    elements.asciiCanvas.style.setProperty('--char-width', charWidth + 'px');
    elements.asciiCanvas.style.setProperty('--char-height', charHeight + 'px');

    elements.asciiCanvas.innerHTML = '';
    elements.asciiCanvas.style.fontSize = state.fontSize + 'px';
    elements.asciiCanvas.style.fontFamily = state.fontFamily;

    for (let y = 0; y < state.rows; y++) {
        const row = document.createElement('div');

        for (let x = 0; x < state.cols; x++) {
            const cell = document.createElement('span');
            cell.className = 'ascii-char' + (state.canvas[y][x] !== ' ' ? ' filled' : '');
            cell.textContent = state.canvas[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            row.appendChild(cell);
        }
        elements.asciiCanvas.appendChild(row);
    }

    updateCanvasSize();
    updateGrid();
}

function updateCanvasSize() {
    // Get char dimensions from CSS variables (set in renderCanvas)
    const charWidth = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-width')) || 7.2;
    const charHeight = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-height')) || 12;

    const canvasWidth = charWidth * state.cols;
    const canvasHeight = charHeight * state.rows;

    elements.backgroundImage.style.width = canvasWidth + 'px';
    elements.backgroundImage.style.height = canvasHeight + 'px';
}

function setCell(x, y, char) {
    if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
        state.canvas[y][x] = char;
        const cell = elements.asciiCanvas.children[y]?.children[x];
        if (cell) {
            cell.textContent = char;
            cell.classList.toggle('filled', char !== ' ');
        }
        updateStats();
    }
}

function getCellFromEvent(e) {
    const cell = e.target.closest('.ascii-char');
    if (cell && cell.dataset.x !== undefined && cell.dataset.y !== undefined) {
        return {
            x: parseInt(cell.dataset.x),
            y: parseInt(cell.dataset.y)
        };
    }

    // Fallback: calculate position based on mouse coordinates
    const canvasRect = elements.asciiCanvas.getBoundingClientRect();
    if (e.clientX < canvasRect.left || e.clientX > canvasRect.right ||
        e.clientY < canvasRect.top || e.clientY > canvasRect.bottom) {
        return null;
    }

    // Get CSS variables for char dimensions
    const charWidth = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-width')) || 7.2;
    const charHeight = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-height')) || 12;

    const x = Math.floor((e.clientX - canvasRect.left) / charWidth);
    const y = Math.floor((e.clientY - canvasRect.top) / charHeight);

    if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
        return { x, y };
    }

    return null;
}

function getCellFromTouch(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return null;

    // Try to find ascii-char element
    const cell = element.classList.contains('ascii-char')
        ? element
        : element.closest('.ascii-char');

    if (cell && cell.dataset.x !== undefined && cell.dataset.y !== undefined) {
        return {
            x: parseInt(cell.dataset.x),
            y: parseInt(cell.dataset.y)
        };
    }

    // Fallback: calculate position based on touch coordinates
    const canvasRect = elements.asciiCanvas.getBoundingClientRect();
    if (touch.clientX < canvasRect.left || touch.clientX > canvasRect.right ||
        touch.clientY < canvasRect.top || touch.clientY > canvasRect.bottom) {
        return null;
    }

    // Get CSS variables for char dimensions
    const charWidth = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-width')) || 7.2;
    const charHeight = parseFloat(getComputedStyle(elements.asciiCanvas).getPropertyValue('--char-height')) || 12;

    const x = Math.floor((touch.clientX - canvasRect.left) / charWidth);
    const y = Math.floor((touch.clientY - canvasRect.top) / charHeight);

    if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
        return { x, y };
    }

    return null;
}

function updateStats() {
    elements.canvasSize.textContent = `${state.cols} × ${state.rows}`;
    const charCount = state.canvas.flat().filter(c => c !== ' ').length;
    elements.charCount.textContent = `Chars: ${charCount}`;
}

function getAsciiText() {
    return state.canvas.map(row => row.join('')).join('\n');
}

function exportAsPng() {
    // Ask for filename
    const defaultName = 'ascii-art';
    const filename = prompt('Enter filename (without extension):', defaultName);
    if (!filename) return; // User cancelled

    // Get the current theme colors
    const style = getComputedStyle(document.documentElement);
    const charColor = style.getPropertyValue('--char-color').trim();

    // Measure character dimensions
    const testCanvas = document.createElement('canvas');
    const testCtx = testCanvas.getContext('2d');
    testCtx.font = `${state.fontSize}px ${state.fontFamily}`;
    const metrics = testCtx.measureText('M');
    const charWidth = metrics.width;
    const charHeight = state.fontSize * 1.2; // Add some line height

    // Create final canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Add padding
    const padding = 20;
    canvas.width = (charWidth * state.cols) + (padding * 2);
    canvas.height = (charHeight * state.rows) + (padding * 2);

    // Leave background transparent (don't fill)

    // Set text properties
    ctx.font = `${state.fontSize}px ${state.fontFamily}`;
    ctx.fillStyle = charColor;
    ctx.textBaseline = 'top';

    // Draw each character
    for (let y = 0; y < state.rows; y++) {
        for (let x = 0; x < state.cols; x++) {
            const char = state.canvas[y][x];
            if (char !== ' ') {
                const posX = padding + (x * charWidth);
                const posY = padding + (y * charHeight);
                ctx.fillText(char, posX, posY);
            }
        }
    }

    // Convert to blob and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.png';
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

/* ============================================
   Drawing Tools
   ============================================ */

function handleDraw(x, y) {
    const char = state.currentTool === 'erase' ? ' ' : state.currentChar;
    setCell(x, y, char);
}

function handleFill(startX, startY) {
    const targetChar = state.canvas[startY][startX];
    const fillChar = state.currentChar;
    
    if (targetChar === fillChar) return;

    const stack = [[startX, startY]];
    const visited = new Set();

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) continue;
        if (state.canvas[y][x] !== targetChar) continue;

        visited.add(key);
        setCell(x, y, fillChar);

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
}

function drawLine(x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        setCell(x0, y0, state.currentChar);

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function drawRect(x0, y0, x1, y1) {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    for (let x = minX; x <= maxX; x++) {
        setCell(x, minY, state.currentChar);
        setCell(x, maxY, state.currentChar);
    }
    for (let y = minY; y <= maxY; y++) {
        setCell(minX, y, state.currentChar);
        setCell(maxX, y, state.currentChar);
    }
}

function handleEyedropper(x, y) {
    const char = state.canvas[y][x];
    if (char && char !== ' ') {
        state.currentChar = char;

        // Update sidebar palette
        document.querySelectorAll('.char-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === char);
        });

        // Update custom char input
        elements.customChar.value = '';

        // Update character picker display if open
        updateCurrentCharDisplay();

        // Show visual feedback
        const original = elements.eyedropperTool.innerHTML;
        elements.eyedropperTool.innerHTML = char;
        setTimeout(() => elements.eyedropperTool.innerHTML = original, 500);

        // Auto-switch back to draw tool
        selectTool('draw');
    }
}

function selectTool(tool) {
    state.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tool + 'Tool').classList.add('active');
}

/* ============================================
   Image Handling
   ============================================ */

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.backgroundImage.src = e.target.result;
        elements.backgroundImage.style.display = 'block';
        elements.uploadZone.classList.add('has-image');
        elements.uploadZone.innerHTML = `<img src="${e.target.result}" alt="Reference">`;
        state.imageLoaded = true;
        updateCanvasSize();
    };
    reader.readAsDataURL(file);
}

/* ============================================
   Auto Convert
   ============================================ */

function getCharset() {
    const selected = elements.charsetSelect.value;
    if (selected === 'custom') {
        return elements.customCharset.value || charsets.detailed;
    }
    return charsets[selected];
}

function convertImageToAscii() {
    if (!state.imageLoaded) {
        alert('Primero cargá una imagen para convertir');
        return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = elements.backgroundImage.src;

    img.onload = () => {
        // Guardar estado para undo
        saveState();

        // Get the actual dimensions of the ASCII canvas in pixels
        const testSpan = document.createElement('span');
        testSpan.style.fontFamily = state.fontFamily;
        testSpan.style.fontSize = state.fontSize + 'px';
        testSpan.style.visibility = 'hidden';
        testSpan.textContent = 'M';
        document.body.appendChild(testSpan);
        const charWidth = testSpan.offsetWidth;
        document.body.removeChild(testSpan);

        const canvasPixelWidth = charWidth * state.cols;
        const canvasPixelHeight = state.fontSize * state.rows;

        // Create a larger temporary canvas to render the transformed image
        const displayCanvas = document.createElement('canvas');
        const displayCtx = displayCanvas.getContext('2d');
        displayCanvas.width = canvasPixelWidth;
        displayCanvas.height = canvasPixelHeight;

        // Apply transformations like the CSS does
        const scale = state.imgScale / 100;

        // Clear and draw the image with transformations
        displayCtx.save();
        displayCtx.translate(state.imgPosX, state.imgPosY);
        displayCtx.scale(scale, scale);
        displayCtx.drawImage(img, 0, 0, canvasPixelWidth, canvasPixelHeight);
        displayCtx.restore();

        // Now create the sampling canvas
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = state.cols;
        tempCanvas.height = state.rows;

        // Sample down to grid resolution
        ctx.drawImage(displayCanvas, 0, 0, canvasPixelWidth, canvasPixelHeight, 0, 0, state.cols, state.rows);

        const imageData = ctx.getImageData(0, 0, state.cols, state.rows);
        const pixels = imageData.data;

        const charset = getCharset();
        const contrast = elements.contrastSlider.value / 100;
        const invert = elements.invertColors.checked;

        for (let y = 0; y < state.rows; y++) {
            for (let x = 0; x < state.cols; x++) {
                const idx = (y * state.cols + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                const a = pixels[idx + 3];

                let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                luminance = ((luminance - 0.5) * contrast) + 0.5;
                luminance = Math.max(0, Math.min(1, luminance));

                if (invert) {
                    luminance = 1 - luminance;
                }

                if (a < 128) {
                    state.canvas[y][x] = ' ';
                } else {
                    const charIndex = Math.floor(luminance * (charset.length - 1));
                    state.canvas[y][x] = charset[charIndex];
                }
            }
        }

        renderCanvas();
        updateStats();
    };
}

/* ============================================
   Event Listeners
   ============================================ */

function initEventListeners() {
    // Theme
    elements.themeSelect.addEventListener('change', (e) => {
        setTheme(e.target.value);
        updateGrid(); // Actualizar grid con nuevo color
    });
    
    // Undo/Redo
    elements.undoBtn.addEventListener('click', undo);
    elements.redoBtn.addEventListener('click', redo);
    
    // Grid settings
    elements.showGrid.addEventListener('change', (e) => {
        state.showGrid = e.target.checked;
        updateGrid();
    });
    
    elements.gridOpacitySlider.addEventListener('input', (e) => {
        state.gridOpacity = parseInt(e.target.value);
        elements.gridOpacityValue.textContent = state.gridOpacity + '%';
        updateGrid();
    });
    
    elements.gridThicknessSlider.addEventListener('input', (e) => {
        state.gridThickness = parseFloat(e.target.value);
        elements.gridThicknessValue.textContent = state.gridThickness + 'px';
        updateGrid();
    });
    
    // Character Picker
    elements.charPickerBtn.addEventListener('click', openCharPicker);
    elements.closeCharPicker.addEventListener('click', closeCharPickerModal);
    elements.charPickerModal.addEventListener('click', (e) => {
        if (e.target === elements.charPickerModal) {
            closeCharPickerModal();
        }
    });
    
    elements.charSearch.addEventListener('input', (e) => {
        filterCharsBySearch(e.target.value);
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderCharPickerGrid(btn.dataset.tab);
            elements.charSearch.value = '';
        });
    });
    
    // Save / Open project
    elements.saveBtn.addEventListener('click', saveProject);
    elements.openBtn.addEventListener('click', () => elements.projectInput.click());
    elements.projectInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            openProject(file);
            e.target.value = ''; // Reset input
        }
    });
    
    // Image position
    elements.posXSlider.addEventListener('input', (e) => {
        state.imgPosX = parseInt(e.target.value);
        elements.posXValue.textContent = state.imgPosX;
        updateImageTransform();
    });
    
    elements.posYSlider.addEventListener('input', (e) => {
        state.imgPosY = parseInt(e.target.value);
        elements.posYValue.textContent = state.imgPosY;
        updateImageTransform();
    });
    
    elements.resetImageBtn.addEventListener('click', resetImagePosition);
    elements.removeImageBtn.addEventListener('click', removeImage);

    // Canvas drawing
    elements.asciiCanvas.addEventListener('mousedown', (e) => {
        const pos = getCellFromEvent(e);
        if (!pos) return;

        // Handle eyedropper tool
        if (state.currentTool === 'eyedropper') {
            handleEyedropper(pos.x, pos.y);
            return;
        }

        state.isDrawing = true;

        // Guardar estado para undo
        saveState();

        if (state.currentTool === 'draw' || state.currentTool === 'erase') {
            handleDraw(pos.x, pos.y);
        } else if (state.currentTool === 'fill') {
            handleFill(pos.x, pos.y);
        } else if (state.currentTool === 'line' || state.currentTool === 'rect') {
            state.startPos = pos;
        }
    });

    elements.asciiCanvas.addEventListener('mousemove', (e) => {
        const pos = getCellFromEvent(e);
        if (!pos) return;

        elements.cursorPos.textContent = `${pos.x}, ${pos.y}`;

        if (state.isDrawing && (state.currentTool === 'draw' || state.currentTool === 'erase')) {
            handleDraw(pos.x, pos.y);
        }
    });

    elements.asciiCanvas.addEventListener('mouseup', (e) => {
        const pos = getCellFromEvent(e);
        
        if (state.startPos && pos) {
            if (state.currentTool === 'line') {
                drawLine(state.startPos.x, state.startPos.y, pos.x, pos.y);
            } else if (state.currentTool === 'rect') {
                drawRect(state.startPos.x, state.startPos.y, pos.x, pos.y);
            }
        }

        state.isDrawing = false;
        state.startPos = null;
    });

    elements.asciiCanvas.addEventListener('mouseleave', () => {
        state.isDrawing = false;
        state.startPos = null;
    });

    // Touch support for canvas
    elements.asciiCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const pos = getCellFromTouch(touch);
        if (!pos) return;

        // Handle eyedropper tool
        if (state.currentTool === 'eyedropper') {
            handleEyedropper(pos.x, pos.y);
            return;
        }

        state.isDrawing = true;
        saveState();

        if (state.currentTool === 'draw' || state.currentTool === 'erase') {
            handleDraw(pos.x, pos.y);
        } else if (state.currentTool === 'fill') {
            handleFill(pos.x, pos.y);
        } else if (state.currentTool === 'line' || state.currentTool === 'rect') {
            state.startPos = pos;
        }
    }, { passive: false });

    elements.asciiCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const pos = getCellFromTouch(touch);
        if (!pos) return;

        elements.cursorPos.textContent = `${pos.x}, ${pos.y}`;

        if (state.isDrawing && (state.currentTool === 'draw' || state.currentTool === 'erase')) {
            handleDraw(pos.x, pos.y);
        }
    }, { passive: false });

    elements.asciiCanvas.addEventListener('touchend', (e) => {
        if (state.startPos) {
            const touch = e.changedTouches[0];
            const pos = getCellFromTouch(touch);
            if (pos) {
                if (state.currentTool === 'line') {
                    drawLine(state.startPos.x, state.startPos.y, pos.x, pos.y);
                } else if (state.currentTool === 'rect') {
                    drawRect(state.startPos.x, state.startPos.y, pos.x, pos.y);
                }
            }
        }
        state.isDrawing = false;
        state.startPos = null;
    });

    // Tool selection
    elements.drawTool.addEventListener('click', () => selectTool('draw'));
    elements.eraserTool.addEventListener('click', () => selectTool('erase'));
    elements.fillTool.addEventListener('click', () => selectTool('fill'));
    elements.lineTool.addEventListener('click', () => selectTool('line'));
    elements.rectTool.addEventListener('click', () => selectTool('rect'));
    elements.eyedropperTool.addEventListener('click', () => selectTool('eyedropper'));

    // Image upload
    elements.uploadZone.addEventListener('click', () => elements.imageInput.click());

    elements.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadZone.style.borderColor = 'var(--accent-primary)';
    });

    elements.uploadZone.addEventListener('dragleave', () => {
        elements.uploadZone.style.borderColor = 'var(--border-color)';
    });

    elements.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadZone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImage(file);
        }
    });

    elements.editorArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.editorArea.classList.add('drag-over');
    });

    elements.editorArea.addEventListener('dragleave', (e) => {
        if (!elements.editorArea.contains(e.relatedTarget)) {
            elements.editorArea.classList.remove('drag-over');
        }
    });

    elements.editorArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.editorArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImage(file);
        }
    });

    elements.imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) loadImage(file);
    });

    // Sliders
    elements.opacitySlider.addEventListener('input', (e) => {
        elements.opacityValue.textContent = e.target.value + '%';
        elements.backgroundImage.style.opacity = e.target.value / 100;
    });

    elements.scaleSlider.addEventListener('input', (e) => {
        state.imgScale = parseInt(e.target.value);
        elements.scaleValue.textContent = state.imgScale + '%';
        updateImageTransform();
    });

    elements.colsSlider.addEventListener('input', (e) => {
        state.cols = parseInt(e.target.value);
        elements.colsValue.textContent = state.cols;
        initCanvas();
    });

    elements.rowsSlider.addEventListener('input', (e) => {
        state.rows = parseInt(e.target.value);
        elements.rowsValue.textContent = state.rows;
        initCanvas();
    });

    elements.fontSizeSlider.addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        elements.fontSizeValue.textContent = state.fontSize + 'px';
        renderCanvas();
    });
    
    elements.fontSelect.addEventListener('change', (e) => {
        state.fontFamily = e.target.value;
        renderCanvas();
    });

    elements.customChar.addEventListener('input', (e) => {
        const char = e.target.value;
        if (char) {
            state.currentChar = char;
            document.querySelectorAll('.char-btn').forEach(btn => btn.classList.remove('active'));
        }
    });

    // Auto convert
    elements.autoConvertBtn.addEventListener('click', convertImageToAscii);
    elements.convertNowBtn.addEventListener('click', convertImageToAscii);

    elements.charsetSelect.addEventListener('change', (e) => {
        elements.customCharsetGroup.style.display = 
            e.target.value === 'custom' ? 'block' : 'none';
    });

    elements.contrastSlider.addEventListener('input', (e) => {
        elements.contrastValue.textContent = e.target.value + '%';
    });

    // Actions
    elements.clearBtn.addEventListener('click', () => {
        if (confirm('¿Limpiar el canvas?')) {
            initCanvas();
        }
    });

    elements.exportBtn.addEventListener('click', () => {
        elements.exportPreview.textContent = getAsciiText();
        elements.exportModal.classList.add('active');
    });

    elements.copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(getAsciiText()).then(() => {
            const original = elements.copyBtn.innerHTML;
            elements.copyBtn.textContent = '✓ Copied';
            setTimeout(() => elements.copyBtn.innerHTML = original, 2000);
        });
    });

    elements.closeModal.addEventListener('click', () => {
        elements.exportModal.classList.remove('active');
    });

    elements.copyExportBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(getAsciiText());
        elements.copyExportBtn.textContent = '✓ Copied';
        setTimeout(() => elements.copyExportBtn.innerHTML = '❐ Copy', 2000);
    });

    elements.downloadBtn.addEventListener('click', () => {
        // Ask for filename
        const defaultName = 'ascii-art';
        const filename = prompt('Enter filename (without extension):', defaultName);
        if (!filename) return; // User cancelled

        const text = getAsciiText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    elements.downloadPngBtn.addEventListener('click', () => {
        exportAsPng();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        if (e.key === 'd') selectTool('draw');
        if (e.key === 'e') selectTool('erase');
        if (e.key === 'f') selectTool('fill');
        if (e.key === 'l') selectTool('line');
        if (e.key === 'r') selectTool('rect');
        if (e.key === 'i') selectTool('eyedropper');
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveProject();
        }
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            elements.projectInput.click();
        }
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            navigator.clipboard.writeText(getAsciiText());
        }
    });
}

/* ============================================
   Initialize Application
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initTheme();
    initCharPalette();
    initCanvas();
    initEventListeners();
});
