# Tray CLI

Interface de linha de comando desenvolvida em Node.js e TypeScript para ajudar desenvolvedores a criarem ótimos temas para Tray.

### Índice

-   [Instalação](#instalação)
-   [Comandos disponíveis](#comandos-disponíveis)
    -   [tray help [command]](#tray-help-command)
    -   [tray configure [options] [key] [password] [theme_id] ](#tray-configure-key-password-theme_id)
-   [Contribuições](#contribuições)
-   [Créditos](#créditos)
-   [Licença](#licença)

## Instalação

Para usar esse programa basta instalar com os comandos abaixo. Recomendados fazer a instalação global. No linux a instalação global necessita ser feita com administrador com o comando `sudo`.

```sh
# Instala globalmente no sistema (Recomendado)
npm install tray-cli --global

# Instala na pasta local
npm install tray-cli
```

Se desejar usar localmente, todos os comando abaixo precisaram ter acrescido `npx` antes para que ele seja executado corretamente.

## Linha de comando

### Comandos disponíveis

Os comandos abaixo estão disponíveis no programa. Todos eles se iniciam pela palavra `tray`. Parâmetros obrigatórios são indicados entre maior/menor (<>) e parâmetros opcionais entre colchetes ([]). Parâmetros opcionais podem ser passados no início ou no final do comando.

### tray help [command]

Mostra uma listagem de todos os comando disponíveis, bem como uma descrição sucinta sobre o comando. Se o parâmetro `command` for passado mostra a ajuda específica do comando solicitado.

### tray configure [options] [key] [password] [theme_id]

Cria o arquivo de configuração. Caso não passe os parâmetros acima o programa irá solicitá-los interativamente.

A única opção disponível para esse comando é `--debug`. Isso fará com que arquivos de log sejam gerados na pasta raiz onde o comando é executado. Esses arquivos começam com `.` e são ignorados pelo programa.

## API

O Tray Cli também expõe uma API para que você possa usar integrar os commandos do CLI em outra ferramenta. Todos as opções disponíveis em linha de comando também estão acessíveis nessa API.

Todos os métodos dessa API retornam uma `Promise`. Você deverá observá-la para detectar quando ela foi resolvida ou rejeitada.

Veja o exemplo abaixo de um uso simples para gerar a configuração do tema

```js
const Tray = require('tray-cli');

const api = new Tray({
    key: 'MINHA-CHAVE-AQUI',
    password: 'MINHA-SENHA-AQUI',
    themeId: 1,
    debug: false,
});

api.configure().then((success) => console.log(success));
```

## Erros

O Tray-Cli pode retornar vários erros que indicam problemas diferentes durante a execução do programa.

#### SaveConfigurationFileError (CLI::0001)

Retornado caso não seja possível salvar o arquivo de configurações necessário para todas as outras ações.

#### FileNotFoundError (CLI::0002)

Retornado caso não for encontrado o arquivo config.yml na pasta atual.

#### ParameterNotDefinedError (CLI::0003)

Retornado quando algum parâmetro necessário não for informado.

#### UnknownError (CLI::9999)

Retornando quando um erro acontecer, mas que o programa não consegue identificar qual foi a causa.

## Contribuições

Tray CLI é um projeto de código fonte aberto no qual todos são bem-vindos a ajudar a comunidade contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades.

## Licença

[GPLv3](license.md)
