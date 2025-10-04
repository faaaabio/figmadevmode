// Elementos do DOM
const formatSelect = document.getElementById('format-select');
const generateBtn = document.getElementById('generate-btn');
const resultadoEl = document.querySelector('#resultado code');
const copyBtn = document.getElementById('copy-btn');
const toastEl = document.getElementById('toast');
const visualPreview = document.getElementById('visual-preview');

let currentTab = 'tipografia';

// ===== COLETA DE DADOS =====

function getTypographyTokens() {
    const tokens = {
        fontFamily: document.getElementById('tipo-font-family').value || 'Inter, sans-serif',
        fontSize: {},
        fontWeight: {},
        lineHeight: {}
    };

    // Font Sizes
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
    sizes.forEach(size => {
        const value = document.getElementById(`tipo-${size}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.fontSize[size] = match ? match[1].trim() : value;
        }
    });

    // Font Weights
    const weights = ['light', 'regular', 'medium', 'semibold', 'bold'];
    weights.forEach(weight => {
        const value = document.getElementById(`tipo-${weight}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.fontWeight[weight] = match ? match[1].trim() : value;
        }
    });

    // Line Heights
    const lineHeights = ['tight', 'normal', 'relaxed'];
    lineHeights.forEach(lh => {
        const value = document.getElementById(`tipo-${lh}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.lineHeight[lh] = match ? match[1].trim() : value;
        }
    });

    return tokens;
}

function getColorTokens() {
    const tokens = {
        primary: {},
        secondary: {},
        neutral: {},
        semantic: {}
    };

    // Primary
    ['primary', 'primary-dark', 'primary-light'].forEach(color => {
        const value = document.getElementById(`cor-${color}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.primary[color] = match ? match[1].trim() : value;
        }
    });

    // Secondary
    ['secondary', 'secondary-dark', 'secondary-light'].forEach(color => {
        const value = document.getElementById(`cor-${color}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.secondary[color] = match ? match[1].trim() : value;
        }
    });

    // Neutral
    ['white', 'black', 'gray-100', 'gray-500', 'gray-900'].forEach(color => {
        const value = document.getElementById(`cor-${color}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.neutral[color] = match ? match[1].trim() : value;
        }
    });

    // Semantic
    ['success', 'warning', 'error', 'info'].forEach(color => {
        const value = document.getElementById(`cor-${color}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens.semantic[color] = match ? match[1].trim() : value;
        }
    });

    return tokens;
}

function getSpacingTokens() {
    const tokens = {};
    const spaces = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];

    spaces.forEach(space => {
        const value = document.getElementById(`space-${space}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens[space] = match ? match[1].trim() : value;
        }
    });

    return tokens;
}

function getRadiusTokens() {
    const tokens = {};
    const radii = ['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];

    radii.forEach(radius => {
        const value = document.getElementById(`radius-${radius}`).value;
        if (value) {
            const match = value.match(/:\s*(.+)/);
            tokens[radius] = match ? match[1].trim() : value;
        }
    });

    return tokens;
}

// ===== GERADORES =====

function generateCSS() {
    let css = ':root {\n';

    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        css += `  /* Font Family */\n`;
        css += `  --font-family: ${tokens.fontFamily};\n\n`;

        css += `  /* Font Sizes */\n`;
        Object.entries(tokens.fontSize).forEach(([key, value]) => {
            css += `  --font-size-${key}: ${value};\n`;
        });

        css += `\n  /* Font Weights */\n`;
        Object.entries(tokens.fontWeight).forEach(([key, value]) => {
            css += `  --font-weight-${key}: ${value};\n`;
        });

        css += `\n  /* Line Heights */\n`;
        Object.entries(tokens.lineHeight).forEach(([key, value]) => {
            css += `  --line-height-${key}: ${value};\n`;
        });

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        css += `  /* Primary Colors */\n`;
        Object.entries(tokens.primary).forEach(([key, value]) => {
            css += `  --color-${key}: ${value};\n`;
        });

        css += `\n  /* Secondary Colors */\n`;
        Object.entries(tokens.secondary).forEach(([key, value]) => {
            css += `  --color-${key}: ${value};\n`;
        });

        css += `\n  /* Neutral Colors */\n`;
        Object.entries(tokens.neutral).forEach(([key, value]) => {
            css += `  --color-${key}: ${value};\n`;
        });

        css += `\n  /* Semantic Colors */\n`;
        Object.entries(tokens.semantic).forEach(([key, value]) => {
            css += `  --color-${key}: ${value};\n`;
        });

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        css += `  /* Spacing */\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            css += `  --space-${key}: ${value};\n`;
        });

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        css += `  /* Border Radius */\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            css += `  --radius-${key}: ${value};\n`;
        });
    }

    css += '}';
    return css;
}

function generateJS() {
    let js = 'export const tokens = {\n';

    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        js += `  typography: {\n`;
        js += `    fontFamily: '${tokens.fontFamily}',\n`;
        js += `    fontSize: ${JSON.stringify(tokens.fontSize, null, 6)},\n`;
        js += `    fontWeight: ${JSON.stringify(tokens.fontWeight, null, 6)},\n`;
        js += `    lineHeight: ${JSON.stringify(tokens.lineHeight, null, 6)}\n`;
        js += `  }\n`;

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        js += `  colors: {\n`;
        js += `    primary: ${JSON.stringify(tokens.primary, null, 6)},\n`;
        js += `    secondary: ${JSON.stringify(tokens.secondary, null, 6)},\n`;
        js += `    neutral: ${JSON.stringify(tokens.neutral, null, 6)},\n`;
        js += `    semantic: ${JSON.stringify(tokens.semantic, null, 6)}\n`;
        js += `  }\n`;

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        js += `  spacing: ${JSON.stringify(tokens, null, 4)}\n`;

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        js += `  borderRadius: ${JSON.stringify(tokens, null, 4)}\n`;
    }

    js += '};';
    return js;
}

function generateTailwind() {
    let config = '// tailwind.config.js\n';
    config += 'module.exports = {\n';
    config += '  theme: {\n';
    config += '    extend: {\n';

    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        config += `      fontFamily: {\n`;
        config += `        sans: ['${tokens.fontFamily}'],\n`;
        config += `      },\n`;
        config += `      fontSize: ${JSON.stringify(tokens.fontSize, null, 8)},\n`;
        config += `      fontWeight: ${JSON.stringify(tokens.fontWeight, null, 8)},\n`;
        config += `      lineHeight: ${JSON.stringify(tokens.lineHeight, null, 8)}\n`;

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        config += `      colors: {\n`;
        config += `        primary: ${JSON.stringify(tokens.primary, null, 8)},\n`;
        config += `        secondary: ${JSON.stringify(tokens.secondary, null, 8)},\n`;
        config += `        neutral: ${JSON.stringify(tokens.neutral, null, 8)},\n`;
        config += `        ...${JSON.stringify(tokens.semantic, null, 8)}\n`;
        config += `      }\n`;

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        config += `      spacing: ${JSON.stringify(tokens, null, 8)}\n`;

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        config += `      borderRadius: ${JSON.stringify(tokens, null, 8)}\n`;
    }

    config += '    }\n';
    config += '  }\n';
    config += '}';
    return config;
}

function generateSCSS() {
    let scss = '';

    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        scss += `// Font Family\n`;
        scss += `$font-family: ${tokens.fontFamily};\n\n`;

        scss += `// Font Sizes\n`;
        Object.entries(tokens.fontSize).forEach(([key, value]) => {
            scss += `$font-size-${key}: ${value};\n`;
        });

        scss += `\n// Font Weights\n`;
        Object.entries(tokens.fontWeight).forEach(([key, value]) => {
            scss += `$font-weight-${key}: ${value};\n`;
        });

        scss += `\n// Line Heights\n`;
        Object.entries(tokens.lineHeight).forEach(([key, value]) => {
            scss += `$line-height-${key}: ${value};\n`;
        });

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        scss += `// Primary Colors\n`;
        Object.entries(tokens.primary).forEach(([key, value]) => {
            scss += `$color-${key}: ${value};\n`;
        });

        scss += `\n// Secondary Colors\n`;
        Object.entries(tokens.secondary).forEach(([key, value]) => {
            scss += `$color-${key}: ${value};\n`;
        });

        scss += `\n// Neutral Colors\n`;
        Object.entries(tokens.neutral).forEach(([key, value]) => {
            scss += `$color-${key}: ${value};\n`;
        });

        scss += `\n// Semantic Colors\n`;
        Object.entries(tokens.semantic).forEach(([key, value]) => {
            scss += `$color-${key}: ${value};\n`;
        });

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        scss += `// Spacing\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            scss += `$space-${key}: ${value};\n`;
        });

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        scss += `// Border Radius\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            scss += `$radius-${key}: ${value};\n`;
        });
    }

    return scss;
}

function generatePrompt() {
    let prompt = '';

    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        prompt = `Crie um design system de tipografia com os seguintes tokens:\n\n`;
        prompt += `**Font Family:** ${tokens.fontFamily}\n\n`;

        if (Object.keys(tokens.fontSize).length > 0) {
            prompt += `**Font Sizes:**\n`;
            Object.entries(tokens.fontSize).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
            prompt += `\n`;
        }

        if (Object.keys(tokens.fontWeight).length > 0) {
            prompt += `**Font Weights:**\n`;
            Object.entries(tokens.fontWeight).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
            prompt += `\n`;
        }

        if (Object.keys(tokens.lineHeight).length > 0) {
            prompt += `**Line Heights:**\n`;
            Object.entries(tokens.lineHeight).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
        }

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        prompt = `Crie um design system de cores com os seguintes tokens:\n\n`;

        if (Object.keys(tokens.primary).length > 0) {
            prompt += `**Cores Primárias:**\n`;
            Object.entries(tokens.primary).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
            prompt += `\n`;
        }

        if (Object.keys(tokens.secondary).length > 0) {
            prompt += `**Cores Secundárias:**\n`;
            Object.entries(tokens.secondary).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
            prompt += `\n`;
        }

        if (Object.keys(tokens.neutral).length > 0) {
            prompt += `**Cores Neutras:**\n`;
            Object.entries(tokens.neutral).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
            prompt += `\n`;
        }

        if (Object.keys(tokens.semantic).length > 0) {
            prompt += `**Cores Semânticas:**\n`;
            Object.entries(tokens.semantic).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });
        }

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        prompt = `Crie um design system de espaçamento com os seguintes tokens:\n\n`;
        prompt += `**Spacing Scale:**\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            prompt += `- ${key}: ${value}\n`;
        });

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        prompt = `Crie um design system de border radius com os seguintes tokens:\n\n`;
        prompt += `**Border Radius Scale:**\n`;
        Object.entries(tokens).forEach(([key, value]) => {
            prompt += `- ${key}: ${value}\n`;
        });
    }

    prompt += `\n---\n\nUse estes tokens de forma consistente em todos os componentes do design system.`;

    return prompt;
}

// ===== PREVIEW VISUAL =====

function updateVisualPreview() {
    if (currentTab === 'tipografia') {
        const tokens = getTypographyTokens();

        let html = '<div class="space-y-3">';
        Object.entries(tokens.fontSize).forEach(([key, value]) => {
            html += `<div style="font-size: ${value}; font-family: ${tokens.fontFamily}; color: #ffffff;">`;
            html += `${key}: ${value}`;
            html += `</div>`;
        });
        html += '</div>';

        visualPreview.innerHTML = html;

    } else if (currentTab === 'cores') {
        const tokens = getColorTokens();

        let html = '<div class="grid grid-cols-2 gap-3">';

        // Primary
        Object.entries(tokens.primary).forEach(([key, value]) => {
            html += `<div class="flex items-center gap-2">`;
            html += `<div style="width: 40px; height: 40px; background: ${value}; border-radius: 4px;"></div>`;
            html += `<span class="text-xs text-gray-300">${key}</span>`;
            html += `</div>`;
        });

        // Secondary
        Object.entries(tokens.secondary).forEach(([key, value]) => {
            html += `<div class="flex items-center gap-2">`;
            html += `<div style="width: 40px; height: 40px; background: ${value}; border-radius: 4px;"></div>`;
            html += `<span class="text-xs text-gray-300">${key}</span>`;
            html += `</div>`;
        });

        html += '</div>';
        visualPreview.innerHTML = html;

    } else if (currentTab === 'spacing') {
        const tokens = getSpacingTokens();

        let html = '<div class="space-y-2">';
        Object.entries(tokens).forEach(([key, value]) => {
            html += `<div class="flex items-center gap-3">`;
            html += `<div style="width: ${value}; height: 20px; background: #3b82f6;"></div>`;
            html += `<span class="text-xs text-gray-300">${key}: ${value}</span>`;
            html += `</div>`;
        });
        html += '</div>';

        visualPreview.innerHTML = html;

    } else if (currentTab === 'radius') {
        const tokens = getRadiusTokens();

        let html = '<div class="grid grid-cols-3 gap-3">';
        Object.entries(tokens).forEach(([key, value]) => {
            html += `<div class="text-center">`;
            html += `<div style="width: 60px; height: 60px; background: #3b82f6; border-radius: ${value}; margin: 0 auto 8px;"></div>`;
            html += `<span class="text-xs text-gray-300">${key}</span>`;
            html += `</div>`;
        });
        html += '</div>';

        visualPreview.innerHTML = html;
    }
}

// ===== SISTEMA DE ABAS =====

function switchTab(tabName) {
    currentTab = tabName;

    // Remove active de todos os botões
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-white', 'text-black');
        btn.classList.add('text-gray-400');
        btn.style.backgroundColor = '#1a1a18';
    });

    // Adiciona active no botão clicado
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.add('bg-white', 'text-black');
    activeBtn.classList.remove('text-gray-400');
    activeBtn.style.backgroundColor = '';

    // Esconde todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Mostra o conteúdo ativo
    document.getElementById(`content-${tabName}`).classList.remove('hidden');

    // Atualiza preview
    updateVisualPreview();
}

// Event listeners das abas
document.getElementById('tab-tipografia').addEventListener('click', () => switchTab('tipografia'));
document.getElementById('tab-cores').addEventListener('click', () => switchTab('cores'));
document.getElementById('tab-spacing').addEventListener('click', () => switchTab('spacing'));
document.getElementById('tab-radius').addEventListener('click', () => switchTab('radius'));

// Geração de tokens
generateBtn.addEventListener('click', () => {
    try {
        const format = formatSelect.value;
        let result = '';

        switch(format) {
            case 'prompt':
                result = generatePrompt();
                break;
            case 'css':
                result = generateCSS();
                break;
            case 'js':
                result = generateJS();
                break;
            case 'tailwind':
                result = generateTailwind();
                break;
            case 'scss':
                result = generateSCSS();
                break;
            default:
                result = '// Formato não suportado';
        }

        resultadoEl.textContent = result;
    } catch (error) {
        console.error('Erro na geração:', error);
        showToast('Erro ao gerar tokens', true);
        resultadoEl.textContent = `// Erro: ${error.message}`;
    }
});

// Clipboard
copyBtn.addEventListener('click', async () => {
    try {
        const textoParaCopiar = resultadoEl.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textoParaCopiar);
            showToast('Copiado com sucesso!');
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = textoParaCopiar;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Copiado com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao copiar:', error);
        showToast('Erro ao copiar texto', true);
    }
});

// Toast
function showToast(message, isError = false) {
    toastEl.textContent = message;
    toastEl.className = 'fixed bottom-5 right-5 py-2 px-5 rounded-lg shadow-xl text-sm';
    if (isError) {
        toastEl.style.backgroundColor = '#dc2626';
        toastEl.style.color = '#ffffff';
    } else {
        toastEl.style.backgroundColor = '#3a3a38';
        toastEl.style.color = '#ffffff';
    }
    toastEl.classList.add('toast-animation');
    setTimeout(() => {
        toastEl.classList.remove('toast-animation');
    }, 3000);
}

// Event listeners para preview em tempo real
document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', updateVisualPreview);
});

// Inicializa preview
updateVisualPreview();
