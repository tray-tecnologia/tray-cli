# CLI

Interface de linha de comando desenvolvida em Node.js e TypeScript para ajudar desenvolvedores a criarem ótimos temas para Tray. Essa versão funciona somente com o **Studio**.


### Índice

-   [Instalação](#instalação)
-   [Linha de comando](#linha-de-comando)
    -   [tray help [command]](#tray-help-command)
    -   [tray configure [options] [token] [theme_id]](#tray-configure-options-token-theme_id)
    -   [tray list](#tray-list)
    -   [tray create [options] [token]](#tray-create-options-token)
    -   [tray delete [theme-id]](#tray-delete-theme-id)
    -   [tray download [files...]](#tray-download-files)
    -   [tray upload [options] [files...]](#tray-upload-options-files)
    -   [tray remove <files...>](#tray-remove-files)
    -   [tray watch](#tray-watch)
    -   [tray open](#tray-open)
-   [Api](#api)
-   [Erros](#erros)
-   [Contribuições](#contribuições)
-   [Créditos](#créditos)
-   [Licença](#licença)

## Instalação

Para usar esse programa basta instalar com os comandos abaixo. Recomendados fazer a instalação global. No Linux a instalação global necessita ser feita com administrador com o comando `sudo`.

```sh
# Instala globalmente no sistema (Recomendado)
npm install @tray-tecnologia/cli --global

# Instala na pasta local
npm install @tray-tecnologia/cli
```

Se desejar usar localmente, todos os comando abaixo precisaram ter acrescido `npx` antes para que ele seja executado corretamente.

## Migração

Apesar da nova versão ser muito similar com a anterior, alguns pontos importantes precisam de atenção:

- Nessa versão o nome do pacote foi renomeado de `@tray-tecnologia/tray-cli` para `@tray-tecnologia/cli`;
- Agora é necessário o Node 22 ou mais recente para rodar o projeto;
- O binário continua com o mesmo nome `tray`;
- O arquivo de configurações agora é armazenado em `.json`;
- `key` e `password` da versão antiga não funcionam nessa versão;

Caso rode o comando acima para instalar a nova versão e ainda seja apresentado com a versão antiga, recomendamos desinstalar todos os pacotes referente ao Tray CLI e reinstala-los novamente. Caso o problema persista, utilize o NVM [[Linux/Mac](https://github.com/nvm-sh/nvm)] [[Windows](https://github.com/coreybutler/nvm-windows)] para instalar o Node.

## Linux vs Windows

Todo o desenvolvimento do CLI foi feito exclusivamente no Linux. Testamos os comandos disponíveis no Windows, mas alguns podem não funcionar corretamente ou não ter a mesma eficiência se comparado com o Linux. Isso acontece devido a divergência entre como os sistemas operacionais lidam com os caminhos dos arquivos.

O autocompletar de arquivos ao realizar comandos não é um recurso do CLI e sim do Shell usado no Linux em algumas demonstrações, ou do terminal do Windows. Esse item não funciona igual no **Linux** e **Windows** e não é coberto pelo CLI. É dever do usuário entender o sistema que está usando e como esse recurso funciona em cada um.

No Linux, o CLI deve funcionar com qualquer terminal da sua distro. No Windows, recomendamos o uso junto ao WSL2 ou a um emulador de terminal Unix, como o mingw64 (disponível junto com a instalação do Git for Windows). 

Nesse momento o MacOS não é suportado oficialmente!

Caso achem problemas específicos de um sistema operacional, fiquem a vontade para [contribuir com o projeto](../../contributing.md) ou [abrir uma issue](https://github.com/tray-tecnologia/tray-cli/issues/new).

## Linha de comando

Os comandos abaixo estão disponíveis no programa. Parâmetros obrigatórios são indicados entre sinais de menor `<` e maior `>` e parâmetros opcionais entre colchetes `[]`. Parâmetros opcionais são independentes de ordem, ou seja, podem ser passados no início ou no final do comando.

### tray help [command]

Mostra uma listagem de todos os comando disponíveis, bem como uma descrição sucinta sobre o comando. Se o parâmetro `command` for passado mostra a ajuda específica do comando solicitado.

### tray configure [options] [token] [theme_id]

Cria o arquivo de configuração. Caso não passe os parâmetros acima o programa irá solicitá-los interativamente. A única opção disponível para esse comando é `--debug`. Isso fará com que arquivos de log sejam gerados na pasta raiz onde o comando é executado. Esses arquivos começam com `.` e são ignorados pelo programa. Caso deseja passar os parâmetros no comando, o parâmetro `token` deve vir entre aspas `""`.

### tray list

Lista todos os temas disponíveis atualmente na loja.

### tray create [options] [token]

Cria um novo tema na loja, contendo somente os arquivos necessários sem conteúdo para desenvolvimento de um tema do zero. É possível usar a opção `--debug` nesse comando para gerar arquivos de log sejam na pasta raiz onde o comando é executado. Esses arquivos começam com `.` e são ignorados pelo programa.

### tray delete [theme-id]

Deleta um tema da loja. Se o parâmetro opcional `theme-id` não for fornecido, o programa usará o tema configurado no arquivo `config.json`.

### tray download [files...]

Baixa os arquivos especificados do tema configurado. Se o parâmetro opcional `files` não for fornecido, o programa irá baixar todos os arquivos do tema.

### tray upload [options] [files...]

Envia os arquivos para a loja no tema configurado. Se o parâmetro opcional `files` não for fornecido, o programa irá enviar todos os arquivos, pastas e subpastas presentes na pasta raiz onde o comando é executado.

Esse comando possui a opção `--core`, que indica ao programa para enviar somente os arquivos essenciais, ignorando o arquivos `settings.json` e a pasta imagem por completo.

Esse comando suporta padrões Glob e usa a biblioteca [node-glob](https://github.com/isaacs/node-glob) para isso.

### tray remove <files...>

Remove os arquivos especificados do tema configurado. É obrigatório passar os arquivos que deseja remover. Esse comando suporta padrões Glob e usa a biblioteca [node-glob](https://github.com/isaacs/node-glob) para isso.

### tray watch

Monitora os arquivos para verificar se ocorreram mudanças e já realiza as devidas alterações na loja. Para garantir que o conteúdo dos arquivos sejam lidos corretamente, o CLI irá aguardar até que o arquivo acabe de escrever em disco. Essa detecção pode demorar até 1000 milissegundos (1 segundo).

**_Atenção_**: nem todas as operações do sistema de arquivos do seu computador são suportadas pela API da Tray. Apenas as operações de criação, atualização, remoção e renomeação de arquivos são suportadas. Operações com pastas não são suportadas e serão ignoradas.

### tray open

Abre o link de prévia do tema no navegador padrão.

## API

O Tray Cli também expõe uma API para que você possa usar integrar os commandos do CLI em outra ferramenta. Com exceção dos comandos `open` e `watch`, todos os outros comandos estão disponíveis nessa API.

Todos os métodos dessa API retornam uma `Promise`. Você deverá observá-la para detectar quando ela foi resolvida ou rejeitada. Como algumas operações demoram a serem executadas, recomendamos sempre executá-las de modo assíncrono.

Veja o exemplo abaixo de um uso simples para gerar a configuração do tema.

```js
import Tray from '@tray-tecnologia/cli';

const api = new Tray({
    token: 'SEU-TOKEN-AQUI',
    themeId: 1, // Id do meu tema
    debug: false,
});

api.configure()
    .then((success) => console.log(success))
    .catch((error) => console.error(error));
```

Esse pacote é ESM (ECMAScript Modules). CommonJS não é suportado. Se desejar usar esse pacote atualize seu código para usar ESM.

## Erros

O Tray Cli pode retornar vários erros que indicam problemas diferentes durante a execução do programa.

#### SaveConfigurationFileError (CLI::0001)

Retornado caso não seja possível salvar o arquivo de configurações necessário para todas as outras ações.

#### FileNotFoundError (CLI::0002)

Retornado caso não for encontrado o arquivo config.json na pasta atual.

#### ParameterNotDefinedError (CLI::0003)

Retornado quando algum parâmetro necessário não for informado.

#### SaveThemeAssetError (CLI::0004)

Retornado quando algum problema ocorre ao tentar salva o arquivo baixado do tema.

#### LoadThemeAssetError (CLI::0005)

Retornado quando o programa não consegue carregar os dados do arquivo do tema a ser enviado.

#### ThemeFilesNotFoundError (CLI::0006)

Retornado quando o programa não consegue listar automaticamente os arquivos a serem enviado para a loja.

#### ThemeBlockedError (CLI::0006)

Retornado quando o tema que deseja trabalhar está bloqueado.

#### UnknownError (CLI::9999)

Retornando quando um erro acontecer, mas que o programa não consegue identificar qual foi a causa.

## Contribuições

Tray CLI é um projeto de código fonte aberto no qual todos são bem-vindos a ajudar a comunidade contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades. Confira [Como contribuir com o projeto](contributing.md) e ajudá-lo a melhorar a cada dia.

## Licença

[GPLv3](license.md)
