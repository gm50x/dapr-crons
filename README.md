# Como Fazer CRONS com Dapr...

Um projeto de exemplo sobre a utilização do DAPR. Neste projeto incluímos uma CRON e um SECRETSTORE.

## Componentes:

- CRON: Na pasta components você encontra o arquivo "cron.binding.yaml". Esse arquivo serve para que o dapr possa acionar repetidamente a rota 'POST /cron-executor' da aplicação de acordo com a configuração de cron (10s).
- SECRETS: Também é possível encontrar o arquivo "secrets.yaml". Por sua vez este faz o papel de armazenamento de segredos utilizados na aplicação direcionando para as chaves existentes no arquivo "secrets.json".

## Aplicação

- Para a criação de uma CRON, criamos uma RestAPI com uma rota que será acionada a cada evento de nossa CRON. A responsabilidade por fazer isso vem do arquivo components/cron.binding.yaml que mapea a rota que será acionada na propriedade metadata.name e fará a cada iteração uma chamada POST neste endpoint da API.

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  # Rota que será acionada na API :: POST /cron-executor
  name: cron-executor
spec:
  # Tipo de Binding (CRON)
  type: bindings.cron
  version: v1
  metadata:
    - name: schedule
      value: '@every 10s' # A cada 10 segundos
```

P.S.: Sua API não precisa ter apenas a rota da cron, inclusive ela pode ter várias crons sendo disparadas e também um misto de CRONs e outras rotas serviço a aplicação, desde que não aconteca uma 'race-condition' tudo dará certo!

## E qual é a mágica?

A mágica é que o Dapr sobe um 'sidecar' junto com a aplicação. Esse sidecar possui algumas funcionalidades básicas como por exemplo facilitar o acesso desta aplicação aos componentes declarados. Sendo assim, nosso secrets será disponibilizado para a nossa aplicação via HTTP na porta padrão 3500.

```javascript
/** main.js linhas 5~10 **/
async function getHardcodedSecret() {
  const store = 'mysecretstore'; /** NOME DO STORE **/
  const key = 'mysecretkey'; /** SECREDO QUE QUEREMOS OBTER **/
  const url = `http://localhost:3500/v1.0/secrets/${store}/${key}`;
  return axios.get(url).then((x) => x.data);
}
```

É isso mesmo! Via http://localhost:3500. Mesmo dentro de um container que 'é isolado'. E além disso o sidecar também ficará acionando nossas CRONs a cada iteração.

## Como eu executo essa aplicação?

Para executar esta aplicação basta executar o seguinte comando:

```bash
docker compose up --build
```

## [Dapr](https://dapr.io/) -> Distributed Applications Runtime

O Dapr é um facilitador para trabalhar com microserviços em containers. Ele nos ajuda na comunicação entre serviços e na criação de componentes que possam ser compartilhados entre serviços. Por exemplo, você pode criar um componente de segredos que pode ser facilmente utilizado por vários serviços sem a necessidade de ficar reinventando a roda a cada novo serviço para obter os acessos ao componente que já foi criado anteriormente.
