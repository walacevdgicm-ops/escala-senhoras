# Escala de Senhoras

Gerador da escala anual do Trabalho de Senhoras. Você informa quantas irmãs participam, os nomes, o ano e o dia da semana do encontro, e o sistema distribui as funções de **Palavra**, **Louvor** e **Preparo** em rodízio e gera um PDF pronto para imprimir.

Fiz esse projeto porque a escala era montada à mão todo ano, o que levava tempo e sempre gerava alguma repetição ou alguém ficando de fora.

![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Como funciona

- O rodízio segue as tabelas do manual para grupos de 3 a 12 irmãs. Acima disso, usa uma fórmula que mantém a mesma ideia de distribuição.
- As datas são calculadas a partir do dia da semana escolhido, para o ano inteiro.
- Quando o mês tem 5ª semana, ela fica em aberto (escolha espontânea) e não conta no rodízio, então ninguém perde a vez.
- O PDF pode ser gerado para o ano todo, por semestre ou por trimestre.
- Tem tema claro e escuro, e funciona bem no celular.

## Como usar

Basta abrir o `index.html` no navegador. Não precisa de servidor.

O PDF é gerado com [jsPDF](https://github.com/parallax/jsPDF) e jsPDF-AutoTable, carregados por CDN, então é preciso estar com internet na hora de baixar.

## Arquivos

```
index.html   telas do passo a passo
script.js    regras do rodízio, cálculo das datas e geração do PDF
style.css    visual e temas claro/escuro
img/         logotipos (o logo-pdf.js é o logo em base64 usado no PDF)
```

---
Walace Soares Vidigal Junior · Licença MIT
