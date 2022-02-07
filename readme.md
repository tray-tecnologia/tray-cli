# Tray CLI

Interface de linha de comando desenvolvida em Node.js e TypeScript para ajudar desenvolvedores a criarem ótimos temas para Tray.

### Índice

-   [Instalação](#instalação)
-   [Comandos disponíveis](#comandos-disponíveis)
    -   [tray help [command]](#tray-help-command)
    -   [tray configure [options] [key] [password] [theme_id]](#tray-configure-options-key-password-theme_id)
    -   [tray list](#tray-list)
    -   [create [options] [key] [password] [theme-name] [theme-base]](#create-options-key-password-theme-name-theme-base)
    -   [clean-cache [theme-id]](#clean-cache-theme-id)
    -   [delete [theme-id]](#delete-theme-id)
    -   [download [files...]](#download-files)
    -   [upload [options] [files...]](#upload-options-files)
    -   [remove <files...>](#remove-files)
    -   [watch](#watch)
    -   [open](#open)
-   [Api](#api)
-   [Erros](#erros)
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

Os comandos abaixo estão disponíveis no programa. Todos eles se iniciam pela palavra `tray`. Parâmetros obrigatórios são indicados entre sinais de menor `<` e maior `>` e parâmetros opcionais entre colchetes `[]`. Parâmetros opcionais são independentes de ordem, ou seja, podem ser passados no início ou no final do comando.

### tray help [command]

Mostra uma listagem de todos os comando disponíveis, bem como uma descrição sucinta sobre o comando. Se o parâmetro `command` for passado mostra a ajuda específica do comando solicitado.

### tray configure [options] [key] [password] [theme_id]

Cria o arquivo de configuração. Caso não passe os parâmetros acima o programa irá solicitá-los interativamente. A única opção disponível para esse comando é `--debug`. Isso fará com que arquivos de log sejam gerados na pasta raiz onde o comando é executado. Esses arquivos começam com `.` e são ignorados pelo programa.

### tray list

Lista todos os temas disponíveis atualmente na loja.

### create [options] [key] [password] [theme-name] [theme-base]

Cria um novo tema na loja com o nome passado e baseado no tema base. Caso algum parâmetro não seja informado, o programa irá solicitá-lo. É possível usar a opçao `--debug` nesse comando para gerar arquivos de log sejam na pasta raiz onde o comando é executado. Esses arquivos começam com `.` e são ignorados pelo programa.

### clean-cache [theme-id]

Limpa o cache de um tema. Se o parâmetro opcional `theme-id` não for fornecido, o programa usará o tema configurado no arquivo `config.yml`.

### delete [theme-id]

Deleta um tema da loja. Se o parâmetro opcional `theme-id` não for fornecido, o programa usará o tema configurado no arquivo `config.yml`.

### download [files...]

Baixa os arquivos especificados do tema configurado. Se o parâmetro opcional `files` não for fornecido, o programa irá baixar todos os arquivos do tema.

### upload [options] [files...]

Envia os arquivos para a loja no tema configurado. Se o parâmetro opcional `files` não for fornecido, o programa irá enviar todos os arquivos, pastas e subpastas presentes na pasta raiz onde o comando é executado.

Esse comando possui a opçào `--core`, que indica ao programa para enviar somente os arquivos essenciais, ignorando o arquivos `settings.html` e a pasta imagem por completo.

Esse comando suporta padrões Glob e usa a biblioteca [node-glob](https://github.com/isaacs/node-glob) para isso.

### remove <files...>

Remove os arquivos especificados do tema configurado. É obrigatório passar os arquivos que deseja remover. Esse comando suporta padrões Glob e usa a biblioteca [node-glob](https://github.com/isaacs/node-glob) para isso.

### watch

Monitora os arquivos para verificar se ocorreram mudanças e já realiza as devidas alterações na loja. **_Atenção_**: nem todas as operações do sistema de arquivos do seu computador são suportadas pela API da Tray. Apenas as operações de criação, atualização, remoção e renomeação de arquivos são suportadas. Operações com pastas não são suportadas e serão ignoradas.

### open

Abre o link de prévia do tema no navegador padrão.

## API

O Tray Cli também expõe uma API para que você possa usar integrar os commandos do CLI em outra ferramenta. Com exceção dos comandos `open` e `watch`, todos os outros comandos estão disponíveis nessa API.

Todos os métodos dessa API retornam uma `Promise`. Você deverá observá-la para detectar quando ela foi resolvida ou rejeitada. Como algumas operações demoram a serem executadas, recomendamos sempre executá-las de modo assíncrono.

Veja o exemplo abaixo de um uso simples para gerar a configuração do tema

```js
const Tray = require('tray-cli');

const api = new Tray({
    key: 'MINHA-CHAVE-AQUI',
    password: 'MINHA-SENHA-AQUI',
    themeId: 1, // Id do meu tema
    debug: false,
});

api.configure()
    .then((success) => console.log(success))
    .catch((error) => console.error(error));
```

## Erros

O Tray Cli pode retornar vários erros que indicam problemas diferentes durante a execução do programa.

#### SaveConfigurationFileError (CLI::0001)

Retornado caso não seja possível salvar o arquivo de configurações necessário para todas as outras ações.

#### FileNotFoundError (CLI::0002)

Retornado caso não for encontrado o arquivo config.yml na pasta atual.

#### ParameterNotDefinedError (CLI::0003)

Retornado quando algum parâmetro necessário não for informado.

#### SaveThemeAssetError (CLI::0004)

Retornado quando algum problema ocorre ao tentar salva o arquivo baixado do tema.

#### LoadThemeAssetError (CLI::0005)

Retornado quando o programa não consegue carregar os dados do arquivo do tema a ser enviado.

#### ThemeFilesNotFoundError (CLI::0006)

Retornado quando o programa não consegue listar automaticamente os arquivos a serem enviado para a loja.

#### UnknownError (CLI::9999)

Retornando quando um erro acontecer, mas que o programa não consegue identificar qual foi a causa.

## Contribuições

Tray CLI é um projeto de código fonte aberto no qual todos são bem-vindos a ajudar a comunidade contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades.

## Licença

[GPLv3](license.md)
