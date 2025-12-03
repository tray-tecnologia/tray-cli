# Theme SDK

Kit de desenvolvimento feito para interagir com as APIs do Opencode da Tray, facilitando as atualizações e suporte a novas versões. Criado utilizando NodeJs e Typescript. Essa versão funciona somente com o **Studio**.

## Índice

-   [Instalação](#instalação)
-   [Estrutura dos temas](#estrutura-dos-temas)
-   [Uso](#uso)
    -   [Métodos](#métodos)
    -   [Modo depuração](#modo-depuração)
    -   [Tipos](#tipos)
-   [Erros](#erros)
-   [Contribuições](#contribuições)
-   [Licença](#licença)

## Instalação

Rode o comando abaixo para fazer a instalação desse pacote.

```shell
npm install @tray-tecnologia/theme-sdk
```

Esse pacote é ESM (ECMAScript Modules). CommonJS não é suportado. Se desejar usar esse pacote atualize seu código para usar ESM.

## Estrutura dos temas

Os temas precisam seguir uma estrutura bem determinada, caso contrário os arquivos não serão aceitos dentro da API. A estrutura a seguir ilustra as pastas obrigatórios dentro do tema.

```
├── configs
├── css
├── elements
│   └── snippets
├── img
├── js
├── layouts
├── pages
│   └── lp
```

Se atente também as seguintes regras:
- Somente as pastas `configs`, `css`, `img`, `elements` e `js` suportam subpastas livremente. Tentar criar pastas nas outras pastas irá gerar o erro [FolderNotAllowedError](#foldernotallowederror-sdk0009);
- Somente os seguintes formatos são permitidos: `.ttf`, `.otf`, `.eot`, `.woff`, `.woff2`, `.jpg`, `.jpeg`, `.gif`, `.png`, `.svg`, `.css`, `.scss`, `.html`, `.js`, `.json`;
- Os nome dos arquivos devem possuir somente letras, números, ponto `.`, underline `_` e traços `-`. Qualquer outro caractere irá resultar no erro [InvalidFilenameError](#invalidfilenameerror-sdk0010);

## Uso

Todos os métodos disponíveis no SDK devolvem Promises. Ao serem resolvidas elas retornam os dados da API. Caso sejam rejeitadas possíveis erros podem ter acontecido.

Abaixo um exemplo simples de uso do SDK.

```js
import Sdk from '@tray-tecnologia/theme-sdk';

const client = new Sdk({
    token: 'YOUR-TOKEN-HERE',
    themeId: 1,
    debug: false,
});

client
    .checkConfiguration()
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

### Métodos

#### Construtor

Construtor da classe. Deve-se passar um objeto do tipo [Config](#config). Retorna uma instância de `Api`.

#### .checkConfiguration(): Promise\<ApiConfigurationResponse\>

Valida se os dados passados na criação do objeto estão corretos. Retorna objeto `ApiConfigurationResponse` se promise for resolvida ou uma instância de `ApiError` caso contrário.

#### .getThemes(): Promise\<ApiListThemesResponse\>

Obtém a lista de todos os temas disponíveis na loja. Retorna objeto `ApiListThemesResponse` se promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .createTheme(name: string, base: string = 'default'): Promise\<ApiCreateThemeResponse\>

Cria um tema na loja. Deve ser informado o parâmetro obrigatório `name`, que será o nome do tema na loja. O parâmetro opcional `base` indica qual tema deve ser usado como base para criação desse novo tema. Caso não seja informado, será usado o tema padrão da plataforma. Retorna objeto `ApiCreateThemeResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .deleteTheme(id: number): Promise\<boolean\>

Remove o tema informado. Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .getAssets(): Promise\<ApiAssetsResponse\>

Lista todos os arquivos do tema configurado. Retorna objeto `ApiAssetsResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .getAsset(asset: string): Promise\<ApiAssetContentResponse\>

Obtém o conteúdo do arquivo solicitado. Retorna objeto `ApiAssetContentResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .sendAsset({ asset, data, isBinary }: SendAsset): Promise\<boolean\>

Cria ou atualiza um arquivo no tema configurado. Deve-se passar um objeto do tipo [SendAsset](#sendasset). Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .deleteAsset(asset: string): Promise\<boolean\>

Remove um arquivo do tema informado. Deve ser informado o parâmetro `asset` contento o nome do arquivo a ser removido. **Atenção:** ele precisa iniciar com uma barra `/`. Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

### Modo depuração

O SDK contá com uma opção de depuração. Ao passar o parâmetro `debug: true` na inicialização da API faz com que um arquivo de log seja gerado para toda operação realizada com o SDK. Por padrão essa opção vem desabilitada. O nome do arquivo de depuração gerado é `.debug.sdk.log`. Por iniciar com ponto `.` ele não é enviado para loja.

### Tipos

O Sdk possui alguns tipos especiais que são expostos e podem ser usados.

#### Config

Estrutura com dados para a configuração e conexão com a API da Tray.

```typescript
type Config = {
    token: string;
    themeId: number | null;
    debug?: boolean;
};
```

#### SendAsset

Estrutura com dados para ser enviado a API da Tray para criação e/ou atualização do arquivo.

```typescript
type SendAsset = {
    asset: string;
    data: Buffer;
    isBinary: boolean;
};
```

## Erros

O Theme SDK pode retornar vários erros que indicam problemas diferentes durante a execução do programa. Verifique cada um deles abaixo.

#### AuthenticationError (SDK::0001)

Retornado caso os dados de acesso estejam incorretos.

#### ValidationError (SDK::0002)

Retornado caso ocorra um erro em processar a informações enviadas.

#### TimeoutError (SDK::0003)

Retornado caso a requisição passe do tempo definido de retorno.

#### NotFoundError (SDK::0004)

Retornado caso a rota ou conteúdo seja inexistente.

#### ServerError (SDK::0005)

Retornado caso ocorra um erro na requisição para o servidor.

#### ThemeNotFoundError (SDK::0006)

Retornado caso o tema que esteja tentando alterar, seja inexistente.

#### AssetNotFoundError (SDK::0007)

Retornado ao tentar alterar um arquivo inexistente.

#### FileExtensionNotAllowedError (SDK::0008)

Retornado ao tentar enviar um arquivo com extensão não suportada.

#### FolderNotAllowedError (SDK::0009)

Retornado ao tentar enviar um arquivo fora das pastas padrões permitidas.

#### InvalidFilenameError (SDK::0010)

Retornado ao tentar enviar um arquivo com nome fora dos padrões permitidos.

#### RequestError (SDK::9001)

Retornado caso ocorra um erro no processo da requisição.

#### UnknownError (SDK::9999)

Retornado caso retorne um erro não mapeado.

## Contribuições

Opencode SDK é um projeto de código-fonte aberto no qual todos são bem-vindos a ajudar, contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades. Confira [Como contribuir com o projeto](contributing.md) e ajudá-lo a melhorar a cada dia.

## Licença

[GPLv3](license.md)
