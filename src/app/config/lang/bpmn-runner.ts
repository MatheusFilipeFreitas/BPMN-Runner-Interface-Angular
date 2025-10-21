import { Theme } from "../../services/theme.service";

export function registerProcessLang(monaco: any, mode: Theme | null = 'light') {
  if (!monaco.languages.getLanguages().some((l: any) => l.id === 'bpmnRunner')) {
    monaco.languages.register({ id: 'bpmnRunner' });
  }

  monaco.languages.setMonarchTokensProvider('bpmnRunner', {
    keywords: [
      'pool', 'process', 'start', 'task', 'end', 'gateway',
      'scope', 'yes', 'no', 'message'
    ],
    taskTypes: ['MANUAL', 'USER', 'AUTO'],
    gatewayTypes: ['EXCLUSIVE', 'PARALLEL'],
    tokenizer: {
      root: [
        [/[a-zA-Z_][\w_]*/, {
          cases: {
            '@keywords': 'keyword',
            '@taskTypes': 'type',
            '@gatewayTypes': 'type',
            '@default': 'identifier'
          }
        }],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/[{}()\[\]]/, 'delimiter'],
        [/->/, 'operator'],
        [/[;,]/, 'delimiter'],
        [/[0-9]+/, 'number'],
        [/\/\/.*$/, 'comment'],
        [/\/\*.*?\*\//, 'comment'],
      ]
    }
  });

  monaco.languages.setLanguageConfiguration('bpmnRunner', {
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
    ],
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    }
  });

  const gradientColors = {
    red: 'ed0100',
    pink: 'e449b4',
    violet: 'ae3bfc',
    purple: '7f15fd'
  };

  const lightTheme = {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: gradientColors.purple, fontStyle: 'bold' },
      { token: 'type', foreground: gradientColors.violet, fontStyle: 'bold' },
      { token: 'string', foreground: gradientColors.pink },
      { token: 'number', foreground: gradientColors.red },
      { token: 'comment', foreground: '9e9e9e', fontStyle: 'italic' },
      { token: 'identifier', foreground: '212121' },
      { token: 'operator', foreground: gradientColors.violet },
      { token: 'delimiter', foreground: '616161' },
    ],
    colors: {
      'editor.background': '#fafafa',
      'editorLineNumber.foreground': '#9e9e9e',
      'editorLineNumber.activeForeground': `#${gradientColors.violet}`,
      'editorCursor.foreground': `#${gradientColors.purple}`,
      'editor.selectionBackground': '#f3e5f5',
      'editor.lineHighlightBackground': '#ede7f6',
      'editor.foreground': '#212121',
    },
  };

  const darkTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: gradientColors.red, fontStyle: 'bold' },
      { token: 'type', foreground: gradientColors.pink, fontStyle: 'bold' },
      { token: 'string', foreground: gradientColors.violet },
      { token: 'number', foreground: gradientColors.purple },
      { token: 'comment', foreground: '8c8c8c', fontStyle: 'italic' },
      { token: 'identifier', foreground: 'e0e0e0' },
      { token: 'operator', foreground: gradientColors.violet },
      { token: 'delimiter', foreground: 'bdbdbd' },
    ],
      colors: {
        // 🔳 Fundo bem escuro, neutro
        'editor.background': '#0d0d0d',

        // 🔹 Linhas e números de linha
        'editorLineNumber.foreground': '#444',
        'editorLineNumber.activeForeground': '#ae3bfc',

        // 🔹 Cursor e seleção sutis
        'editorCursor.foreground': '#e449b4',
        'editor.selectionBackground': '#312244',
        'editor.lineHighlightBackground': '#151515',

        // 🔹 Texto base e bordas
        'editor.foreground': '#e0e0e0',
        'editorWhitespace.foreground': '#252525',
        'editorIndentGuide.background': '#2b2b2b',
        'editorIndentGuide.activeBackground': '#3a3a3a',
        'editorGutter.background': '#0d0d0d',
    },
  };

  monaco.editor.defineTheme('bpmnRunner-light', lightTheme);
  monaco.editor.defineTheme('bpmnRunner-dark', darkTheme);
  monaco.editor.setTheme(mode === 'dark' ? 'bpmnRunner-dark' : 'bpmnRunner-light');

  monaco.languages.registerCompletionItemProvider('bpmnRunner', {
    triggerCharacters: [',', ' '],
    provideCompletionItems: (model: any, position: any) => {
        const suggestions: any[] = [];
        const lineContent = model.getLineContent(position.lineNumber);
        const textBeforeCursor = lineContent.substring(0, position.column - 1);

        const taskMatch = /task\s*\(\s*[^,]+,\s*"[^"]*"\s*,\s*$/i.test(textBeforeCursor);
        if (taskMatch) {
            return {
                suggestions: ['MANUAL', 'USER', 'AUTO'].map(type => ({
                label: type,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: type,
                documentation: `Task type: ${type}.`,
                })),
            };
        }

        const gatewayMatch = /gateway\s*\(\s*[^,]+,\s*"[^"]*"\s*,\s*$/i.test(textBeforeCursor);
        if (gatewayMatch) {
            return {
                suggestions: ['PARALLEL', 'EXCLUSIVE'].map(type => ({
                label: type,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: type,
                documentation: `Gateway type: ${type}.`,
                })),
            };
        }

        suggestions.push(
        {
            label: 'pool',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'pool(${1:id}, "${2:label}") {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a new pool (main process container).',
        },
        {
            label: 'process',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'process(${1:id}, "${2:label}") {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a BPMN process inside the pool.',
        },
        {
            label: 'task',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'task(${1:id}, "${2:label}", ${3:MANUAL});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a task (MANUAL, USER, or AUTO).',
        },
        {
            label: 'gateway',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'gateway(${1:id}, "${2:label}", ${3:PARALLEL}) {\n\t$0\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a gateway (EXCLUSIVE or PARALLEL).',
        },
        {
            label: 'start',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'start(${1:id});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines the start event of the process.',
        },
        {
            label: 'end',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'end(${1:id});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines the end event of the process.',
        },
        {
            label: 'message',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '-> message(${1:id});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a message reference element.',
        },
        {
            label: 'exclusiveGateway',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
            'gateway(${1:id}, "${2:label}", EXCLUSIVE) {\n  yes -> {\n    $0\n  }\n  no -> {\n  }\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates an EXCLUSIVE gateway with yes/no conditional branches.',
        },
        {
            label: 'parallelGateway',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
            'gateway(${1:id}, "${2:label}", PARALLEL) {\n  scope -> {\n    $0\n  }\n};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a PARALLEL gateway with one or more concurrent scopes.',
        },
        {
            label: 'manualTask',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
            'task(${1:id}, "${2:label}", MANUAL);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a MANUAL task.',
        },
        {
            label: 'autoTask',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
            'task(${1:id}, "${2:label}", AUTO);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a AUTO task.',
        },
        {
            label: 'userTask',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
            'task(${1:id}, "${2:label}", USER);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a USER task.',
        });
        return { suggestions };
    }});
}
