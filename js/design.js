// ===== FUNÇÕES GLOBAIS (DEVEM SER DEFINIDAS PRIMEIRO) =====

// Função global para definir valor através das tags
window.setTagValue = function(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = value;
        if (typeof updateVisualPreview === 'function') {
            updateVisualPreview();
        }
    }
}

// Elementos do DOM
const techSelect = document.getElementById('tech-select');
const convertBtn = document.getElementById('convert-btn');
const resultadoEl = document.querySelector('#resultado code');
const copyBtn = document.getElementById('copy-btn');
const toastEl = document.getElementById('toast');
const visualPreview = document.getElementById('visual-preview');

let currentTab = 'botao';

// Mapeamento de tamanhos Tailwind para pixels
const sizeMap = {
    'xs': '12px',
    'sm': '14px',
    'base': '16px',
    'lg': '18px',
    'xl': '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
    '8xl': '96px',
    '9xl': '128px'
};

// ===== PREVIEW VISUAL =====

function updateVisualPreview() {
    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || '';
        const bg = document.getElementById('botao-bg').value || '#ffffff';
        const padding = document.getElementById('botao-padding').value || '12px';
        const borda = document.getElementById('botao-borda').value || 'none';
        const radius = document.getElementById('botao-radius').value || '8px';
        const display = document.getElementById('botao-display')?.value || 'inline-flex';
        const align = document.getElementById('botao-align')?.value || 'center';
        const gap = document.getElementById('botao-gap')?.value || '8px';

        // Coleta elementos dinâmicos
        let elementosHtml = conteudo;
        document.querySelectorAll('#botao-elementos > div').forEach(el => {
            const id = el.querySelector('input')?.id || '';
            if (id.includes('-text-')) {
                const textContent = el.querySelector(`#${id.replace('-content', '-content')}`)?.value || '';
                const textColor = el.querySelector(`#${id.replace('-content', '-color')}`)?.value || '#000';
                elementosHtml += `<span style="color: ${textColor};">${textContent}</span>`;
            } else if (id.includes('-icon-')) {
                const iconName = el.querySelector(`#${id.replace('-name', '-name')}`)?.value || '';
                elementosHtml += `<span>${iconName}</span>`;
            }
        });

        visualPreview.innerHTML = `
            <button style="display: ${display}; align-items: ${align}; gap: ${gap}; background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius}; cursor: pointer;">
                ${elementosHtml || 'Botão'}
            </button>
        `;
    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || '';
        const bg = document.getElementById('lista-bg').value || '#ffffff';
        const padding = document.getElementById('lista-padding').value || '12px';
        const borda = document.getElementById('lista-borda').value || 'none';
        const radius = document.getElementById('lista-radius').value || '8px';
        const display = document.getElementById('lista-display')?.value || 'flex';
        const gap = document.getElementById('lista-gap')?.value || '8px';

        // Coleta elementos dinâmicos
        let elementosHtml = conteudo;
        document.querySelectorAll('#lista-elementos > div').forEach(el => {
            const id = el.querySelector('input')?.id || '';
            if (id.includes('-text-')) {
                const textContent = el.querySelector(`#${id.replace('-content', '-content')}`)?.value || '';
                const textColor = el.querySelector(`#${id.replace('-content', '-color')}`)?.value || '#000';
                elementosHtml += `<span style="color: ${textColor};">${textContent}</span>`;
            } else if (id.includes('-icon-')) {
                const iconName = el.querySelector(`#${id.replace('-name', '-name')}`)?.value || '';
                elementosHtml += `<span>${iconName}</span>`;
            }
        });

        visualPreview.innerHTML = `
            <ul style="list-style: none; padding: 0; margin: 0; display: ${display}; flex-direction: column; gap: ${gap};">
                <li style="background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${elementosHtml || 'Item 1'}</li>
                <li style="background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${elementosHtml || 'Item 2'}</li>
                <li style="background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${elementosHtml || 'Item 3'}</li>
            </ul>
        `;
    } else if (currentTab === 'input') {
        const placeholder = document.getElementById('input-placeholder').value || 'Digite algo...';
        const padding = document.getElementById('input-padding').value || '12px';
        const borda = document.getElementById('input-borda').value || '1px solid #d4d4d4';
        const radius = document.getElementById('input-radius').value || '8px';

        visualPreview.innerHTML = `
            <input type="text" placeholder="${placeholder}" style="padding: ${padding}; border: ${borda}; border-radius: ${radius}; width: 100%; max-width: 300px;">
        `;
    } else if (currentTab === 'tipografia') {
        const conteudo = document.getElementById('tipo-conteudo').value || 'Texto de exemplo';
        const tamanho = document.getElementById('tipo-tamanho')?.value || '16px';
        const cor = document.getElementById('tipo-cor')?.value || '#ffffff';

        visualPreview.innerHTML = `
            <span style="font-size: ${tamanho}; color: ${cor};">${conteudo}</span>
        `;
    }
}

// ===== CONVERSORES =====

function convertToTailwind() {
    let code = '';

    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || 'Botão';
        const cor = document.getElementById('botao-cor').value;
        const bg = document.getElementById('botao-bg').value;
        const padding = document.getElementById('botao-padding').value;
        const radius = document.getElementById('botao-radius').value;

        const classes = [];

        // Padding
        if (padding) {
            const pxValue = parseInt(padding);
            const tailwindValue = pxValue / 4;
            classes.push(`px-${tailwindValue} py-${tailwindValue}`);
        }

        // Radius
        if (radius === '9999px') {
            classes.push('rounded-full');
        } else if (radius) {
            const radiusPx = parseInt(radius);
            const radiusClass = radiusPx / 4;
            classes.push(`rounded-${radiusClass > 0 ? radiusClass : ''}`);
        }

        code = `<button className="${classes.join(' ')}" ${bg ? `style="background: ${bg}; color: ${cor || '#000'}"` : ''}>\n`;
        code += `  ${conteudo}\n`;
        code += `</button>`;

    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || 'Item';
        const cor = document.getElementById('lista-cor').value;
        const bg = document.getElementById('lista-bg').value;
        const padding = document.getElementById('lista-padding').value;
        const radius = document.getElementById('lista-radius').value;

        const classes = [];

        if (padding) {
            const pxValue = parseInt(padding);
            const tailwindValue = pxValue / 4;
            classes.push(`p-${tailwindValue}`);
        }

        if (radius === '9999px') {
            classes.push('rounded-full');
        } else if (radius) {
            const radiusPx = parseInt(radius);
            const radiusClass = radiusPx / 4;
            classes.push(`rounded-${radiusClass > 0 ? radiusClass : ''}`);
        }

        code = `<ul className="flex flex-col gap-2">\n`;
        code += `  <li className="${classes.join(' ')}" ${bg ? `style="background: ${bg}; color: ${cor || '#000'}"` : ''}>${conteudo} 1</li>\n`;
        code += `  <li className="${classes.join(' ')}" ${bg ? `style="background: ${bg}; color: ${cor || '#000'}"` : ''}>${conteudo} 2</li>\n`;
        code += `  <li className="${classes.join(' ')}" ${bg ? `style="background: ${bg}; color: ${cor || '#000'}"` : ''}>${conteudo} 3</li>\n`;
        code += `</ul>`;

    } else if (currentTab === 'input') {
        const placeholder = document.getElementById('input-placeholder').value || 'Digite algo...';
        const padding = document.getElementById('input-padding').value;
        const radius = document.getElementById('input-radius').value;

        const classes = [];

        if (padding) {
            const pxValue = parseInt(padding);
            const tailwindValue = pxValue / 4;
            classes.push(`p-${tailwindValue}`);
        }

        if (radius === '9999px') {
            classes.push('rounded-full');
        } else if (radius) {
            const radiusPx = parseInt(radius);
            const radiusClass = radiusPx / 4;
            classes.push(`rounded-${radiusClass > 0 ? radiusClass : ''}`);
        }

        code = `<input\n`;
        code += `  type="text"\n`;
        code += `  placeholder="${placeholder}"\n`;
        code += `  className="${classes.join(' ')}"\n`;
        code += `/>`;

    } else if (currentTab === 'tipografia') {
        const conteudo = document.getElementById('tipo-conteudo').value || 'Texto';
        const tamanho = document.getElementById('tipo-tamanho').value || 'base';

        code = `<span className="text-${tamanho}">${conteudo}</span>`;
    }

    return code;
}

function convertToReactNative() {
    let code = '';

    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || 'Botão';
        const cor = document.getElementById('botao-cor').value || '#000000';
        const bg = document.getElementById('botao-bg').value || '#ffffff';
        const padding = document.getElementById('botao-padding').value || '12px';
        const radius = document.getElementById('botao-radius').value || '8px';

        const styles = {
            backgroundColor: bg,
            padding: parseInt(padding),
            borderRadius: parseInt(radius)
        };

        code = `import { TouchableOpacity, Text } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  button: ${JSON.stringify(styles, null, 4).replace(/"/g, "'")},\n`;
        code += `  text: { color: '${cor}' }\n`;
        code += `});\n\n`;
        code += `<TouchableOpacity style={styles.button}>\n`;
        code += `  <Text style={styles.text}>${conteudo}</Text>\n`;
        code += `</TouchableOpacity>`;

    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || 'Item';
        const cor = document.getElementById('lista-cor').value || '#000000';
        const bg = document.getElementById('lista-bg').value || '#ffffff';
        const padding = document.getElementById('lista-padding').value || '12px';
        const radius = document.getElementById('lista-radius').value || '8px';

        const styles = {
            backgroundColor: bg,
            padding: parseInt(padding),
            borderRadius: parseInt(radius),
            marginBottom: 8
        };

        code = `import { View, Text } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  item: ${JSON.stringify(styles, null, 4).replace(/"/g, "'")},\n`;
        code += `  text: { color: '${cor}' }\n`;
        code += `});\n\n`;
        code += `<View>\n`;
        code += `  <View style={styles.item}><Text style={styles.text}>${conteudo} 1</Text></View>\n`;
        code += `  <View style={styles.item}><Text style={styles.text}>${conteudo} 2</Text></View>\n`;
        code += `  <View style={styles.item}><Text style={styles.text}>${conteudo} 3</Text></View>\n`;
        code += `</View>`;

    } else if (currentTab === 'input') {
        const placeholder = document.getElementById('input-placeholder').value || 'Digite algo...';
        const padding = document.getElementById('input-padding').value || '12px';
        const radius = document.getElementById('input-radius').value || '8px';

        const styles = {
            padding: parseInt(padding),
            borderRadius: parseInt(radius),
            borderWidth: 1,
            borderColor: '#d4d4d4'
        };

        code = `import { TextInput } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  input: ${JSON.stringify(styles, null, 4).replace(/"/g, "'")}\n`;
        code += `});\n\n`;
        code += `<TextInput\n`;
        code += `  placeholder="${placeholder}"\n`;
        code += `  style={styles.input}\n`;
        code += `/>`;

    } else if (currentTab === 'tipografia') {
        const conteudo = document.getElementById('tipo-conteudo').value || 'Texto';
        const tamanho = document.getElementById('tipo-tamanho').value || 'base';
        const fontSize = parseInt(sizeMap[tamanho]);

        code = `import { Text } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  text: { fontSize: ${fontSize} }\n`;
        code += `});\n\n`;
        code += `<Text style={styles.text}>${conteudo}</Text>`;
    }

    return code;
}

function convertToFlutter() {
    let code = '';

    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || 'Botão';
        const cor = document.getElementById('botao-cor').value || '#000000';
        const bg = document.getElementById('botao-bg').value || '#ffffff';
        const padding = document.getElementById('botao-padding').value || '12px';
        const radius = document.getElementById('botao-radius').value || '8px';

        code = `ElevatedButton(\n`;
        code += `  onPressed: () {},\n`;
        code += `  style: ElevatedButton.styleFrom(\n`;
        code += `    backgroundColor: Color(0xFF${bg.replace('#', '')}),\n`;
        code += `    padding: EdgeInsets.all(${parseInt(padding)}),\n`;
        code += `    shape: RoundedRectangleBorder(\n`;
        code += `      borderRadius: BorderRadius.circular(${parseInt(radius)}),\n`;
        code += `    ),\n`;
        code += `  ),\n`;
        code += `  child: Text(\n`;
        code += `    '${conteudo}',\n`;
        code += `    style: TextStyle(color: Color(0xFF${cor.replace('#', '')})),\n`;
        code += `  ),\n`;
        code += `)`;

    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || 'Item';
        const cor = document.getElementById('lista-cor').value || '#000000';
        const bg = document.getElementById('lista-bg').value || '#ffffff';
        const padding = document.getElementById('lista-padding').value || '12px';
        const radius = document.getElementById('lista-radius').value || '8px';

        code = `Column(\n`;
        code += `  children: [\n`;
        for (let i = 1; i <= 3; i++) {
            code += `    Container(\n`;
            code += `      padding: EdgeInsets.all(${parseInt(padding)}),\n`;
            code += `      decoration: BoxDecoration(\n`;
            code += `        color: Color(0xFF${bg.replace('#', '')}),\n`;
            code += `        borderRadius: BorderRadius.circular(${parseInt(radius)}),\n`;
            code += `      ),\n`;
            code += `      child: Text('${conteudo} ${i}', style: TextStyle(color: Color(0xFF${cor.replace('#', '')}))),\n`;
            code += `    ),\n`;
        }
        code += `  ],\n`;
        code += `)`;

    } else if (currentTab === 'input') {
        const placeholder = document.getElementById('input-placeholder').value || 'Digite algo...';
        const padding = document.getElementById('input-padding').value || '12px';
        const radius = document.getElementById('input-radius').value || '8px';

        code = `TextField(\n`;
        code += `  decoration: InputDecoration(\n`;
        code += `    hintText: '${placeholder}',\n`;
        code += `    contentPadding: EdgeInsets.all(${parseInt(padding)}),\n`;
        code += `    border: OutlineInputBorder(\n`;
        code += `      borderRadius: BorderRadius.circular(${parseInt(radius)}),\n`;
        code += `    ),\n`;
        code += `  ),\n`;
        code += `)`;

    } else if (currentTab === 'tipografia') {
        const conteudo = document.getElementById('tipo-conteudo').value || 'Texto';
        const tamanho = document.getElementById('tipo-tamanho').value || 'base';
        const fontSize = parseInt(sizeMap[tamanho]);

        code = `Text(\n`;
        code += `  '${conteudo}',\n`;
        code += `  style: TextStyle(fontSize: ${fontSize}),\n`;
        code += `)`;
    }

    return code;
}

function convertToPrompt() {
    let prompt = '';

    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || 'Botão';
        const cor = document.getElementById('botao-cor').value || '#000000';
        const bg = document.getElementById('botao-bg').value || '#ffffff';
        const padding = document.getElementById('botao-padding').value || '12px';
        const borda = document.getElementById('botao-borda').value || 'none';
        const radius = document.getElementById('botao-radius').value || '8px';

        prompt = `Crie um componente de botão com as seguintes especificações:\n\n`;
        prompt += `**Conteúdo:** "${conteudo}"\n\n`;
        prompt += `**Estilos:**\n`;
        prompt += `- Cor do texto: ${cor}\n`;
        prompt += `- Background: ${bg}\n`;
        prompt += `- Padding: ${padding}\n`;
        prompt += `- Borda: ${borda}\n`;
        prompt += `- Border radius: ${radius}\n`;

    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || 'Item';
        const cor = document.getElementById('lista-cor').value || '#000000';
        const bg = document.getElementById('lista-bg').value || '#ffffff';
        const padding = document.getElementById('lista-padding').value || '12px';
        const borda = document.getElementById('lista-borda').value || 'none';
        const radius = document.getElementById('lista-radius').value || '8px';

        prompt = `Crie um componente de lista com as seguintes especificações:\n\n`;
        prompt += `**Conteúdo dos itens:** "${conteudo}"\n\n`;
        prompt += `**Estilos dos itens:**\n`;
        prompt += `- Cor do texto: ${cor}\n`;
        prompt += `- Background: ${bg}\n`;
        prompt += `- Padding: ${padding}\n`;
        prompt += `- Borda: ${borda}\n`;
        prompt += `- Border radius: ${radius}\n`;

    } else if (currentTab === 'input') {
        const placeholder = document.getElementById('input-placeholder').value || 'Digite algo...';
        const padding = document.getElementById('input-padding').value || '12px';
        const borda = document.getElementById('input-borda').value || '1px solid #d4d4d4';
        const radius = document.getElementById('input-radius').value || '8px';

        prompt = `Crie um componente de input com as seguintes especificações:\n\n`;
        prompt += `**Placeholder:** "${placeholder}"\n\n`;
        prompt += `**Estilos:**\n`;
        prompt += `- Padding: ${padding}\n`;
        prompt += `- Borda: ${borda}\n`;
        prompt += `- Border radius: ${radius}\n`;

    } else if (currentTab === 'tipografia') {
        const conteudo = document.getElementById('tipo-conteudo').value || 'Texto';
        const tamanho = document.getElementById('tipo-tamanho').value || 'base';
        const fontSize = sizeMap[tamanho] || '16px';

        prompt = `Crie um elemento de texto com as seguintes especificações:\n\n`;
        prompt += `**Conteúdo:** "${conteudo}"\n\n`;
        prompt += `**Estilos:**\n`;
        prompt += `- Tamanho (${tamanho}): ${fontSize}\n`;
    }

    return prompt;
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
document.getElementById('tab-botao').addEventListener('click', () => switchTab('botao'));
document.getElementById('tab-lista').addEventListener('click', () => switchTab('lista'));
document.getElementById('tab-input').addEventListener('click', () => switchTab('input'));
document.getElementById('tab-tipografia').addEventListener('click', () => switchTab('tipografia'));

// Conversão
if (convertBtn) {
    convertBtn.addEventListener('click', () => {
        try {
            const tech = techSelect.value;
            let result = '';

            switch(tech) {
                case 'prompt':
                    result = convertToPrompt();
                    break;
                case 'tailwind':
                    result = convertToTailwind();
                    break;
                case 'react-native':
                    result = convertToReactNative();
                    break;
                case 'flutter':
                    result = convertToFlutter();
                    break;
                default:
                    result = '// Tecnologia não suportada';
            }

            resultadoEl.textContent = result;
        } catch (error) {
            console.error('Erro na conversão:', error);
            showToast('Erro ao converter código', true);
            resultadoEl.textContent = `// Erro: ${error.message}`;
        }
    });
}

// Clipboard moderno
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        try {
        const textoParaCopiar = resultadoEl.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textoParaCopiar);
            showToast('Copiado com sucesso!');
        } else {
            // Fallback para navegadores antigos
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
}

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
document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', updateVisualPreview);
});

// ===== DROPDOWN DE MODOS =====

const modeDropdownBtn = document.getElementById('mode-dropdown-btn');
const modeDropdown = document.getElementById('mode-dropdown');
const modeText = document.getElementById('mode-text');
const chevronIcon = document.getElementById('chevron-icon');

// Toggle dropdown
if (modeDropdownBtn && modeDropdown && chevronIcon) {
    modeDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modeDropdown.classList.toggle('hidden');
        chevronIcon.style.transform = modeDropdown.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!modeDropdown.contains(e.target) && e.target !== modeDropdownBtn) {
            modeDropdown.classList.add('hidden');
            chevronIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Selecionar modo
    document.querySelectorAll('.mode-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;

            if (mode === 'dev') {
                if (modeText) modeText.textContent = 'Dev mode';
                window.location.href = 'index.html';
            } else if (mode === 'design') {
                if (modeText) modeText.textContent = 'Design mode';
                // Já estamos na página correta
            } else if (mode === 'tokens') {
                if (modeText) modeText.textContent = 'Tokens';
                window.location.href = 'tokens.html';
            }

            modeDropdown.classList.add('hidden');
            chevronIcon.style.transform = 'rotate(0deg)';
        });
    });
}

// ===== SISTEMA DE ELEMENTOS DINÂMICOS =====

let botaoElementosCount = 0;
let listaElementosCount = 0;

// Adicionar Texto ao Botão
document.getElementById('add-botao-text-btn').addEventListener('click', () => {
    botaoElementosCount++;
    const id = `botao-text-${botaoElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-1';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Texto</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">×</button>
        </div>
        <input type="text" id="${id}-content" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Conteúdo" oninput="updateVisualPreview()">
        <input type="text" id="${id}-color" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Cor (ex: #000)" oninput="updateVisualPreview()">
    `;
    document.getElementById('botao-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Ícone ao Botão
document.getElementById('add-botao-icon-btn').addEventListener('click', () => {
    botaoElementosCount++;
    const id = `botao-icon-${botaoElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-1';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Ícone</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">×</button>
        </div>
        <input type="text" id="${id}-name" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Nome (ex: ⭐)" oninput="updateVisualPreview()">
    `;
    document.getElementById('botao-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Texto à Lista
document.getElementById('add-lista-text-btn').addEventListener('click', () => {
    listaElementosCount++;
    const id = `lista-text-${listaElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-1';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Texto</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">×</button>
        </div>
        <input type="text" id="${id}-content" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Conteúdo" oninput="updateVisualPreview()">
        <input type="text" id="${id}-color" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Cor (ex: #000)" oninput="updateVisualPreview()">
    `;
    document.getElementById('lista-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Ícone à Lista
document.getElementById('add-lista-icon-btn').addEventListener('click', () => {
    listaElementosCount++;
    const id = `lista-icon-${listaElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-1';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Ícone</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">×</button>
        </div>
        <input type="text" id="${id}-name" class="w-full p-1 text-white rounded text-xs" style="background-color: #262624; border: 1px solid #3a3a38;" placeholder="Nome (ex: ⭐)" oninput="updateVisualPreview()">
    `;
    document.getElementById('lista-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Inicializa preview
updateVisualPreview();
