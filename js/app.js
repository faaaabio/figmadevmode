// Elementos do DOM
const layoutInput = document.getElementById('layout-input');
const styleInput = document.getElementById('style-input');
const techSelect = document.getElementById('tech-select');
const convertBtn = document.getElementById('convert-btn');
const resultadoEl = document.querySelector('#resultado code');
const copyBtn = document.getElementById('copy-btn');
const toastEl = document.getElementById('toast');
const visualPreview = document.getElementById('visual-preview');

let lucideIconNames = [];
let iconCache = new Map();
let currentTab = 'botao';

// ===== UTILITÁRIOS DE PARSING =====

// Parse CSS para objeto
function parseCSS(cssText) {
    const styles = {};
    const lines = cssText.split(/;|\n/).filter(line => line.trim());

    for (const line of lines) {
        const [prop, ...valueParts] = line.split(':');
        if (prop && valueParts.length > 0) {
            const property = prop.trim();
            const value = valueParts.join(':').trim();
            styles[property] = value;
        }
    }
    return styles;
}

// Resolve variáveis CSS para valores (mantém tokens)
function resolveCSSVariables(value, keepTokens = false) {
    const varRegex = /var\(([^,)]+)(?:,\s*([^)]+))?\)/g;
    if (keepTokens) {
        return value.replace(varRegex, (match, varName) => {
            return varName.trim().replace('--', '');
        });
    }
    return value.replace(varRegex, (match, varName, fallback) => {
        return fallback ? fallback.trim() : varName.trim();
    });
}

// Converte unidade px para número
function pxToNumber(value) {
    if (typeof value === 'number') return value;
    const match = value.match(/^(-?\d+(?:\.\d+)?)px$/);
    return match ? parseFloat(match[1]) : value;
}

// ===== PREVIEW VISUAL =====

async function updateVisualPreview() {
    if (currentTab === 'botao') {
        const layout = parseCSS(layoutInput.value);
        const style = parseCSS(styleInput.value);

        // Coleta elementos dinâmicos
        const elementos = [];
        document.querySelectorAll('#botao-elementos > div').forEach(el => {
            const id = el.querySelector('input, textarea')?.id || '';
            if (id.includes('-text-')) {
                const content = el.querySelector('input[id$="-content"]')?.value || 'Texto';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'text', content, style: parseCSS(styleText) });
            } else if (id.includes('-icon-')) {
                const name = el.querySelector('input[id$="-name"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'icon', name, style: parseCSS(styleText) });
            }
        });

        // Estilos padrão se não houver nada preenchido
        const defaultStyles = 'display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; background: #ffffff; color: #000000;';

        let styles = '';
        const allStyles = {...layout, ...style};
        if (Object.keys(allStyles).length > 0) {
            Object.entries(allStyles).forEach(([prop, value]) => {
                const val = resolveCSSVariables(value);
                styles += `${prop}: ${val}; `;
            });
        } else {
            styles = defaultStyles;
        }

        // Monta HTML dos elementos
        let elementosHtml = '';
        for (const el of elementos) {
            if (el.type === 'text') {
                let textStyles = '';
                Object.entries(el.style).forEach(([prop, value]) => {
                    textStyles += `${prop}: ${resolveCSSVariables(value)}; `;
                });
                elementosHtml += `<span style="${textStyles}">${el.content}</span>`;
            } else if (el.type === 'icon' && el.name) {
                if (lucideIconNames.includes(el.name)) {
                    if (!iconCache.has(el.name)) {
                        await loadIconToCache(el.name);
                    }
                    const iconSvg = iconCache.get(el.name) || '';
                    let iconStyles = 'display: flex; width: 20px; height: 20px;';
                    Object.entries(el.style).forEach(([prop, value]) => {
                        iconStyles += `${prop}: ${resolveCSSVariables(value)}; `;
                    });
                    elementosHtml += `<span style="${iconStyles}">${iconSvg}</span>`;
                }
            }
        }

        visualPreview.innerHTML = `
            <div style="${styles}">
                ${elementosHtml || '<span>Adicione elementos</span>'}
            </div>
        `;
    } else if (currentTab === 'lista') {
        const layout = parseCSS(document.getElementById('lista-layout').value);
        const itemStyle = parseCSS(document.getElementById('lista-item-style').value);

        // Coleta elementos dinâmicos da lista
        const elementos = [];
        document.querySelectorAll('#lista-elementos > div').forEach(el => {
            const id = el.querySelector('input, textarea')?.id || '';
            if (id.includes('-text-')) {
                const content = el.querySelector('input[id$="-content"]')?.value || 'Texto';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'text', content, style: parseCSS(styleText) });
            } else if (id.includes('-icon-')) {
                const name = el.querySelector('input[id$="-name"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'icon', name, style: parseCSS(styleText) });
            }
        });

        const defaultContainerStyles = 'display: flex; flex-direction: column; gap: 8px;';
        const defaultItemStyles = 'padding: 12px; border-radius: 8px; background: #ffffff;';

        let containerStyles = '';
        if (Object.keys(layout).length > 0) {
            Object.entries(layout).forEach(([prop, value]) => {
                const val = resolveCSSVariables(value);
                containerStyles += `${prop}: ${val}; `;
            });
        } else {
            containerStyles = defaultContainerStyles;
        }

        let itemStyles = '';
        if (Object.keys(itemStyle).length > 0) {
            Object.entries(itemStyle).forEach(([prop, value]) => {
                const val = resolveCSSVariables(value);
                itemStyles += `${prop}: ${val}; `;
            });
        } else {
            itemStyles = defaultItemStyles;
        }

        // Monta HTML dos elementos
        let elementosHtml = '';
        for (const el of elementos) {
            if (el.type === 'text') {
                let textStyles = '';
                Object.entries(el.style).forEach(([prop, value]) => {
                    textStyles += `${prop}: ${resolveCSSVariables(value)}; `;
                });
                elementosHtml += `<span style="${textStyles}">${el.content}</span>`;
            } else if (el.type === 'icon' && el.name) {
                if (lucideIconNames.includes(el.name)) {
                    if (!iconCache.has(el.name)) {
                        await loadIconToCache(el.name);
                    }
                    const iconSvg = iconCache.get(el.name) || '';
                    let iconStyles = 'display: flex; width: 20px; height: 20px;';
                    Object.entries(el.style).forEach(([prop, value]) => {
                        iconStyles += `${prop}: ${resolveCSSVariables(value)}; `;
                    });
                    elementosHtml += `<span style="${iconStyles}">${iconSvg}</span>`;
                }
            }
        }

        visualPreview.innerHTML = `
            <div style="${containerStyles}">
                <div style="${itemStyles}">${elementosHtml || 'Item 1'}</div>
                <div style="${itemStyles}">${elementosHtml || 'Item 2'}</div>
                <div style="${itemStyles}">${elementosHtml || 'Item 3'}</div>
            </div>
        `;
    } else if (currentTab === 'input') {
        const layout = parseCSS(document.getElementById('input-layout').value);
        const style = parseCSS(document.getElementById('input-style').value);
        const placeholder = document.getElementById('input-placeholder').value || 'Enter text...';

        const defaultStyles = 'display: flex; width: 100%; padding: 12px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff;';

        let styles = '';
        const allStyles = {...layout, ...style};
        if (Object.keys(allStyles).length > 0) {
            Object.entries(allStyles).forEach(([prop, value]) => {
                const val = resolveCSSVariables(value);
                styles += `${prop}: ${val}; `;
            });
        } else {
            styles = defaultStyles;
        }

        visualPreview.innerHTML = `
            <input type="text" placeholder="${placeholder}" style="${styles}" />
        `;
    } else if (currentTab === 'tipografia') {
        const texto = document.getElementById('text-content-typo').value || 'Texto de exemplo';
        const typo = parseCSS(document.getElementById('text-style').value);

        const defaultStyles = 'font-family: Inter, sans-serif; font-size: 16px; color: #ffffff;';

        let styles = '';
        if (Object.keys(typo).length > 0) {
            Object.entries(typo).forEach(([prop, value]) => {
                const val = resolveCSSVariables(value);
                styles += `${prop}: ${val}; `;
            });
        } else {
            styles = defaultStyles;
        }

        visualPreview.innerHTML = `
            <span style="${styles}">${texto}</span>
        `;
    }
}

// ===== CONVERSORES =====

// Conversor para Prompt IA
function convertToPrompt() {
    let prompt = '';

    if (currentTab === 'botao') {
        const layout = parseCSS(layoutInput.value);
        const style = parseCSS(styleInput.value);

        // Coleta elementos dinâmicos
        const elementos = [];
        document.querySelectorAll('#botao-elementos > div').forEach(el => {
            const id = el.querySelector('input, textarea')?.id || '';
            if (id.includes('-text-')) {
                const content = el.querySelector('input[id$="-content"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'text', content, style: styleText });
            } else if (id.includes('-icon-')) {
                const name = el.querySelector('input[id$="-name"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'icon', name, style: styleText });
            }
        });

        prompt = `Crie um componente de botão com as seguintes especificações:\n\n`;

        prompt += `**Layout:**\n`;
        Object.entries(layout).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });

        prompt += `\n**Estilos:**\n`;
        Object.entries(style).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });

        if (elementos.length > 0) {
            prompt += `\n**Elementos:**\n`;
            elementos.forEach((el, i) => {
                if (el.type === 'text') {
                    prompt += `\nTexto ${i + 1}: "${el.content}"\n`;
                    if (el.style) {
                        const styleObj = parseCSS(el.style);
                        Object.entries(styleObj).forEach(([prop, value]) => {
                            const tokenValue = resolveCSSVariables(value, true);
                            prompt += `- ${prop}: ${tokenValue}\n`;
                        });
                    }
                } else if (el.type === 'icon') {
                    prompt += `\nÍcone ${i + 1}: ${el.name}\n`;
                    if (el.style) {
                        const styleObj = parseCSS(el.style);
                        Object.entries(styleObj).forEach(([prop, value]) => {
                            const tokenValue = resolveCSSVariables(value, true);
                            prompt += `- ${prop}: ${tokenValue}\n`;
                        });
                    }
                }
            });
        }
    } else if (currentTab === 'lista') {
        const layout = parseCSS(document.getElementById('lista-layout').value);
        const itemStyle = parseCSS(document.getElementById('lista-item-style').value);

        // Coleta elementos dinâmicos
        const elementos = [];
        document.querySelectorAll('#lista-elementos > div').forEach(el => {
            const id = el.querySelector('input, textarea')?.id || '';
            if (id.includes('-text-')) {
                const content = el.querySelector('input[id$="-content"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'text', content, style: styleText });
            } else if (id.includes('-icon-')) {
                const name = el.querySelector('input[id$="-name"]')?.value || '';
                const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                elementos.push({ type: 'icon', name, style: styleText });
            }
        });

        prompt = `Crie um componente de lista com as seguintes especificações:\n\n`;
        prompt += `**Layout da Lista:**\n`;
        Object.entries(layout).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });
        prompt += `\n**Estilo dos Itens:**\n`;
        Object.entries(itemStyle).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });

        if (elementos.length > 0) {
            prompt += `\n**Elementos do Item:**\n`;
            elementos.forEach((el, i) => {
                if (el.type === 'text') {
                    prompt += `\nTexto ${i + 1}: "${el.content}"\n`;
                    if (el.style) {
                        const styleObj = parseCSS(el.style);
                        Object.entries(styleObj).forEach(([prop, value]) => {
                            const tokenValue = resolveCSSVariables(value, true);
                            prompt += `- ${prop}: ${tokenValue}\n`;
                        });
                    }
                } else if (el.type === 'icon') {
                    prompt += `\nÍcone ${i + 1}: ${el.name}\n`;
                    if (el.style) {
                        const styleObj = parseCSS(el.style);
                        Object.entries(styleObj).forEach(([prop, value]) => {
                            const tokenValue = resolveCSSVariables(value, true);
                            prompt += `- ${prop}: ${tokenValue}\n`;
                        });
                    }
                }
            });
        }
    } else if (currentTab === 'input') {
        const layout = parseCSS(document.getElementById('input-layout').value);
        const style = parseCSS(document.getElementById('input-style').value);
        const placeholder = document.getElementById('input-placeholder').value;

        prompt = `Crie um componente de input com as seguintes especificações:\n\n`;
        prompt += `**Placeholder:** "${placeholder}"\n`;
        prompt += `\n**Layout:**\n`;
        Object.entries(layout).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });
        prompt += `\n**Estilos:**\n`;
        Object.entries(style).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });
    } else if (currentTab === 'tipografia') {
        const texto = document.getElementById('text-content-typo').value;
        const typo = parseCSS(document.getElementById('text-style').value);

        prompt = `Crie um elemento de texto com as seguintes especificações:\n\n`;
        prompt += `**Conteúdo:** "${texto}"\n`;
        prompt += `\n**Tipografia:**\n`;
        Object.entries(typo).forEach(([prop, value]) => {
            const tokenValue = resolveCSSVariables(value, true);
            prompt += `- ${prop}: ${tokenValue}\n`;
        });
    }

    prompt += `\n---\n\nUtilize os tokens de design fornecidos. Não use valores hexadecimais diretos, apenas os nomes dos tokens.`;

    return prompt;
}

// Conversor para Tailwind CSS
function convertToTailwind(layout, style, tab, allInputs) {
    const layoutStyles = parseCSS(layout);
    const styleStyles = parseCSS(style);

    const allStyles = { ...layoutStyles, ...styleStyles };
    const classes = [];

    // Display & Flex
    if (allStyles.display === 'flex') {
        classes.push('flex');

        // Flex Direction
        if (allStyles['flex-direction'] === 'column') classes.push('flex-col');
        else if (allStyles['flex-direction'] === 'row') classes.push('flex-row');

        // Justify Content
        const justifyMap = {
            'center': 'justify-center',
            'flex-start': 'justify-start',
            'flex-end': 'justify-end',
            'space-between': 'justify-between',
            'space-around': 'justify-around',
        };
        if (allStyles['justify-content']) {
            classes.push(justifyMap[allStyles['justify-content']] || '');
        }

        // Align Items
        const alignMap = {
            'center': 'items-center',
            'flex-start': 'items-start',
            'flex-end': 'items-end',
            'stretch': 'items-stretch',
        };
        if (allStyles['align-items']) {
            classes.push(alignMap[allStyles['align-items']] || '');
        }

        // Gap
        if (allStyles.gap) {
            const gapValue = pxToNumber(allStyles.gap);
            const gapClass = gapValue / 4;
            classes.push(`gap-${gapClass}`);
        }
    }

    // Padding
    if (allStyles.padding) {
        const padValue = pxToNumber(allStyles.padding);
        const padClass = padValue / 4;
        classes.push(`p-${padClass}`);
    }

    // Border Radius
    if (allStyles['border-radius']) {
        const radiusValue = resolveCSSVariables(allStyles['border-radius']);
        const radius = pxToNumber(radiusValue);
        if (radius === 9999 || radius > 100) classes.push('rounded-full');
        else {
            const radiusClass = radius / 4;
            classes.push(`rounded-${radiusClass > 0 ? radiusClass : 'none'}`);
        }
    }

    // Border
    if (allStyles.border) {
        const borderValue = resolveCSSVariables(allStyles.border);
        classes.push('border');
        // Extrai cor se houver
        const colorMatch = borderValue.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
        if (colorMatch) {
            classes.push(`border-[${colorMatch[0]}]`);
        }
    }

    // Background Color
    if (allStyles['background-color']) {
        const bgColor = resolveCSSVariables(allStyles['background-color']);
        classes.push(`bg-[${bgColor}]`);
    }

    // Width & Height
    if (allStyles.width) {
        const w = resolveCSSVariables(allStyles.width);
        classes.push(`w-[${w}]`);
    }
    if (allStyles.height) {
        const h = resolveCSSVariables(allStyles.height);
        classes.push(`h-[${h}]`);
    }

    const containerClasses = classes.filter(c => c).join(' ');

    // Gera código do componente
    let code = `// Componente Tailwind CSS (${tab})\n`;

    if (tab === 'botao' || tab === 'lista') {
        const tag = tab === 'botao' ? 'button' : 'ul';
        const itemTag = tab === 'lista' ? 'li' : '';

        code += `<${tag} className="${containerClasses}">\n`;

        if (allInputs.elementos && allInputs.elementos.length > 0) {
            allInputs.elementos.forEach(el => {
                if (el.type === 'text') {
                    code += `  <span>${el.content || 'Texto'}</span>\n`;
                } else if (el.type === 'icon' && el.name) {
                    code += `  <Icon name="${el.name}" />\n`;
                }
            });
        } else {
            code += `  <span>${tab === 'botao' ? 'Button' : 'Item'}</span>\n`;
        }

        code += `</${tag}>`;

        if (tab === 'lista') {
            code = code.replace('<ul', '<ul>\n  <li').replace('</ul>', '</li>\n  <li>...</li>\n</ul>');
        }
    } else if (tab === 'input') {
        code += `<input\n`;
        code += `  type="text"\n`;
        code += `  placeholder="${allInputs.placeholder || 'Enter text...'}"\n`;
        code += `  className="${containerClasses}"\n`;
        code += `/>`;
    } else if (tab === 'tipografia') {
        code += `<span className="${containerClasses}">${allInputs.text || 'Texto'}</span>`;
    } else {
        code += `<div className="${containerClasses}">Conteúdo</div>`;
    }

    return code;
}

// Conversor para React Native
function convertToReactNative(layout, style, tab, allInputs) {
    const layoutStyles = parseCSS(layout);
    const styleStyles = parseCSS(style);

    const allStyles = { ...layoutStyles, ...styleStyles };
    const rnStyles = {};

    // Display Flex (padrão no RN)
    if (allStyles.display === 'flex' || !allStyles.display) {
        if (allStyles['flex-direction']) {
            rnStyles.flexDirection = allStyles['flex-direction'];
        }
        if (allStyles['justify-content']) {
            rnStyles.justifyContent = allStyles['justify-content'];
        }
        if (allStyles['align-items']) {
            rnStyles.alignItems = allStyles['align-items'];
        }
        if (allStyles.gap) {
            rnStyles.gap = pxToNumber(allStyles.gap);
        }
    }

    // Padding
    if (allStyles.padding) {
        rnStyles.padding = pxToNumber(allStyles.padding);
    }

    // Border
    if (allStyles['border-radius']) {
        const radiusValue = resolveCSSVariables(allStyles['border-radius']);
        rnStyles.borderRadius = pxToNumber(radiusValue);
    }
    if (allStyles.border) {
        const borderValue = resolveCSSVariables(allStyles.border);
        const widthMatch = borderValue.match(/(\d+)px/);
        if (widthMatch) {
            rnStyles.borderWidth = parseInt(widthMatch[1]);
        }
        const colorMatch = borderValue.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
        if (colorMatch) {
            rnStyles.borderColor = colorMatch[0];
        }
    }

    // Background
    if (allStyles['background-color']) {
        const bgColor = resolveCSSVariables(allStyles['background-color']);
        rnStyles.backgroundColor = bgColor;
    }

    // Width & Height
    if (allStyles.width) {
        const w = resolveCSSVariables(allStyles.width);
        rnStyles.width = pxToNumber(w);
    }
    if (allStyles.height) {
        const h = resolveCSSVariables(allStyles.height);
        rnStyles.height = pxToNumber(h);
    }

    // Gera código
    let code = `// Componente React Native (${tab})\n`;

    if (tab === 'botao' || tab === 'lista') {
        const comp = tab === 'botao' ? 'TouchableOpacity' : 'View';
        const imports = tab === 'botao' ?
            `import { TouchableOpacity, Text } from 'react-native';\n` :
            `import { View, Text } from 'react-native';\n`;

        code += imports;

        // Adiciona imports de ícones
        if (allInputs.elementos) {
            const iconImports = allInputs.elementos
                .filter(el => el.type === 'icon' && el.name)
                .map(el => toPascalCase(el.name));
            if (iconImports.length > 0) {
                code += `import { ${iconImports.join(', ')} } from 'lucide-react-native';\n`;
            }
        }

        code += `\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  container: ${JSON.stringify(rnStyles, null, 4).replace(/"/g, "'")},\n`;
        code += `});\n\n`;
        code += `<${comp} style={styles.container}>\n`;

        if (allInputs.elementos && allInputs.elementos.length > 0) {
            allInputs.elementos.forEach(el => {
                if (el.type === 'text') {
                    code += `  <Text>${el.content || 'Texto'}</Text>\n`;
                } else if (el.type === 'icon' && el.name) {
                    code += `  <${toPascalCase(el.name)} />\n`;
                }
            });
        } else {
            code += `  <Text>${tab === 'botao' ? 'Button' : 'Item'}</Text>\n`;
        }

        code += `</${comp}>`;
    } else if (tab === 'input') {
        code += `import { TextInput } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  input: ${JSON.stringify(rnStyles, null, 4).replace(/"/g, "'")},\n`;
        code += `});\n\n`;
        code += `<TextInput\n`;
        code += `  placeholder="${allInputs.placeholder || 'Enter text...'}"\n`;
        code += `  style={styles.input}\n`;
        code += `/>`;
    } else if (tab === 'tipografia') {
        code += `import { Text } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  text: ${JSON.stringify(rnStyles, null, 4).replace(/"/g, "'")},\n`;
        code += `});\n\n`;
        code += `<Text style={styles.text}>${allInputs.text || 'Texto'}</Text>`;
    } else {
        code += `import { View } from 'react-native';\n\n`;
        code += `const styles = StyleSheet.create({\n`;
        code += `  container: ${JSON.stringify(rnStyles, null, 4).replace(/"/g, "'")},\n`;
        code += `});\n\n`;
        code += `<View style={styles.container}></View>`;
    }

    return code;
}

// Conversor para Flutter
function convertToFlutter(layout, style, tab, allInputs) {
    const layoutStyles = parseCSS(layout);
    const styleStyles = parseCSS(style);

    const allStyles = { ...layoutStyles, ...styleStyles };

    let code = `// Widget Flutter (${tab})\n`;

    // Container com decoração
    const hasDecoration = allStyles['border-radius'] || allStyles.border || allStyles['background-color'];

    if (hasDecoration) {
        code += `Container(\n`;

        // Padding
        if (allStyles.padding) {
            const pad = pxToNumber(allStyles.padding);
            code += `  padding: EdgeInsets.all(${pad}),\n`;
        }

        // Width & Height
        if (allStyles.width) {
            const w = pxToNumber(resolveCSSVariables(allStyles.width));
            code += `  width: ${w},\n`;
        }
        if (allStyles.height) {
            const h = pxToNumber(resolveCSSVariables(allStyles.height));
            code += `  height: ${h},\n`;
        }

        // Decoration
        code += `  decoration: BoxDecoration(\n`;

        if (allStyles['background-color']) {
            const bgColor = resolveCSSVariables(allStyles['background-color']);
            code += `    color: Color(0xFF${bgColor.replace('#', '')}),\n`;
        }

        if (allStyles['border-radius']) {
            const radius = pxToNumber(resolveCSSVariables(allStyles['border-radius']));
            code += `    borderRadius: BorderRadius.circular(${radius}),\n`;
        }

        if (allStyles.border) {
            const borderValue = resolveCSSVariables(allStyles.border);
            const widthMatch = borderValue.match(/(\d+)px/);
            const colorMatch = borderValue.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
            const width = widthMatch ? widthMatch[1] : '1';
            const color = colorMatch ? colorMatch[0].replace('#', '') : 'D4D4D4';
            code += `    border: Border.all(\n`;
            code += `      color: Color(0xFF${color}),\n`;
            code += `      width: ${width},\n`;
            code += `    ),\n`;
        }

        code += `  ),\n`;
    }

    // Child baseado na aba
    if (tab === 'botao' || tab === 'lista') {
        const widget = tab === 'botao' ? 'ElevatedButton' : 'Column';

        if (tab === 'botao') {
            code += `  child: ${widget}(\n`;
            code += `    onPressed: () {},\n`;
        } else {
            code += `  child: ${widget}(\n`;
        }

        if (allInputs.elementos && allInputs.elementos.length > 0) {
            code += `    child: Row(\n`;
            code += `      children: [\n`;
            allInputs.elementos.forEach(el => {
                if (el.type === 'text') {
                    code += `        Text('${el.content || 'Texto'}'),\n`;
                } else if (el.type === 'icon' && el.name) {
                    code += `        Icon(Icons.${el.name.replace(/-/g, '_')}),\n`;
                }
            });
            code += `      ],\n`;
            code += `    ),\n`;
        } else {
            code += `    child: Text('${tab === 'botao' ? 'Button' : 'Item'}'),\n`;
        }

        code += `  ),\n`;
    } else if (tab === 'input') {
        code += `  child: TextField(\n`;
        code += `    decoration: InputDecoration(\n`;
        code += `      hintText: '${allInputs.placeholder || 'Enter text...'}',\n`;
        code += `    ),\n`;
        code += `  ),\n`;
    } else if (tab === 'tipografia') {
        code += `  child: Text('${allInputs.text || 'Texto'}'),\n`;
    } else {
        // Child (Row/Column para flex)
        if (allStyles.display === 'flex') {
            const isColumn = allStyles['flex-direction'] === 'column';
            const widget = isColumn ? 'Column' : 'Row';

            code += `  child: ${widget}(\n`;

            // MainAxisAlignment (justify-content)
            if (allStyles['justify-content']) {
                const justifyMap = {
                    'center': 'MainAxisAlignment.center',
                    'flex-start': 'MainAxisAlignment.start',
                    'flex-end': 'MainAxisAlignment.end',
                    'space-between': 'MainAxisAlignment.spaceBetween',
                    'space-around': 'MainAxisAlignment.spaceAround',
                };
                code += `    mainAxisAlignment: ${justifyMap[allStyles['justify-content']] || 'MainAxisAlignment.start'},\n`;
            }

            // CrossAxisAlignment (align-items)
            if (allStyles['align-items']) {
                const alignMap = {
                    'center': 'CrossAxisAlignment.center',
                    'flex-start': 'CrossAxisAlignment.start',
                    'flex-end': 'CrossAxisAlignment.end',
                    'stretch': 'CrossAxisAlignment.stretch',
                };
                code += `    crossAxisAlignment: ${alignMap[allStyles['align-items']] || 'CrossAxisAlignment.start'},\n`;
            }

            code += `    children: [],\n`;
            code += `  ),\n`;
        }
    }

    code += `)`;

    return code;
}

// Converte kebab-case para PascalCase
function toPascalCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// ===== BUSCA E CACHE DE ÍCONES =====

async function fetchLucideIcons() {
    try {
        const response = await fetch('https://unpkg.com/lucide-static@latest/tags.json');
        if (!response.ok) throw new Error('Falha ao buscar lista de ícones');
        const data = await response.json();
        lucideIconNames = Object.keys(data);
        console.log(`${lucideIconNames.length} ícones carregados com sucesso`);
    } catch (error) {
        console.error('Erro ao buscar ícones:', error);
        showToast('Erro ao carregar ícones', true);
    }
}

async function loadIconToCache(name) {
    if (!name || iconCache.has(name)) return;

    try {
        const response = await fetch(`https://unpkg.com/lucide-static/icons/${name}.svg`);
        if (!response.ok) return;
        let svgText = await response.text();
        svgText = svgText.replace('<svg', '<svg width="100%" height="100%" stroke="currentColor"');
        iconCache.set(name, svgText);
    } catch (error) {
        console.error('Erro ao buscar ícone:', error);
    }
}

// ===== SISTEMA DE ABAS =====
function switchTab(tabName) {
    // Atualiza currentTab
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

        if (tech === 'prompt') {
            result = convertToPrompt();
        } else {
            let inputs = {};

            // Pega os dados conforme a aba ativa
            if (currentTab === 'botao' || currentTab === 'lista') {
                // Coleta elementos dinâmicos
                const containerId = currentTab === 'botao' ? 'botao-elementos' : 'lista-elementos';
                const elementos = [];
                document.querySelectorAll(`#${containerId} > div`).forEach(el => {
                    const id = el.querySelector('input, textarea')?.id || '';
                    if (id.includes('-text-')) {
                        const content = el.querySelector('input[id$="-content"]')?.value || '';
                        const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                        elementos.push({ type: 'text', content, style: styleText });
                    } else if (id.includes('-icon-')) {
                        const name = el.querySelector('input[id$="-name"]')?.value || '';
                        const styleText = el.querySelector('textarea[id$="-style"]')?.value || '';
                        elementos.push({ type: 'icon', name, style: styleText });
                    }
                });

                inputs = {
                    layout: currentTab === 'botao' ? layoutInput.value : document.getElementById('lista-layout').value,
                    style: currentTab === 'botao' ? styleInput.value : document.getElementById('lista-item-style').value,
                    elementos: elementos
                };
            } else if (currentTab === 'input') {
                inputs = {
                    layout: document.getElementById('input-layout').value,
                    style: document.getElementById('input-style').value,
                    placeholder: document.getElementById('input-placeholder').value
                };
            } else if (currentTab === 'tipografia') {
                inputs = {
                    text: document.getElementById('text-content-typo').value,
                    textStyle: document.getElementById('text-style').value
                };
            }

            switch(tech) {
                case 'tailwind':
                    result = convertToTailwind(inputs.layout || '', inputs.style || '', currentTab, inputs);
                    break;
                case 'react-native':
                    result = convertToReactNative(inputs.layout || '', inputs.style || '', currentTab, inputs);
                    break;
                case 'flutter':
                    result = convertToFlutter(inputs.layout || '', inputs.style || '', currentTab, inputs);
                    break;
                default:
                    result = '// Tecnologia não suportada';
            }
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

// Toast melhorado
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

// ===== EVENT LISTENERS PARA PREVIEW EM TEMPO REAL =====

// Botão
layoutInput.addEventListener('input', updateVisualPreview);
styleInput.addEventListener('input', updateVisualPreview);

// Lista
document.getElementById('lista-layout').addEventListener('input', updateVisualPreview);
document.getElementById('lista-item-style').addEventListener('input', updateVisualPreview);

// Input
document.getElementById('input-layout').addEventListener('input', updateVisualPreview);
document.getElementById('input-style').addEventListener('input', updateVisualPreview);
document.getElementById('input-placeholder').addEventListener('input', updateVisualPreview);

// Tipografia
document.getElementById('text-content-typo').addEventListener('input', updateVisualPreview);
document.getElementById('text-style').addEventListener('input', updateVisualPreview);

// ===== SISTEMA DE ELEMENTOS DINÂMICOS =====

let botaoElementosCount = 0;
let listaElementosCount = 0;

// Adicionar Texto ao Botão
document.getElementById('add-text-btn').addEventListener('click', () => {
    botaoElementosCount++;
    const id = `botao-text-${botaoElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-2';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Texto</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">Remover</button>
        </div>
        <input type="text" id="${id}-content" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="CONTEÚDO" oninput="updateVisualPreview()">
        <textarea id="${id}-style" rows="2" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="TIPOGRAFIA" oninput="updateVisualPreview()"></textarea>
    `;
    document.getElementById('botao-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Ícone ao Botão
document.getElementById('add-icon-btn').addEventListener('click', () => {
    botaoElementosCount++;
    const id = `botao-icon-${botaoElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-2';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Ícone</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">Remover</button>
        </div>
        <input type="text" id="${id}-name" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="NOME DO ÍCONE" oninput="updateVisualPreview()">
        <textarea id="${id}-style" rows="2" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="ESTILO" oninput="updateVisualPreview()"></textarea>
    `;
    document.getElementById('botao-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Texto à Lista
document.getElementById('add-lista-text-btn').addEventListener('click', () => {
    listaElementosCount++;
    const id = `lista-text-${listaElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-2';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Texto</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">Remover</button>
        </div>
        <input type="text" id="${id}-content" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="CONTEÚDO" oninput="updateVisualPreview()">
        <textarea id="${id}-style" rows="2" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="TIPOGRAFIA" oninput="updateVisualPreview()"></textarea>
    `;
    document.getElementById('lista-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Adicionar Ícone à Lista
document.getElementById('add-lista-icon-btn').addEventListener('click', () => {
    listaElementosCount++;
    const id = `lista-icon-${listaElementosCount}`;
    const elemento = document.createElement('div');
    elemento.className = 'rounded p-2 space-y-2';
    elemento.style.border = '1px solid #3a3a38';
    elemento.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Ícone</span>
            <button onclick="this.parentElement.parentElement.remove(); updateVisualPreview();" class="text-xs text-red-400 hover:text-red-300">Remover</button>
        </div>
        <input type="text" id="${id}-name" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="NOME DO ÍCONE" oninput="updateVisualPreview()">
        <textarea id="${id}-style" rows="2" class="w-full p-2 text-white rounded text-xs" style="background-color: #1a1a18; border: 1px solid #3a3a38;" placeholder="ESTILO" oninput="updateVisualPreview()"></textarea>
    `;
    document.getElementById('lista-elementos').appendChild(elemento);
    updateVisualPreview();
});

// Inicialização
fetchLucideIcons();
updateVisualPreview();
