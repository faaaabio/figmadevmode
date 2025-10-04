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

// Função para definir valor através das tags
function setTagValue(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = value;
        updateVisualPreview();
    }
}

// ===== PREVIEW VISUAL =====

function updateVisualPreview() {
    if (currentTab === 'botao') {
        const conteudo = document.getElementById('botao-conteudo').value || 'Botão';
        const cor = document.getElementById('botao-cor').value || '#000000';
        const bg = document.getElementById('botao-bg').value || '#ffffff';
        const padding = document.getElementById('botao-padding').value || '12px';
        const borda = document.getElementById('botao-borda').value || 'none';
        const radius = document.getElementById('botao-radius').value || '8px';

        visualPreview.innerHTML = `
            <button style="color: ${cor}; background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius}; cursor: pointer;">
                ${conteudo}
            </button>
        `;
    } else if (currentTab === 'lista') {
        const conteudo = document.getElementById('lista-conteudo').value || 'Item';
        const cor = document.getElementById('lista-cor').value || '#000000';
        const bg = document.getElementById('lista-bg').value || '#ffffff';
        const padding = document.getElementById('lista-padding').value || '12px';
        const borda = document.getElementById('lista-borda').value || 'none';
        const radius = document.getElementById('lista-radius').value || '8px';

        visualPreview.innerHTML = `
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <li style="color: ${cor}; background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${conteudo} 1</li>
                <li style="color: ${cor}; background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${conteudo} 2</li>
                <li style="color: ${cor}; background: ${bg}; padding: ${padding}; border: ${borda}; border-radius: ${radius};">${conteudo} 3</li>
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
        const tamanho = document.getElementById('tipo-tamanho').value || 'base';
        const fontSize = sizeMap[tamanho] || '16px';

        visualPreview.innerHTML = `
            <span style="font-size: ${fontSize}; color: #ffffff;">${conteudo}</span>
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
convertBtn.addEventListener('click', () => {
    try {
        const tech = techSelect.value;
        let result = '';

        switch(tech) {
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

// Clipboard moderno
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

// Inicializa preview
updateVisualPreview();
